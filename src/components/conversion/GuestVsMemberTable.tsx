import { LITBUY_SHIPPING_OFFER_PERCENT } from "@/lib/litbuy-coupons-page";
import { GUEST_VS_MEMBER_ROWS } from "@/lib/conversion";

function CellValue({
  value,
  emphasize = false,
}: {
  value: boolean | string;
  emphasize?: boolean;
}) {
  if (value === true) {
    return (
      <span className="font-black text-accent" aria-label="Included">
        ✓
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="font-bold text-foreground/35" aria-label="Not included">
        —
      </span>
    );
  }
  return (
    <span
      className={`text-xs font-semibold leading-tight ${
        emphasize ? "text-foreground" : "text-foreground/80"
      }`}
    >
      {value}
    </span>
  );
}

export default function GuestVsMemberTable({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-border bg-panel ${
        compact ? "text-[13px]" : "text-sm"
      }`}
    >
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground sm:px-4 sm:text-xs">
              Feature
            </th>
            <th className="px-2 py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/70 sm:px-3 sm:text-xs">
              Guest
            </th>
            <th className="bg-accent/10 px-2 py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-foreground sm:px-3 sm:text-xs">
              LitBuy member
            </th>
          </tr>
        </thead>
        <tbody>
          {GUEST_VS_MEMBER_ROWS.map((row) => {
            const member =
              row.feature === "Shipping coupons"
                ? `Up to ${LITBUY_SHIPPING_OFFER_PERCENT} off*`
                : row.member;
            return (
              <tr key={row.feature} className="border-b border-border/70 last:border-0">
                <td className="px-3 py-2.5 text-xs font-semibold text-foreground sm:px-4 sm:text-sm">
                  {row.feature}
                </td>
                <td className="px-2 py-2.5 text-center">
                  <CellValue value={row.guest} />
                </td>
                <td className="bg-accent/10 px-2 py-2.5 text-center">
                  <CellValue value={member} emphasize />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="border-t border-border px-3 py-2.5 text-[11px] leading-relaxed text-muted sm:px-4">
        *Eligible new-account international shipping offer. Confirm live terms on LitBuy.
      </p>
    </div>
  );
}
