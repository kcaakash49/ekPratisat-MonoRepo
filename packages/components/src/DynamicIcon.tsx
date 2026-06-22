import React from "react";
// 🔑 Only import the specific icons you need. Tree-shaking will discard the rest!
import { 
  Wifi, 
  Tv, 
  Car, 
  Flame, 
  AirVent, 
  ShowerHead, 
  Sparkles 
} from "lucide-react";

// 📦 Map the string keys from your DB to the imported components
const iconRegistry = {
  wifi: Wifi,
  tv: Tv,
  parking: Car,
  garage: Car,
  heating: Flame,
  ac: AirVent,
  airconditioning: AirVent,
  pool: ShowerHead,
};

interface DynamicIconProps {
  name: string; // E.g., "wifi", "pool", or something custom
  className?: string;
}

export default function DynamicIcon({ name, className = "w-5 h-5" }: DynamicIconProps) {
  // 1. Set up your safe fallback icon component
  const FallbackIcon = Sparkles;

  // 2. Normalize the string to lowercase to prevent matching issues with typos or casing
  const key = name.toLowerCase().trim();

  // 3. Extract the component from your custom registry map
  const IconComponent = iconRegistry[key as keyof typeof iconRegistry];

  // 4. Render the registered icon, or use the fallback
  if (IconComponent) {
    return <IconComponent className={className} />;
  }

  return <FallbackIcon className={`${className} text-secondary-400`} />;
}