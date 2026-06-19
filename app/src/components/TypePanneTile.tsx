interface TypePanneTileProps {
  type: string;
  icon: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function TypePanneTile({ type, icon, selected = false, onClick }: TypePanneTileProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 transition-all active:scale-95"
      style={{
        borderColor: selected ? "var(--color-primary)" : "#e5e7eb",
        backgroundColor: selected ? "var(--color-primary-light)" : "#ffffff",
      }}
    >
      <span className="text-3xl">{icon}</span>
      <span
        className="text-center text-xs font-medium leading-tight"
        style={{ color: selected ? "var(--color-primary)" : "#374151" }}
      >
        {type}
      </span>
    </button>
  );
}
