export async function uploadAdminImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Select an image file");
  if (file.size > 10 * 1024 * 1024) throw new Error("Image must be 10 MB or smaller");

  // Attempt server upload for persistent storage
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      if (data.url) return data.url;
    }
  } catch (err) {
    console.warn("Server upload failed, falling back to client canvas WebP:", err);
  }

  // Graceful fallback: optimized WebP data URL
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("This browser could not process the image");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return canvas.toDataURL("image/webp", 0.72);
}

export async function uploadAdminRemoteUrl(url: string): Promise<string> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("Enter a valid image URL");
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error("Image URLs must use HTTP or HTTPS");
  }
  return parsed.toString();
}
