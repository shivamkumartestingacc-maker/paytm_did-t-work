/** Four-point sparkle. */
export function Sparkle({ className, opacity = 1 }: { className?: string; opacity?: number }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" style={{ opacity }}>
      <path
        d="M12 0c1.1 6.4 4.5 9.9 12 12-7.5 2.1-10.9 5.6-12 12-1.1-6.4-4.5-9.9-12-12C7.5 9.9 10.9 6.4 12 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * The decorative cluster that sits over the left edge of the rating card:
 * one large four-point star, two mid stars and a scatter of small ones.
 */
export function SparkleCluster({ className }: { className?: string }) {
  return (
    <div className={`sparkle-cluster${className ? ` ${className}` : ''}`} aria-hidden="true">
      <span className="sparkle-cluster__halo" />
      <Sparkle className="sparkle-cluster__s1" />
      <Sparkle className="sparkle-cluster__s2" />
      <Sparkle className="sparkle-cluster__s3" />
      <Sparkle className="sparkle-cluster__s4" />
      <span className="sparkle-cluster__dot sparkle-cluster__dot--a" />
      <span className="sparkle-cluster__dot sparkle-cluster__dot--b" />
      <span className="sparkle-cluster__dot sparkle-cluster__dot--c" />
    </div>
  );
}

/** The pale confetti trail that drifts above the badge on the unlock screen. */
export function GhostTrail({ className }: { className?: string }) {
  return (
    <div className={`ghost-trail${className ? ` ${className}` : ''}`} aria-hidden="true">
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className={`ghost-trail__bit ghost-trail__bit--${i + 1}`} />
      ))}
    </div>
  );
}
