import { Star } from "lucide-react";

// readOnly: display-only (e.g. average rating, can be fractional — rounds for fill).
// Otherwise interactive: calls onChange(stars) when a star is clicked.
const StarRating = ({ value = 0, onChange, size = 16, readOnly = false }) => {
  const rounded = Math.round(value);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(n)}
          className={readOnly ? "cursor-default" : "cursor-pointer"}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Star
            size={size}
            className={n <= rounded ? "fill-patron-orange-500 text-patron-orange-500" : "text-patron-gray-300"}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
