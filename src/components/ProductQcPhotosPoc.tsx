type ProductQcPhotosPocProps = {
  images: string[];
  productName: string;
  telegramUrl?: string;
};

/**
 * Temporary single-product experiment — renders only when images are provided.
 */
export default function ProductQcPhotosPoc({
  images,
  productName,
  telegramUrl,
}: ProductQcPhotosPocProps) {
  if (images.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-foreground">QC Photos Available</p>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {images.map((src, index) => (
          <li
            key={src}
            className="overflow-hidden rounded-2xl border border-border bg-panel"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${productName} QC photo ${index + 1}`}
              width={800}
              height={600}
              loading="lazy"
              decoding="async"
              className="h-auto w-full object-cover"
            />
          </li>
        ))}
      </ul>
      {telegramUrl ? (
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex text-sm font-bold text-accent hover:underline"
        >
          View original QC on Telegram →
        </a>
      ) : null}
    </div>
  );
}
