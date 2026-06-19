import { Loader2 } from "lucide-react";

interface LoadingWidgetProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingWidget({ message = "Chargement...", fullScreen = false }: LoadingWidgetProps) {
  const content = (
    <div className="flex flex-col items-center gap-3 py-8">
      <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--color-primary)" }} />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );

  if (fullScreen) {
    return <div className="flex h-screen items-center justify-center" style={{ backgroundColor: "var(--color-bg)" }}>{content}</div>;
  }
  return content;
}
