import { createCouponSeoPage } from "@/lib/coupon-seo-page";

const { generateMetadata, Page } = createCouponSeoPage("litbuy-coupons");

export { generateMetadata };
export default Page;
