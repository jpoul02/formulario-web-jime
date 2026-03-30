interface CPCardProps {
  step?: string;
  title: string;
  children: React.ReactNode;
}

export default function CPCard({ step, title, children }: CPCardProps) {
  return (
    <div className="bg-white border-[3px] border-cp-blue rounded-2xl shadow-cp overflow-hidden mb-4">
      <div className="bg-gradient-to-r from-cp-dark-blue to-cp-blue px-4 py-2 flex items-center gap-2">
        {step && <span className="font-pixel text-[10px] text-blue-200">{step}</span>}
        <span className="font-pixel text-[10px] text-white">{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
