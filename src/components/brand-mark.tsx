/** Two opposing turns form the S in Sensitivity. */
export default function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect width="48" height="48" rx="13" fill="#292722" />
      <path
        d="M32 14H21C10.5 14 10.5 24 21 24H27C37.5 24 37.5 34 27 34H16"
        stroke="#f3eee3"
        strokeWidth="4.5"
      />
      <path d="m30 7 9 7-9 7V7ZM18 27l-9 7 9 7V27Z" fill="#f3eee3" />
    </svg>
  );
}
