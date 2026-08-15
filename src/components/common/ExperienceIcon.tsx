import React from "react";
import {
  UtensilsCrossed,
  Landmark,
  Castle,
  Waves,
  Mountain,
  Snowflake,
  CableCar,
  TreePine,
  Compass,
  Sunset,
  Zap,
  Flame,
  Sparkles,
  MapPin,
  Clock,
  Coins,
  ShieldCheck,
  UserCheck,
  Building,
  Train,
  Car,
  Plane,
  Bus,
} from "lucide-react";

interface ExperienceIconProps {
  name: string;
  className?: string;
}

export default function ExperienceIcon({ name, className = "w-5 h-5 text-majolica" }: ExperienceIconProps) {
  const clean = (name || "").trim();

  // Food / Gastro
  if (clean === "utensils" || clean === "gastro" || clean.includes("🥘") || clean.includes("🍢") || clean.includes("🍽")) {
    return <UtensilsCrossed className={className} />;
  }

  // History / Islamic Architecture / Monuments
  if (clean === "landmark" || clean === "history" || clean.includes("🏛") || clean.includes("🏛️") || clean.includes("🕌")) {
    return <Landmark className={className} />;
  }

  // Ancient Fortresses / Citadel
  if (clean === "castle" || clean === "khiva" || clean.includes("🏰")) {
    return <Castle className={className} />;
  }

  // Water / Lakes / Charvak
  if (clean === "waves" || clean === "water" || clean.includes("🌊") || clean.includes("💧")) {
    return <Waves className={className} />;
  }

  // Mountains / Chimgan / Beldersay
  if (clean === "mountain" || clean === "mountains" || clean.includes("🏔") || clean.includes("⛰")) {
    return <Mountain className={className} />;
  }

  // Winter / Skiing / Amirsoy
  if (clean === "snowflake" || clean === "ski" || clean.includes("🎿") || clean.includes("❄️")) {
    return <Snowflake className={className} />;
  }

  // Cable car / Funicular / Beldersay lift
  if (clean === "cable-car" || clean === "chairlift" || clean.includes("🚠") || clean.includes("🚡")) {
    return <CableCar className={className} />;
  }

  // Forest / Sukok / Nature
  if (clean === "tree-pine" || clean === "forest" || clean.includes("🌲") || clean.includes("🌳")) {
    return <TreePine className={className} />;
  }

  // Sunset / Evening
  if (clean === "sunset" || clean.includes("🌅") || clean.includes("🌇")) {
    return <Sunset className={className} />;
  }

  // Adventure / Canyons / Trails
  if (clean === "canyon" || clean === "adventure" || clean.includes("🏞") || clean.includes("⚡")) {
    return <Compass className={className} />;
  }

  // Hot / Bestseller
  if (clean === "flame" || clean.includes("🔥")) {
    return <Flame className={className} />;
  }

  // Sparkles / Rest day
  if (clean === "sparkles" || clean.includes("✨") || clean.includes("🌿")) {
    return <Sparkles className={className} />;
  }

  // Default fallback
  return <Compass className={className} />;
}
