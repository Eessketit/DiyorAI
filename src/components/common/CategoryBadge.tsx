import React from "react";
import {
  Flame,
  Mountain,
  Landmark,
  Sparkles,
  UtensilsCrossed,
  Waves,
  TreePine,
  Compass,
  Snowflake,
  CableCar,
  Clock,
  ShieldCheck,
  LucideIcon,
} from "lucide-react";

interface CategoryBadgeProps {
  label: string;
  icon?: string | LucideIcon;
  className?: string;
}

export default function CategoryBadge({ label, icon, className = "" }: CategoryBadgeProps) {
  // Determine icon component
  const renderIcon = () => {
    if (!icon) {
      // Auto-detect based on label content if no explicit icon
      const lower = label.toLowerCase();
      if (lower.includes("топ") || lower.includes("top") || lower.includes("bestseller") || lower.includes("бестселлер") || lower.includes("ommabop")) {
        return <Flame className="w-3 h-3 text-majolica shrink-0" />;
      }
      if (lower.includes("гранд") || lower.includes("grand") || lower.includes("уикенд") || lower.includes("leisure") || lower.includes("премиум")) {
        return <Sparkles className="w-3 h-3 text-majolica shrink-0" />;
      }
      if (lower.includes("арт") || lower.includes("архитектур") || lower.includes("art") || lower.includes("modernism") || lower.includes("шахар")) {
        return <Landmark className="w-3 h-3 text-majolica shrink-0" />;
      }
      if (lower.includes("хайкинг") || lower.includes("гор") || lower.includes("hike") || lower.includes("mountain") || lower.includes("faol")) {
        return <Mountain className="w-3 h-3 text-majolica shrink-0" />;
      }
      if (lower.includes("гастро") || lower.includes("food") || lower.includes("oshxona") || lower.includes("шашлык")) {
        return <UtensilsCrossed className="w-3 h-3 text-majolica shrink-0" />;
      }
      if (lower.includes("эко") || lower.includes("eco") || lower.includes("лес") || lower.includes("hordiq")) {
        return <TreePine className="w-3 h-3 text-majolica shrink-0" />;
      }
      if (lower.includes("вод") || lower.includes("озер") || lower.includes("water") || lower.includes("lake") || lower.includes("cho'milish")) {
        return <Waves className="w-3 h-3 text-majolica shrink-0" />;
      }
      return <Compass className="w-3 h-3 text-majolica shrink-0" />;
    }

    if (typeof icon !== "string") {
      const CustomIcon = icon;
      return <CustomIcon className="w-3 h-3 text-majolica shrink-0" />;
    }

    const clean = icon.trim();
    if (clean === "flame" || clean.includes("🔥")) return <Flame className="w-3 h-3 text-majolica shrink-0" />;
    if (clean === "mountain" || clean.includes("🏔") || clean.includes("⛰")) return <Mountain className="w-3 h-3 text-majolica shrink-0" />;
    if (clean === "landmark" || clean.includes("🏛") || clean.includes("🏛️") || clean.includes("🕌")) return <Landmark className="w-3 h-3 text-majolica shrink-0" />;
    if (clean === "sparkles" || clean.includes("✨") || clean.includes("💎")) return <Sparkles className="w-3 h-3 text-majolica shrink-0" />;
    if (clean === "utensils" || clean.includes("🥘") || clean.includes("🍢") || clean.includes("🍽")) return <UtensilsCrossed className="w-3 h-3 text-majolica shrink-0" />;
    if (clean === "waves" || clean.includes("🌊") || clean.includes("💧")) return <Waves className="w-3 h-3 text-majolica shrink-0" />;
    if (clean === "tree-pine" || clean.includes("🌲") || clean.includes("💚") || clean.includes("🌿")) return <TreePine className="w-3 h-3 text-majolica shrink-0" />;
    if (clean === "snowflake" || clean.includes("🎿") || clean.includes("❄️")) return <Snowflake className="w-3 h-3 text-majolica shrink-0" />;
    if (clean === "cable-car" || clean.includes("🚠")) return <CableCar className="w-3 h-3 text-majolica shrink-0" />;
    if (clean === "shield" || clean.includes("🛡")) return <ShieldCheck className="w-3 h-3 text-majolica shrink-0" />;
    if (clean === "clock") return <Clock className="w-3 h-3 text-majolica shrink-0" />;

    return <Compass className="w-3 h-3 text-majolica shrink-0" />;
  };

  // Clean label from any leading emoji if present
  const cleanLabel = label.replace(/^[\p{Emoji}\p{Symbol}\s]+/u, "").trim();

  return (
    <span
      className={`border border-majolica/30 bg-majolica/5 text-night text-xs font-mono uppercase tracking-wide rounded-full px-2.5 py-1 inline-flex items-center gap-1.5 shadow-2xs ${className}`}
    >
      {renderIcon()}
      <span>{cleanLabel || label}</span>
    </span>
  );
}
