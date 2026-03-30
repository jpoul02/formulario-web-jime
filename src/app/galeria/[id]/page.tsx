import { getPostal } from "@/lib/api";
import PostalDetailView from "@/components/PostalDetail";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PostalPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  let postal;
  try {
    postal = await getPostal(id);
  } catch {
    notFound();
  }

  return (
    <main>
      <div className="max-w-lg mx-auto px-4 pt-4">
        <Link href="/galeria" className="font-nunito font-bold text-base text-cp-dark-blue hover:underline">← galería</Link>
      </div>
      <PostalDetailView postal={postal} />
    </main>
  );
}
