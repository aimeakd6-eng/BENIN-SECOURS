import { Star } from "lucide-react";

interface EtoilesWidgetProps {
  note: number;
  onChange?: (note: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export default function EtoilesWidget({
  note,
  onChange,
  readonly = false,
  size = "md",
}: EtoilesWidgetProps) {
  const starClass = sizeMap[size];

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => !readonly && onChange?.(i)}
          disabled={readonly}
          className={`${readonly ? "" : "transition-transform active:scale-125"}`}
        >
          <Star
            className={`${starClass} ${
              i <= note
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}
