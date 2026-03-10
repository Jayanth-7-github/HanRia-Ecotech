import express from "express";

import { storeUploadedFile, upload } from "../uploads.js";
import { buildTransporter, getMailRoutingDefaults } from "../mailer.js";
import { requireDb } from "../db.js";

import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";
import { Service } from "../models/Service.js";
import { TrainingProgram } from "../models/TrainingProgram.js";
import { Participant } from "../models/Participant.js";
import { CollaborationRequest } from "../models/CollaborationRequest.js";
import { CustomProductRequest } from "../models/CustomProductRequest.js";
import { ContactInquiry } from "../models/ContactInquiry.js";
import { FileAsset } from "../models/FileAsset.js";
import { Subscriber } from "../models/Subscriber.js";
import { SiteContent } from "../models/SiteContent.js";
import { AnalyticsEvent } from "../models/AnalyticsEvent.js";

const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

router.use(requireDb);

// Products
router.get("/products", async (req, res) => {
  const category = String(req.query?.category ?? "").trim();
  const q = String(req.query?.q ?? "").trim();

  const filter = {};
  if (category) filter.category = category;
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ];
  }

  const products = await Product.find(filter).sort({ created_at: -1 });
  res.json({ ok: true, products });
});

router.get("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ ok: false, error: "Not found" });
  res.json({ ok: true, product });
});

// Categories
router.get("/categories", async (_req, res) => {
  const categories = await Category.find().sort({ category_name: 1 });
  res.json({ ok: true, categories });
});

// Services
router.get("/services", async (_req, res) => {
  const services = await Service.find().sort({ createdAt: -1 });
  res.json({ ok: true, services });
});

// Training
router.get("/training-programs", async (_req, res) => {
  const programs = await TrainingProgram.find().sort({ createdAt: -1 });
  res.json({ ok: true, programs });
});

router.post("/training/register", async (req, res) => {
  const participant = await Participant.create({
    name: req.body?.name,
    email: req.body?.email,
    phone: req.body?.phone ?? "",
    institution: req.body?.institution ?? "",
    program_id: req.body?.program_id,
  });

  res.json({ ok: true, participant });
});

// Collaboration request
router.post(
  "/collaboration/request",
  upload.single("proposal"),
  async (req, res) => {
    const proposalUrl = req.file
      ? (await storeUploadedFile(req, req.file)).url
      : "";

    const record = await CollaborationRequest.create({
      name: req.body?.name,
      organization: req.body?.organization ?? "",
      email: req.body?.email,
      research_area: req.body?.research_area ?? "",
      proposal_file: proposalUrl,
      status: "submitted",
    });

    res.json({ ok: true, request: record });
  },
);

// Custom product request
router.post(
  "/custom-request",
  upload.single("attachment"),
  async (req, res) => {
    const attachmentUrl = req.file
      ? (await storeUploadedFile(req, req.file)).url
      : "";

    const record = await CustomProductRequest.create({
      company_name: req.body?.company_name,
      email: req.body?.email,
      industry: req.body?.industry ?? "",
      product_description: req.body?.product_description,
      material_preference: req.body?.material_preference ?? "",
      attachment: attachmentUrl,
      status: "submitted",
    });

    res.json({ ok: true, request: record });
  },
);

// Contact: store in DB; optionally notify via email
router.post("/contact", async (req, res) => {
  const name = String(req.body?.name ?? "").trim();
  const email = String(req.body?.email ?? "").trim();
  const subject = String(req.body?.subject ?? "").trim();
  const message = String(req.body?.message ?? "").trim();

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ ok: false, error: "name, email, message are required" });
  }

  const inquiry = await ContactInquiry.create({
    name,
    email,
    subject,
    message,
    status: "new",
  });

  let mailSent = false;
  try {
    const transporter = buildTransporter();
    const { mailTo, mailFrom } = getMailRoutingDefaults();
    const doc = await SiteContent.findOne();
    const configuredToRaw = String(doc?.contactEmail ?? "").trim();
    const configuredTo = configuredToRaw.includes("@") ? configuredToRaw : "";
    const effectiveTo = configuredTo || mailTo;
    if (transporter && effectiveTo && mailFrom) {
      const text = [
        `Name: ${name}`,
        `Email: ${email}`,
        subject ? `Subject: ${subject}` : null,
        "",
        "Message:",
        message,
        "",
        `Inquiry ID: ${inquiry._id}`,
      ]
        .filter(Boolean)
        .join("\n");

      await transporter.sendMail({
        to: effectiveTo,
        from: mailFrom,
        replyTo: email,
        subject: subject || `New contact form submission — ${name}`,
        text,
      });
      mailSent = true;
    }
  } catch (e) {
    console.warn("Contact email notification failed", e?.message ?? e);
  }

  return res.json({ ok: true, inquiry, mailSent });
});

// Files metadata
router.get("/files/:id", async (req, res) => {
  const file = await FileAsset.findById(req.params.id);
  if (!file) return res.status(404).json({ ok: false, error: "Not found" });
  res.json({ ok: true, file });
});

// Newsletter subscribe
router.post("/newsletter/subscribe", async (req, res) => {
  const email = String(req.body?.email ?? "").trim();
  if (!email)
    return res.status(400).json({ ok: false, error: "email required" });

  const existing = await Subscriber.findOne({ email });
  if (existing) return res.json({ ok: true, subscriber: existing });

  const subscriber = await Subscriber.create({ email });
  res.json({ ok: true, subscriber });
});

// Site content
router.get("/site-content", async (_req, res) => {
  const doc = (await SiteContent.findOne()) ?? (await SiteContent.create({}));
  res.json({ ok: true, content: doc });
});

// Analytics event
router.post("/analytics/event", async (req, res) => {
  const type = String(req.body?.type ?? "").trim();
  const path = String(req.body?.path ?? "").trim();
  const meta = req.body?.meta ?? {};

  if (!type) return res.status(400).json({ ok: false, error: "type required" });
  const event = await AnalyticsEvent.create({ type, path, meta });
  res.json({ ok: true, event });
});

export default router;
