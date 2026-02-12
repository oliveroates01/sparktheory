type SparkTheoryLogoProps = {
  compact?: boolean;
  className?: string;
};

export default function SparkTheoryLogo({
  compact = false,
  className = "",
}: SparkTheoryLogoProps) {
  return (
    <div className={`inline-flex items-center gap-4 ${className}`}>
      <div
        className={[
          "relative grid place-items-center rounded-full isolate",
          compact ? "h-11 w-11" : "h-16 w-16",
          "bg-transparent",
          "ring-2 ring-[#FFC400] shadow-[0_10px_22px_rgba(0,0,0,0.35)]",
        ].join(" ")}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={[
            compact ? "h-6 w-6" : "h-9 w-9",
            "relative drop-shadow-[0_0_6px_rgba(255,180,0,0.35)]",
          ].join(" ")}
          fill="#FFE35B"
        >
          <path d="M13.1 2 4.8 13.1h5l-1.7 8.9L19.2 9.8h-5.3L13.1 2Z" />
        </svg>
      </div>

      <div className="leading-none">
        <span
          className={[
            "font-extrabold tracking-tight",
            compact ? "text-2xl" : "text-4xl sm:text-5xl",
          ].join(" ")}
        >
          <span className="bg-gradient-to-b from-[#FFE36A] via-[#FFC400] to-[#FF9A00] bg-clip-text text-transparent">
            Spark
          </span>{" "}
          <span className="bg-gradient-to-b from-white to-[#E7E7E7] bg-clip-text text-transparent [text-shadow:0_0_16px_rgba(255,255,255,0.18)]">
            Theory
          </span>
        </span>
      </div>
    </div>
  );
}
