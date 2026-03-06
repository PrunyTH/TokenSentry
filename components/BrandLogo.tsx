type BrandLogoProps = {
  compact?: boolean;
  className?: string;
};

export function BrandLogo({ compact = false, className = "" }: BrandLogoProps) {
  return (
    <span className={`brand-logo inline-flex items-center gap-0.5 ${className}`}>
      {!compact ? (
        <>
          <span className="brand-word">T</span>
          <span className="brand-coin" aria-hidden="true">
            <span className="brand-coin-inner">₿</span>
          </span>
          <span className="brand-word">KEN</span>
          <span className="brand-word brand-sentry">SENTRY</span>
        </>
      ) : (
        <span className="brand-coin" aria-label="TokenSentry Bitcoin logo">
          <span className="brand-coin-inner">₿</span>
        </span>
      )}
    </span>
  );
}

