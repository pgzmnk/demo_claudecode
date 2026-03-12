// Re-export the shared Record type from lib/types as PhotoRecord for UI use
export type { Record as PhotoRecord } from "@/lib/types";

export interface UploadPayload {
  title: string;
  description: string;
  image: File;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
