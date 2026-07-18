export default function Header({
  left,
  center,
  right,
}: {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="sticky top-0 z-30 bg-ink/95 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-sm mx-auto flex items-center justify-between px-5 h-[52px]">
        <div className="flex items-center gap-2 min-w-0">{left}</div>
        <div className="flex-1 flex justify-center min-w-0">{center}</div>
        <div className="flex items-center gap-2 min-w-0">{right}</div>
      </div>
    </div>
  );
}