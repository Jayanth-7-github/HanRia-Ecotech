import express from "express";

import { config } from "../config.js";
import { requireDb } from "../db.js";
import { requireAdmin, signAdminToken } from "../middleware/adminAuth.js";
import { storeUploadedFile, upload } from "../uploads.js";
import { buildTransporter, getMailRoutingDefaults } from "../mailer.js";

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
import { InventoryItem } from "../models/InventoryItem.js";

const router = express.Router();

router.post("/login", (req, res) => {
  const key = String(req.body?.key ?? "").trim();
  if (!config.adminKey) {
    return res.status(500).json({ ok: false, error: "ADMIN_KEY not set" });
  }
  if (!key || key !== config.adminKey) {
    return res.status(401).json({ ok: false, error: "Invalid admin key" });
  }

  const token = signAdminToken();
  return res.json({ ok: true, token });
});

router.use(requireDb);
router.use(requireAdmin);

// Products
router.get("/products", async (_req, res) => {
  const products = await Product.find().sort({ created_at: -1 });
  res.json({ ok: true, products });
});

router.post(["/products", "/add-product"], async (req, res) => {
  const payload = req.body ?? {};

  const name = String(payload.name ?? "").trim();
  const category = String(payload.category ?? "").trim();
  if (!name || !category) {
    return res
      .status(400)
      .json({ ok: false, error: "name and category are required" });
  }

  const product = await Product.create({
    name,
    category,
    description: payload.description ?? "",
    image: payload.image ?? "",
    document: payload.document ?? "",
    applications: Array.isArray(payload.applications)
      ? payload.applications
      : [],
    materials: Array.isArray(payload.materials) ? payload.materials : [],
  });
  res.json({ ok: true, product });
});

router.put(["/products/:id", "/update-product/:id"], async (req, res) => {
  if (Object.prototype.hasOwnProperty.call(req.body ?? {}, "category")) {
    const nextCategory = String(req.body?.category ?? "").trim();
    if (!nextCategory) {
      return res
        .status(400)
        .json({ ok: false, error: "category cannot be empty" });
    }
  }
  if (Object.prototype.hasOwnProperty.call(req.body ?? {}, "name")) {
    const nextName = String(req.body?.name ?? "").trim();
    if (!nextName) {
      return res.status(400).json({ ok: false, error: "name cannot be empty" });
    }
  }

  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updated) return res.status(404).json({ ok: false, error: "Not found" });
  res.json({ ok: true, product: updated });
});

router.delete(["/products/:id", "/delete-product/:id"], async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ ok: false, error: "Not found" });
  res.json({ ok: true });
});

// Categories
router.get("/categories", async (_req, res) => {
  const categories = await Category.find().sort({ category_name: 1 });
  res.json({ ok: true, categories });
});

router.post(["/categories", "/add-category"], async (req, res) => {
  const category = await Category.create({
    category_name: req.body?.category_name,
    description: req.body?.description ?? "",
  });
  res.json({ ok: true, category });
});

router.delete("/categories/:id", async (req, res) => {
  const deleted = await Category.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ ok: false, error: "Not found" });
  res.json({ ok: true });
});

// Services
router.get("/services", async (_req, res) => {
  const services = await Service.find().sort({ createdAt: -1 });
  res.json({ ok: true, services });
});

router.post("/services", async (req, res) => {
  const service = await Service.create({
    title: req.body?.title,
    description: req.body?.description ?? "",
  });
  res.json({ ok: true, service });
});

router.put("/services/:id", async (req, res) => {
  const updated = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updated) return res.status(404).json({ ok: false, error: "Not found" });
  res.json({ ok: true, service: updated });
});

router.delete("/services/:id", async (req, res) => {
  const deleted = await Service.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ ok: false, error: "Not found" });
  res.json({ ok: true });
});

// Training
router.get("/training-programs", async (_req, res) => {
  const programs = await TrainingProgram.find().sort({ createdAt: -1 });
  res.json({ ok: true, programs });
});

router.post("/training-programs", async (req, res) => {
  const program = await TrainingProgram.create({
    title: req.body?.title,
    description: req.body?.description ?? "",
    date: req.body?.date ? new Date(req.body.date) : undefined,
    duration: req.body?.duration ?? "",
    location: req.body?.location ?? "",
    mode: req.body?.mode,
  });
  res.json({ ok: true, program });
});

router.put("/training-programs/:id", async (req, res) => {
  const update = { ...req.body };
  if (update.date) update.date = new Date(update.date);
  const updated = await TrainingProgram.findByIdAndUpdate(
    req.params.id,
    update,
    {
      new: true,
    },
  );
  if (!updated) return res.status(404).json({ ok: false, error: "Not found" });
  res.json({ ok: true, program: updated });
});

router.delete("/training-programs/:id", async (req, res) => {
  const deleted = await TrainingProgram.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ ok: false, error: "Not found" });
  res.json({ ok: true });
});

router.get("/participants", async (_req, res) => {
  const participants = await Participant.find()
    .populate("program_id")
    .sort({ createdAt: -1 });
  res.json({ ok: true, participants });
});

// Inquiries / Contacts
router.get("/contacts", async (_req, res) => {
  const contacts = await ContactInquiry.find().sort({ created_at: -1 });
  res.json({ ok: true, contacts });
});

