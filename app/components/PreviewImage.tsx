"use client";

import { useState } from "react";
import Image from "next/image";

export default function PreviewImage({
  previewImage,
}: {
  resumeId?: string;
  previewImage: string | null;
}) {
  const [imageLoadError, setImageLoadError] = useState(false);

  if (!previewImage) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-100 text-sm text-slate-500">
        Resume preview unavailable
      </div>
    );
  }

  if (imageLoadError) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-100 text-sm text-slate-500">
        Preview failed to load
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <Image
        src={previewImage}
        alt="Resume preview"
        fill
        className="object-contain"
        unoptimized
        onError={() => {
          setImageLoadError(true);
        }}
      />
    </div>
  );
}
