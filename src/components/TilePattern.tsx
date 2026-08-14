/**
 * Сигнатурный элемент дизайна: геометрический узор,
 * отсылающий к гирих-орнаментам среднеазиатской майолики
 * (Регистан, Шахи-Зинда). Используется как акцент, не декорация.
 */
export default function TilePattern({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="girih" width="30" height="30" patternUnits="userSpaceOnUse">
          <path
            d="M15 0 L30 15 L15 30 L0 15 Z"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />
          <circle cx="15" cy="15" r="4" stroke="currentColor" strokeWidth="1" fill="none" />
        </pattern>
      </defs>
      <rect width="120" height="120" fill="url(#girih)" />
    </svg>
  );
}