router.put("/contacts/:id/status", async (req, res) => {
  const status = String(req.body?.status ?? "").trim();
  const updated = await ContactInquiry.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  );
  if (!updated) return res.status(404).json({ ok: false, error: "Not found" });
  res.json({ ok: true, contact: updated });
});

router.post("/contacts/:id/reply", async (req, res) => {
  const contact = await ContactInquiry.findById(req.params.id);
  if (!contact) return res.status(404).json({ ok: false, error: "Not found" });

  const replyText = String(req.body?.message ?? "").trim();
  if (!replyText) {
    return res.status(400).json({ ok: false, error: "Reply message required" });
  }

  const transporter = buildTransporter();
  const { mailFrom } = getMailRoutingDefaults();

  if (!transporter || !mailFrom) {
    return res.status(500).json({
      ok: false,
      error: "Email not configured (SMTP + MAIL_FROM)",
    });
  }

  await transporter.sendMail({
    to: contact.email,
    from: mailFrom,
    subject: `Re: ${contact.subject || "Your inquiry"}`,
    text: replyText,
  });

  res.json({ ok: true });
});

// Collaboration
router.get("/collaboration", async (_req, res) => {
  const requests = await CollaborationRequest.find().sort({ submitted_at: -1 });
  res.json({ ok: true, requests });
});

router.put("/collaboration/:id/status", async (req, res) => {
  const status = String(req.body?.status ?? "").trim();
  const updated = await CollaborationRequest.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  );
  if (!updated) return res.status(404).json({ ok: false, error: "Not found" });
  res.json({ ok: true, request: updated });
});

// Custom requests
router.get("/custom-requests", async (_req, res) => {
  const requests = await CustomProductRequest.find().sort({ created_at: -1 });
  res.json({ ok: true, requests });
});

router.put("/custom-requests/:id/status", async (req, res) => {
  const status = String(req.body?.status ?? "").trim();
  const updated = await CustomProductRequest.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  );
  if (!updated) return res.status(404).json({ ok: false, error: "Not found" });
  res.json({ ok: true, request: updated });
});

// Site content
router.get("/site-content", async (_req, res) => {
  const doc = (await SiteContent.findOne()) ?? (await SiteContent.create({}));
  res.json({ ok: true, content: doc });
});

router.put("/site-content", async (req, res) => {
  const update = {
    vision: req.body?.vision ?? "",
    mission: req.body?.mission ?? "",
    technologies: Array.isArray(req.body?.technologies)
      ? req.body.technologies
      : [],
    contactEmail: req.body?.contactEmail ?? "",
    contactLocation: req.body?.contactLocation ?? "",
  };

  const doc = await SiteContent.findOne();
  const saved = doc
    ? await SiteContent.findByIdAndUpdate(doc._id, update, { new: true })
    : await SiteContent.create(update);

  res.json({ ok: true, content: saved });
});

// Files
router.post("/files", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, error: "file is required" });
  }

  const stored = await storeUploadedFile(req, req.file);
  const url = stored.url;
  const asset = await FileAsset.create({
    file_name: req.file.originalname,
    file_type: req.file.mimetype,
    file_path: stored.filePath,
    url,
    uploaded_by: "admin",
  });

  res.json({ ok: true, file: asset });
});

router.get("/files", async (_req, res) => {
  const files = await FileAsset.find().sort({ createdAt: -1 });
  res.json({ ok: true, files });
});

// Newsletter
router.get("/subscribers", async (_req, res) => {
  const subscribers = await Subscriber.find().sort({ subscribed_at: -1 });
  res.json({ ok: true, subscribers });
});

router.post("/newsletter/send", async (req, res) => {
  const subject = String(req.body?.subject ?? "").trim();
  const text = String(req.body?.text ?? "").trim();
  if (!subject || !text) {
    return res
      .status(400)
      .json({ ok: false, error: "subject and text required" });
  }

  const transporter = buildTransporter();
  const { mailFrom } = getMailRoutingDefaults();
  if (!transporter || !mailFrom) {
    return res.status(500).json({ ok: false, error: "Email not configured" });
  }

  const subscribers = await Subscriber.find();
  const recipients = subscribers.map((s) => s.email);
  if (recipients.length === 0) {
    return res.json({ ok: true, sent: 0 });
  }

  await transporter.sendMail({
    from: mailFrom,
    bcc: recipients,
    subject,
    text,
  });

  res.json({ ok: true, sent: recipients.length });
});

// Analytics (basic)
router.get("/analytics/summary", async (_req, res) => {
  const total = await AnalyticsEvent.countDocuments();
  const pageViews = await AnalyticsEvent.countDocuments({ type: "page_view" });
  res.json({ ok: true, total, pageViews });
});

// Inventory
router.get("/inventory", async (_req, res) => {
  const items = await InventoryItem.find().populate("product_id");
  res.json({ ok: true, items });
});

router.post("/inventory", async (req, res) => {
  const item = await InventoryItem.create({
    product_id: req.body?.product_id,
    quantity: Number(req.body?.quantity ?? 0),
    production_date: req.body?.production_date
      ? new Date(req.body.production_date)
      : new Date(),
  });
  res.json({ ok: true, item });
});

export default router;
