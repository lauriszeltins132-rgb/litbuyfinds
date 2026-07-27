import { createCouponSeoPage } from "@/lib/coupon-seo-page";

const { generateMetadata, Page } = createCouponSeoPage("hipobuy-coupons");

export { generateMetadata };
export default Page;
