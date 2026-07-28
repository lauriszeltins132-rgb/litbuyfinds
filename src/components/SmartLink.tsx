import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type SmartLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  children: ReactNode;
  className?: string;
};

export function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

export default function SmartLink({
  href,
  children,
  className,
  ...props
}: SmartLinkProps) {
  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );
}
