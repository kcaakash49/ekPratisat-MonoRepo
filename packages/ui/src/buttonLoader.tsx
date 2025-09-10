"use client";

interface ButtonLoaderProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white" | "current";
  className?: string;
}

export default function ButtonLoader({ 
  size = "md", 
  color = "primary",
  className = ""
}: ButtonLoaderProps) {
  // Size mapping
  const sizeMap = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4"
  };

  // Color mapping
  const colorMap = {
    primary: "bg-blue-600",
    white: "bg-white",
    current: "bg-current"
  };

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizeMap[size]} ${colorMap[color]} rounded-full animate-pulse`}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: "0.6s"
          }}
        />
      ))}
    </div>
  );
}