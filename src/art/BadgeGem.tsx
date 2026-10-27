/**
 * The "Perfect Month" badge: a faceted purple stone holding a savings pouch.
 * Hand-built SVG — every facet is a polygon, so it reads as a cut gem with a
 * top table, a girdle and a pointed pavilion, no raster art.
 */
export function BadgeGem({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" role="img" aria-label="Perfect Month gem badge">
      <defs>
        <linearGradient id="gemTable" x1="0.1" y1="0" x2="0.75" y2="1">
          <stop offset="0" stopColor="#e7d8fd" />
          <stop offset="0.55" stopColor="#c6a6f8" />
          <stop offset="1" stopColor="#a87ef0" />
        </linearGradient>
        <linearGradient id="gemCrown" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b78ff5" />
          <stop offset="0.5" stopColor="#9c6ceb" />
          <stop offset="1" stopColor="#8453dd" />
        </linearGradient>
        <linearGradient id="gemPavilion" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#9366e6" />
          <stop offset="0.55" stopColor="#7444cc" />
          <stop offset="1" stopColor="#5b2fb5" />
        </linearGradient>
        <radialGradient id="gemGlow" cx="0.34" cy="0.22" r="0.62">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* pavilion: the pointed underside */}
      <path d="M22 66 60 110 98 66Z" fill="url(#gemPavilion)" />
      {/* crown: the wide middle band */}
      <path d="M23 58 41 28 79 28 97 58 60 78Z" fill="url(#gemCrown)" />
      {/* table: the flat top face */}
      <path d="M33 44 44 26 76 26 87 44 60 56Z" fill="url(#gemTable)" />

      {/* facets — light on the left, shade on the right */}
      <path d="M41 28 60 78 60 110Z" fill="#ffffff" opacity="0.1" />
      <path d="M23 58 41 28 60 56 60 78Z" fill="#ffffff" opacity="0.14" />
      <path d="M97 58 79 28 60 56 60 78Z" fill="#3a1a72" opacity="0.2" />
      <path d="M98 66 60 78 60 110Z" fill="#31155f" opacity="0.22" />
      <path d="M22 66 60 78 60 110Z" fill="#2b1158" opacity="0.12" />
      <path d="M44 26 60 56 76 26Z" fill="#ffffff" opacity="0.16" />
      <path d="M33 44 44 26 60 56Z" fill="#ffffff" opacity="0.1" />

      {/* rim light along the crown */}
      <path d="M23 58 41 28 79 28 97 58" fill="none" stroke="#ffffff" strokeOpacity="0.42" strokeWidth="1.5" />
      <path d="M23 58 60 78 97 58" fill="none" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1.1" />

      {/* specular sweep */}
      <path d="M34 44 45 27 58 27 44 56Z" fill="url(#gemGlow)" />

      {/* pouch emblem on a white disc */}
      <circle cx="60" cy="54" r="19" fill="#ffffff" />
      <g transform="translate(60 54)" fill="#8a5ce8">
        <path d="M-1.7-11.9c1.9 0 3.4 1.7 3.4 3.9 0 1.1-.4 2-1.1 2.7h-4.6c-.7-.7-1.1-1.6-1.1-2.7 0-2.2 1.5-3.9 3.4-3.9Z" />
        <path d="M-5.6-4.6h11.2c1.9 0 3.4 1.6 3.4 3.5v5.9c0 4-3.2 7.2-7.2 7.2h-3.6c-4 0-7.2-3.2-7.2-7.2v-5.9c0-1.9 1.5-3.5 3.4-3.5Z" />
        <path d="M-4 -10.4h8" stroke="#ffffff" strokeOpacity="0.9" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    </svg>
  );
}
