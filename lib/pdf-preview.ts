export async function generatePreview(
  filePath: string,
): Promise<string | null> {
  try {
    const { pdf } = await import("pdf-to-img");
    const document = await pdf(filePath, { scale: 2.0 });

    const page = await document.getPage(1);
    if (!page) {
      return null;
    }

    const imageBuffer = Buffer.from(page);
    const base64Image = imageBuffer.toString("base64");
    const dataUrl = `data:image/png;base64,${base64Image}`;

    if (dataUrl.length > 5_000_000) {
      return null;
    }

    return dataUrl;
  } catch (error) {
    console.error("Preview generation failed:", error);
    return null;
  }
}
