"use client";

import Image from "next/image";
import { PhotoRecord } from "@/types";

interface PhotoCardProps {
  photo: PhotoRecord;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export default function PhotoCard({ photo, onDelete, isDeleting }: PhotoCardProps) {
  const formattedDate = new Date(photo.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${
        isDeleting ? "opacity-40 scale-95 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={photo.imageUrl}
          alt={photo.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base leading-tight truncate mb-1">
          {photo.title}
        </h3>
        {photo.description && (
          <p className="text-gray-500 text-sm line-clamp-2 mb-3">{photo.description}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-400">{formattedDate}</span>
          <button
            onClick={() => onDelete(photo.id)}
            disabled={isDeleting}
            aria-label={`Delete ${photo.title}`}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 font-medium cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
