import Link from "next/link";
import type { PostalListItem } from "@/types";

const ROTATIONS = ["rotate-[-3deg]", "rotate-[2deg]", "rotate-[-1deg]", "rotate-[3deg]", "rotate-[-2deg]"];

interface PolaroidCardProps {
  postal: PostalListItem;
  index: number;
}

export default function PolaroidCard({ postal, index }: PolaroidCardProps) {
  const rot = ROTATIONS[index % ROTATIONS.length];
  return (
    <Link href={`/galeria/${postal.id}`} className={`block ${rot} hover:rotate-0 hover:scale-105 transition-transform duration-200`}>
      <div className="bg-white p-2 pb-8 shadow-md border border-gray-200" style={{ width: 130 }}>
        <div className="w-full aspect-square bg-gradient-to-br from-cp-sky to-blue-200 overflow-hidden flex items-center justify-center">
          {postal.profile_photo_url ? (
            <img src={postal.profile_photo_url} alt={postal.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-5xl">🐧</span>
          )}
        </div>
        <p className="font-caveat text-center text-gray-600 text-sm mt-2 truncate">{postal.name} ♡</p>
      </div>
    </Link>
  );
}
