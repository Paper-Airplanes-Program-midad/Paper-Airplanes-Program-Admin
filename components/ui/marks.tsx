import type { SVGProps } from "react";

export function PlaneMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden {...props}>
      <path
        d="M29.4 3.1 2.9 13.6c-.9.4-.8 1.7.1 2l6.9 2.2 2.6 8.3c.3.9 1.5 1.1 2.1.3l3.6-4.5 7 5.2c.7.5 1.7.1 1.9-.7l3.5-21.8c.1-.9-.8-1.6-1.6-1.3Z"
        fill="url(#plane-body)"
      />
      <path
        d="m12.5 17.8 16.6-13.6-13.9 15.5-.1 5.9c0 .4-.6.5-.7.1l-1.9-7.9Z"
        fill="url(#plane-fold)"
      />
      <defs>
        <linearGradient id="plane-body" x1="3" y1="4" x2="28" y2="27">
          <stop stopColor="var(--mark-a)" />
          <stop offset="0.5" stopColor="var(--mark-b)" />
          <stop offset="1" stopColor="var(--mark-c)" />
        </linearGradient>
        <linearGradient id="plane-fold" x1="12" y1="18" x2="29" y2="5">
          <stop stopColor="var(--mark-fold-a)" />
          <stop offset="1" stopColor="var(--mark-fold-b)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function PlaneGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M22 2 2 10.2l6.4 2.2L20.2 4.6 10.6 14.4l.3 6.4c0 .5.7.7 1 .3l3-3.7 4.8 3.5c.5.4 1.2 0 1.3-.6L23.6 3c.1-.7-.6-1.2-1.2-1Z" />
    </svg>
  );
}

export function ArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

export function Check(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="m4.5 10.5 3.6 3.6 7.4-8.2" />
    </svg>
  );
}
