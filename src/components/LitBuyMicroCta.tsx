import RegisterLink from "@/components/RegisterLink";

type LitBuyMicroCtaProps = {
  location: string;
};

export default function LitBuyMicroCta({ location }: LitBuyMicroCtaProps) {
  return (
    <p className="mt-1.5 text-[10px] leading-snug text-muted/75">
      Opens in{" "}
      <RegisterLink
        location={location}
        className="font-semibold text-accent/85 hover:text-accent hover:underline"
      >
        LitBuy
      </RegisterLink>
      <span className="text-muted/55"> · free account to buy</span>
    </p>
  );
}
