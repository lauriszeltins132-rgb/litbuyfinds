import { permanentRedirect } from "next/navigation";

/** Point /qc equity at the QC finds database (not homepage). */
export default function QcPage() {
  permanentRedirect("/litbuy-qc");
}
