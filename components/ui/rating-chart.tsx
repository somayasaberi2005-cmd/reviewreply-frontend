export function RatingChart({ distribution }: { distribution: number[] }) {
  const max = Math.max(...distribution, 1);

  return (
    <div className="flex items-end gap-3 h-32">
      {distribution.map((count, i) => {
        const rating = i + 1;
        const heightPct = (count / max) * 100;
        return (
          <div key={rating} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex-1 flex items-end">
              <div
                className="w-full bg-berry-400 rounded-t-md transition-all"
                style={{ height: `${heightPct}%`, minHeight: count > 0 ? "4px" : "0" }}
              />
            </div>
            <p className="text-xs text-slate-500">{rating}{String.fromCharCode(9733)}</p>
            <p className="text-xs font-medium text-slate-700">{count}</p>
          </div>
        );
      })}
    </div>
  );
}