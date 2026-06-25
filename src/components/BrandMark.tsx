import Image from "next/image";
import Link from "next/link";
import { getBrandLogoPath } from "@/lib/brand-logos";
import { slugify } from "@/lib/slugs";

type BrandMarkProps = {
  name: string;
  linked?: boolean;
  size?: "sm" | "md";
  className?: string;
};

export default function BrandMark({
  name,
  linked = true,
  size = "sm",
  className = "",
}: BrandMarkProps) {
  const slug = slugify(name);
  const logo = getBrandLogoPath(slug);
  const px = size === "sm" ? 16 : 20;

  const content = (
    <span className={`brand-mark brand-mark--${size} ${className}`.trim()}>
      {logo ? (
        <Image
          src={logo}
          alt=""
          width={px}
          height={px}
          className="brand-mark__logo"
          aria-hidden
        />
      ) : null}
      <span className="brand-mark__name">{name}</span>
    </span>
  );

  if (!linked) return content;

  return (
    <Link href={`/brands/${slug}`} className="brand-mark__link">
      {content}
    </Link>
  );
}
