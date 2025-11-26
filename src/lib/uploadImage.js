// src/lib/uploadImage.js
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result); // "data:image/png;base64,...."
    reader.onerror = () => reject(new Error("Failed to read file as base64"));
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads image to your server API which forwards to Cloudinary.
 * Returns the uploaded image URL on success.
 */
export async function uploadImageToCloudinary(file, folder = "planpal") {
  if (!file) throw new Error("No file provided to uploadImageToCloudinary");
  // optional client-side guard
  const MAX_MB = 8;
  if (file.size > MAX_MB * 1024 * 1024) {
    throw new Error(`File too large — must be under ${MAX_MB} MB`);
  }

  const base64 = await fileToBase64(file);

  const res = await fetch("/api/upload-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64, folder }),
  });

  const text = await res.text();
  // try parse JSON even on failure so we can surface Cloudinary error message
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = { raw: text };
  }

  if (!res.ok) {
    // include Cloudinary or server error details for debugging
    const errMsg =
      parsed?.error ||
      parsed?.raw ||
      `Cloudinary upload failed with status ${res.status}`;
    const err = new Error(`Cloudinary upload failed: ${errMsg}`);
    err.status = res.status;
    err.response = parsed;
    throw err;
  }

  if (!parsed?.url) {
    const err = new Error(`Upload succeeded but no URL returned: ${JSON.stringify(parsed)}`);
    err.response = parsed;
    throw err;
  }

  return parsed.url;
}
