"use client";

import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  color: "blue" | "green" | "amber" | "red" | "purple";
}

const colorMap = {
  blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  green: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  red: "bg-red-500/10 text-red-500 border-red-500/20",
  purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color,
}: StatCardProps) {
  return (
    <div className="card flex items-start gap-5 group hover:border-primary-500/50 transition-all duration-300">
      <div className={`rounded-2xl p-4 border transition-transform duration-300 group-hover:scale-110 ${colorMap[color]}`}>
        <Icon className="h-7 w-7" />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{title}</p>
        <p className="mt-1 text-3xl font-black text-white">{value}</p>
        {(subtitle || trend) && (
          <div className="mt-2 flex items-center gap-2">
            {trend && (
              <span
                className={`text-xs font-bold ${
                  trend.positive ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {trend.positive ? "+" : "-"}
                {trend.value}%
              </span>
            )}
            {subtitle && (
              <span className="text-[10px] font-bold uppercase tracking-wide text-gray-600">{subtitle}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
