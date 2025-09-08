"use client";

export default function AnimateLoader({
  size = 16,
  colorClass = "bg-primary-500 dark:bg-primary-600",
}: {
  size?: number;
  colorClass?: string;
}) {
  return (
    <div className="flex items-center justify-center space-x-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${colorClass} rounded-sm animate-bounceDelay`}
          style={{
            width: `${size}px`,
            height: `${size * 2}px`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}
