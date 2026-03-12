"use client";

import { useState, useEffect, useCallback } from "react";
import PhotoCard from "@/components/PhotoCard";
import UploadForm from "@/components/UploadForm";
import SkeletonCard from "@/components/SkeletonCard";
import { PhotoRecord, UploadPayload } from "@/types";

export default function GalleryPage() {
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch("/api/records");
      if (!res.ok) throw new Error(`Failed to load photos (${res.status})`);
      const data: PhotoRecord[] = await res.json();
      setPhotos(data);
      setFetchError(null);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Could not load photos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  async function handleUpload(payload: UploadPayload) {
    const formData = new FormData();
    formData.append("image", payload.image);
    formData.append("title", payload.title);
    formData.append("description", payload.description);

    const res = await fetch("/api/records", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? `Upload failed (${res.status})`);
    }

    const created: PhotoRecord = await res.json();
    setPhotos((prev) => [created, ...prev]);
  }

  async function handleDelete(id: string) {
    // Optimistic: remove immediately
    setDeletingIds((prev) => new Set(prev).add(id));
    setPhotos((prev) => prev.filter((p) => p.id !== id));

    try {
      const res = await fetch(`/api/records/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
    } catch {
      // Rollback: re-fetch to restore state
      await fetchPhotos();
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold text-gray-900 tracking-tight">Folio</span>
          </div>
          {!loading && (
            <span className="text-sm text-gray-400">
              {photos.length} {photos.length === 1 ? "photo" : "photos"}
            </span>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 items-start">
          {/* Upload sidebar */}
          <aside className="lg:sticky lg:top-20">
            <UploadForm onUpload={handleUpload} />
          </aside>

          {/* Gallery */}
          <section>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Gallery</h1>

            {fetchError && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
                {fetchError}{" "}
                <button
                  onClick={fetchPhotos}
                  className="underline font-medium hover:text-red-800 cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : photos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 20.25h18M9.75 9.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium mb-1">No photos yet</p>
                <p className="text-gray-400 text-sm">Upload your first photo using the form.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {photos.map((photo) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    onDelete={handleDelete}
                    isDeleting={deletingIds.has(photo.id)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
