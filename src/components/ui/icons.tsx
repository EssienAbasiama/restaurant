type P = React.SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 20): React.SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
});

export const ArrowRight = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const ArrowLeft = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);
export const Plus = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const Minus = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M5 12h14" />
  </svg>
);
export const Close = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const Check = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M4.5 12.5l5 5 10-11" />
  </svg>
);
export const Bowl = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M3 11h18a9 9 0 0 1-18 0Z" />
    <path d="M9 20h6" />
    <path d="M9 7c0-1.5 1-1.5 1-3M13 7c0-1.5 1-1.5 1-3" />
  </svg>
);
export const Pepper = ({ size, filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base(size)} {...p}>
    <path
      d="M14.5 6.5c3 1 4.5 4 3.5 7.5-1.2 4.2-5.4 7-10 7.5-1 .1-1.3-1-.5-1.6 3.5-2.4 4.8-5.6 4.5-9.4-.1-2.2 1-4.5 2.5-4Z"
      fill={filled ? "currentColor" : "none"}
    />
    <path d="M14.5 6.5c.2-1.6 1.2-2.8 2.8-3.2" />
  </svg>
);
export const Clock = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
export const Pin = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);
export const Flame = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 21c-4 0-6.5-2.6-6.5-6 0-3.8 3.4-5.6 3.6-9.5 2.6 1.6 3.4 3.8 3.4 5.5 1-.8 1.6-2 1.6-3.4 2.6 2 4.4 4.6 4.4 7.4 0 3.4-2.5 6-6.5 6Z" />
  </svg>
);
export const Menu = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M4 8h16M4 16h10" />
  </svg>
);
export const Envelope = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="2" />
    <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
  </svg>
);
export const Hand = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V11m0-.5a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-.6a6 6 0 0 1-4.9-2.5L4 15.6a1.6 1.6 0 0 1 2.5-2L8 15" />
  </svg>
);
export const Calendar = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
);
export const Users = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="9" cy="8.5" r="3.5" />
    <path d="M2.5 20c.6-3.4 3.2-5.5 6.5-5.5s5.9 2.1 6.5 5.5" />
    <path d="M16 5.2a3.5 3.5 0 0 1 0 6.6M18.2 14.8c1.8.8 3 2.6 3.3 5.2" />
  </svg>
);
export const Scooter = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="6" cy="17" r="2.6" />
    <circle cx="18" cy="17" r="2.6" />
    <path d="M8.6 17h6.8l2.2-6.5H20M14 6.5h2.6l1 4M4 12.5h6l1.5 4.5" />
  </svg>
);
export const Bag = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M5 8h14l-1 12.5H6L5 8Z" />
    <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
  </svg>
);
export const Leaf = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M5 19C5 10 10 5 20 4c0 10-5 15-14 15Z" />
    <path d="M5 19l8-8" />
  </svg>
);
export const Fish = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M3 12c3-4.5 7-6 11-5 3 .8 5 3 6 5-1 2-3 4.2-6 5-4 1-8-.5-11-5Z" />
    <path d="M20 12l2-3v6l-2-3" />
    <circle cx="15.5" cy="10.5" r=".8" fill="currentColor" />
  </svg>
);
export const Star = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z" fill="currentColor" />
  </svg>
);
