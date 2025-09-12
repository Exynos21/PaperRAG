// frontend/pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import FormData from "form-data";

export const config = {
  api: { bodyParser: false }, // important for formidable
};

const parseForm = (req: NextApiRequest) =>
  new Promise<{ files: formidable.Files; fields: formidable.Fields }>((resolve, reject) => {
    const form = formidable({ multiples: false });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ files, fields });
    });
  });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      return res.status(500).json({ error: "BACKEND_URL not set" });
    }

    const { files } = await parseForm(req);
    console.log("FILES RECEIVED:", files);

    // Grab the file (expect "file")
    const fileKey = Object.keys(files)[0];
    let file = (files as any)[fileKey];
    if (Array.isArray(file)) file = file[0];

    if (!file || !file.filepath) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("FORWARDING FILE TO BACKEND:", {
      filepath: file.filepath,
      originalFilename: file.originalFilename,
      mimetype: file.mimetype,
    });

    // Forward to backend with the correct "file" key
    const formData = new FormData();
    formData.append("file", fs.createReadStream(file.filepath), {
      filename: file.originalFilename ?? "upload.pdf",
      contentType: file.mimetype ?? "application/pdf",
    });

    const backendRes = await fetch(`${backendUrl.replace(/\/$/, "")}/ingest`, {
      method: "POST",
      body: formData as any,
      headers: formData.getHeaders(),
    });

    const payload = await backendRes.text();
    try {
      return res.status(backendRes.status).json(JSON.parse(payload));
    } catch {
      return res.status(backendRes.status).send(payload);
    }
  } catch (err: any) {
    console.error("Upload proxy error:", err);
    return res.status(500).json({ error: String(err?.message ?? err) });
  }
}
