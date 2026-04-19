import Image from "next/image";

const PLACEHOLDER_SOURCE = "/assets/industrial-hero.png";
const PLACEHOLDER_RUNTIME = "/assets/industrial-hero-1440.webp";

type SiteImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function SiteImage({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 33vw"
}: SiteImageProps) {
  const imageSrc = normalizeImageSrc(src);
  const isRemote = imageSrc.startsWith("http");

  return (
    <span className={`site-image-frame ${className}`}>
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        fetchPriority={priority ? "high" : "auto"}
        unoptimized={isRemote}
      />
    </span>
  );
}

export function normalizeImageSrc(src?: string | null) {
  if (!src || src === PLACEHOLDER_SOURCE) return PLACEHOLDER_RUNTIME;
  return src;
}
