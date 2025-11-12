"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function PreviewImage({ resumeId }: { resumeId: string }) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchPreview() {
      try {
        const response = await fetch(`/api/resumes/${resumeId}/preview`);
        if (!response.ok) {
          if (!cancelled) {
            setFetchError(true);
            setIsLoading(false);
          }
          return;
        }

        const result = await response.json();
        if (result.success && result.previewImage && !cancelled) {
          setPreviewImage(result.previewImage);
        } else if (!cancelled) {
          setFetchError(true);
        }
      } catch {
        if (!cancelled) {
          setFetchError(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchPreview();

    return () => {
      cancelled = true;
    };
  }, [resumeId]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-100 text-sm text-slate-500">
        Loading preview...
      </div>
    );
  }

  if (fetchError || !previewImage) {
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
