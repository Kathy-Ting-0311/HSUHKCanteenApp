const PATHS: Record<string, string[]> = {
  orders: ['M21 8l-9-5-9 5v8l9 5 9-5V8z', 'M3 8l9 5 9-5', 'M12 13v8'],
  heart: ['M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z'],
  accessibility: ['M12 2.7a1.8 1.8 0 100 3.6 1.8 1.8 0 000-3.6z', 'M5 8.5l7 1.5 7-1.5', 'M12 10v4.5', 'M9 21l3-6.5 3 6.5'],
  sliders: ['M4 7h10', 'M18 7h2', 'M4 17h2', 'M10 17h10', 'M14 5v4', 'M6 15v4'],
  help: ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M9.5 9.5a2.5 2.5 0 114 2c-.9.6-1.5 1-1.5 2', 'M12 17h.01'],
  utensils: ['M7 3v8', 'M4 3v5a3 3 0 006 0V3', 'M7 11v10', 'M17 3c-2 2-3 4.5-3 7h3v11'],
  leaf: ['M5 19c0-8 5-14 15-14 0 9-5 15-13 15', 'M5 19c3-5 6-8 10-10'],
  bento: ['M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z', 'M3 12h18', 'M12 6v12'],
  star: ['M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z'],
  cart: ['M3 4h2l2.4 11h10l2-8H6.5', 'M9 18.2a1.3 1.3 0 100 2.6 1.3 1.3 0 000-2.6z', 'M17 18.2a1.3 1.3 0 100 2.6 1.3 1.3 0 000-2.6z'],
  coffee: ['M5 9h11v5a4 4 0 01-4 4H9a4 4 0 01-4-4V9z', 'M16 10h2a2 2 0 010 4h-2', 'M8 3v2', 'M12 3v2'],
  ice: ['M12 3v18', 'M4.2 7.5l15.6 9', 'M19.8 7.5l-15.6 9'],
  bolt: ['M13 2L4 14h7l-1 8 9-12h-7l1-8z'],
  trend: ['M3 7l6 6 4-4 8 8', 'M15 17h6v-6'],
  flame: ['M12 3c1 4 5 5 5 10a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z'],
  calendar: ['M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z', 'M3 10h18', 'M8 3v4', 'M16 3v4'],
  clock: ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M12 7v5l3 2'],
  check: ['M5 12.5l4.5 4.5L19 7'],
}

export type IconName = keyof typeof PATHS

export default function Icon({ name, size = 20, className = '', fill = false }: { name: IconName; size?: number; className?: string; fill?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`inline-block flex-shrink-0 ${className}`}
    >
      {PATHS[name].map((d, i) => <path key={i} d={d} />)}
    </svg>
  )
}
