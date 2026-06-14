import { GUEST_VS_MEMBER_ROWS } from "@/lib/conversion";

function CellValue({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <span className="text-accent" aria-label="Included">
        ✓
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="text-muted/50" aria-label="Not included">
        —
      </span>
    );
  }
  return <span className="text-xs text-muted">{value}</span>;
}

export default function GuestVsMemberTable({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-border/80 bg-surface/30 ${
        compact ? "" : "shadow-[0_12px_40px_rgba(0,0,0,0.2)]"
      }`}
    >
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border/80 bg-surface/50">
            <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-muted">
              Feature
            </th>
            <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-muted">
              Guest
            </th>
            <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-accent">
              LitBuy member
            </th>
          </tr>
        </thead>
        <tbody>
          {GUEST_VS_MEMBER_ROWS.map((row) => (
            <tr key={row.feature} className="border-b border-border/40 last:border-0">
              <td className="px-4 py-3 font-medium text-foreground/90">{row.feature}</td>
              <td className="px-3 py-3 text-center">
                <CellValue value={row.guest} />
              </td>
              <td className="px-3 py-3 text-center">
                <CellValue value={row.member} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
