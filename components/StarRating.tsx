export default function StarRating({
  value,
  size = 14,
  interactive = false,
  onChange,
}: {
  value: number;
  size?: number;
  interactive?: boolean;
  onChange?: (v: number) => void;
}) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {stars.map((s) => (
        <span
          key={s}
          onClick={() => interactive && onChange?.(s)}
          style={{
            cursor: interactive ? "pointer" : "default",
            fontSize: size,
            color: s <= Math.round(value) ? "#F59E0B" : "#E7E5E4",
            lineHeight: 1,
          }}
          aria-hidden
        >
          ★
        </span>
      ))}
    </span>
  );
}
