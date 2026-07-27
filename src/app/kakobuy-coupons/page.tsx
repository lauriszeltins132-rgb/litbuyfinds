import { createCouponSeoPage } from "@/lib/coupon-seo-page";

const { generateMetadata, Page } = createCouponSeoPage("kakobuy-coupons");

export { generateMetadata };
export default Page;
