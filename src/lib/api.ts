import type { Question, PostalListItem, PostalDetail, FormState } from "@/types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getRandomQuestions(count: number, exclude: number[]): Promise<Question[]> {
  const params = new URLSearchParams({ count: String(count) });
  if (exclude.length) params.set("exclude", exclude.join(","));
  const res = await fetch(`${API}/questions/random?${params}`);
  if (!res.ok) throw new Error("Failed to fetch questions");
  return res.json();
}

export async function getPostales(): Promise<PostalListItem[]> {
  const res = await fetch(`${API}/postales`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch postales");
  return res.json();
}

export async function getPostal(id: number): Promise<PostalDetail> {
  const res = await fetch(`${API}/postales/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Postal not found");
  return res.json();
}

export async function deletePostal(id: number): Promise<void> {
  const res = await fetch(`${API}/postales/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete postal");
}

export async function deleteAnswer(id: number): Promise<void> {
  const res = await fetch(`${API}/postales/answers/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete answer");
}

export async function submitPostal(state: FormState): Promise<PostalDetail> {
  const form = new FormData();
  form.append("name", state.name);
  if (state.dedicatoria.trim()) form.append("dedicatoria", state.dedicatoria.trim());
  form.append("answers", JSON.stringify(state.answers));
  if (state.profilePhotoFile) form.append("profile_photo", state.profilePhotoFile);
  if (state.videoFile) form.append("video", state.videoFile);
  state.photoFiles.forEach((f) => form.append("photos", f));
  // Per-answer media files merged into photos
  Object.values(state.answerMediaFiles).forEach((files) =>
    files.forEach((f) => form.append("photos", f))
  );
  const res = await fetch(`${API}/postales`, { method: "POST", body: form });
  if (!res.ok) throw new Error("Failed to submit postal");
  return res.json();
}

export type { Question, PostalListItem, PostalDetail, FormState, AnswerIn } from "@/types";
