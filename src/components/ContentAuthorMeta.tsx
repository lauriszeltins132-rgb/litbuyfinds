import Link from "next/link";
import {
  formatContentDate,
  formatContentMonthYear,
  type ContentDates,
} from "@/lib/content-dates";
import {
  CONTENT_REVIEW_NOTE,
  CONTENT_TEAM_DESCRIPTION,
  CONTENT_TEAM_NAME,
} from "@/lib/trust";

type ContentAuthorMetaProps = {
  dates: ContentDates;
  showTeamDetail?: boolean;
};

export default function ContentAuthorMeta({
  dates,
  showTeamDetail = true,
}: ContentAuthorMetaProps) {
  return (
    <aside className="mt-8 rounded-2xl border border-border bg-surface/35 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
            Author
          </p>
          <p className="mt-1 text-sm font-black text-foreground">
            Written by {CONTENT_TEAM_NAME}
          </p>
          {showTeamDetail ? (
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
              {CONTENT_TEAM_DESCRIPTION}
            </p>
          ) : null}
        </div>
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
              Published
            </dt>
            <dd className="font-semibold text-foreground">
              <time dateTime={dates.publishedIso}>
                {formatContentDate(dates.publishedIso)}
              </time>
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
              Last updated
            </dt>
            <dd className="font-semibold text-foreground">
              <time dateTime={dates.updatedIso}>
                {formatContentMonthYear(dates.updatedIso)}
              </time>
            </dd>
          </div>
        </dl>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted">
        {CONTENT_REVIEW_NOTE}{" "}
        <Link href="/about" className="font-bold text-accent hover:underline">
          About us
        </Link>{" "}
        ·{" "}
        <Link href="/contact" className="font-bold text-accent hover:underline">
          Contact
        </Link>
      </p>
    </aside>
  );
}
