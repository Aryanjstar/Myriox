export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden
    >
      <rect x="1" y="1" width="30" height="30" rx="8" className="fill-primary/12" />
      <path
        d="M8 22V10l8 7 8-7v12"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      />
      <circle cx="8" cy="22" r="1.6" className="fill-accent" />
      <circle cx="24" cy="22" r="1.6" className="fill-accent" />
    </svg>
  );
}
