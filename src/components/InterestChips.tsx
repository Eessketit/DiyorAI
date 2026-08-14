import { Category } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

const ALL_CATEGORIES: Category[] = ["history", "architecture", "pilgrimage", "nature", "gastronomy"];

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
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              active
                ? "bg-clay text-plaster border-clay shadow-xs"
                : "bg-transparent text-ink border-sand hover:border-clay"
            }`}
          >
            {t.categories[cat]}
          </button>
        );
      })}
    </div>
  );
}
