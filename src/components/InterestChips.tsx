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
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all duration-200 cursor-pointer ${
              active
                ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white border-transparent shadow-md ring-2 ring-indigo-300 scale-102"
                : "bg-white border-slate-200 text-slate-800 hover:border-indigo-400 hover:bg-indigo-50/50 shadow-2xs"
            }`}
          >
            {t.categories[cat] || cat}
          </button>
        );
      })}
    </div>
  );
}
