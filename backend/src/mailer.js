import nodemailer from "nodemailer";

function getEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) return null;
  return value.trim();
}

function getFirstEnv(names) {
  for (const name of names) {
    const value = getEnv(name);
    if (value) return value;
  }
  return null;
}

function isGmailAddress(email) {
  const lower = String(email ?? "").toLowerCase();
  return lower.endsWith("@gmail.com") || lower.endsWith("@googlemail.com");
}

export function getMailRoutingDefaults() {
  const smtpUser = getEnv("SMTP_USER");
  const mailTo = getEnv("MAIL_TO") ?? smtpUser;
  const mailFrom = getEnv("MAIL_FROM") ?? smtpUser;
  return { smtpUser, mailTo, mailFrom };
}

export function buildTransporter() {
  const user = getEnv("SMTP_USER");
  const pass = getFirstEnv(["SMTP_PASS", "SMTP_PASSWORD", "SMPT_PASSWORD"]);

  let host = getEnv("SMTP_HOST");
  let portValue = getEnv("SMTP_PORT");
  let secureValue = getEnv("SMTP_SECURE");

  if (
    user &&
    pass &&
    (!host || !portValue || !secureValue) &&
    isGmailAddress(user)
  ) {
    host = "smtp.gmail.com";
    portValue = "465";
    secureValue = "true";
  }

  if (!host || !portValue || !secureValue || !user || !pass) return null;

  const port = Number(portValue);
  const secure = secureValue.toLowerCase() === "true";

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}
