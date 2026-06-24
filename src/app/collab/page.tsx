import { permanentRedirect } from "next/navigation";
import { ADVERTISE_PAGE_PATH } from "@/lib/advertise-page";

export default function CollabRedirectPage() {
  permanentRedirect(ADVERTISE_PAGE_PATH);
}
