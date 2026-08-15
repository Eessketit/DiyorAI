import { Category } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

const ALL_CATEGORIES: Category[] = [
  "history",
  "architecture",
  "pilgrimage",
  "gastronomy",
  "crafts_bazaars",
  "soviet_modernism",
  "nature_hiking",
  "nature",
];

export default function InterestChips({
  selected,
  onChange,
}: {
  selected: Category[];
  onChange: (next: Category[]) => void;
}) {
  const { t } = useTranslation();

  function toggle(cat: Category) {
    if (selected.includes(cat)) {
      onChange(selected.filter((c) => c !== cat));
    } else {
      onChange([...selected, cat]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {ALL_CATEGORIES.map((cat) => {
        const active = selected.includes(cat);
        return (
          <button
            key={cat}
            type="button"
            onClick={() => toggle(cat)}
            aria-pressed={active}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
              active
                ? "bg-majolica text-paper border-majolica shadow-xs scale-105"
                : "bg-paper border-majolica/30 text-night hover:border-majolica hover:bg-majolica/10"
            }`}
          >
            {t.categories[cat] || cat}
          </button>
        );
      })}
    </div>
  );
}
