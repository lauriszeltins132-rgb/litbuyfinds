import CommunityButton from "@/components/community/CommunityButton";
import {
  TELEGRAM_CHANNEL_NAME,
  TELEGRAM_MEMBER_LABEL,
} from "@/lib/constants";
import Link from "next/link";

export default function TelegramDailyFindsCta() {
  return (
    <section className="px-4 pt-6 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-surface/25 px-5 py-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-bold text-foreground">
              Want daily finds? Join {TELEGRAM_CHANNEL_NAME} Telegram.
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              {TELEGRAM_MEMBER_LABEL} sharing QC photos, spreadsheet rows, and
              multi-agent links.{" "}
              <Link href="/telegram" className="font-bold text-accent hover:underline">
                Learn more
              </Link>
            </p>
          </div>
          <CommunityButton
            platform="telegram"
            variant="pill"
            location="product_page_telegram_cta"
            label="Join Telegram"
          />
        </div>
      </div>
    </section>
  );
}
