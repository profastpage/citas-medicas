import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  /** Size in pixels (square) */
  size?: number;
  /** Show the "MenuPro" wordmark next to the icon */
  showWordmark?: boolean;
  /** Wordmark size class — defaults to `text-lg` */
  wordmarkClassName?: string;
  /** Wrap logo in a link to "/" */
  asLink?: boolean;
  /** Extra classes for the wrapper */
  className?: string;
  /** Use the smaller (192px) optimized logo variant — defaults to false (uses 512px source, but browsers auto-scale) */
  compact?: boolean;
}

/**
 * BrandLogo — MenuPro brand mark.
 *
 * Replaces the previous gold "M" placeholder with the real favicon asset.
 * Used in: landing header, login, register, dashboard sidebar/drawer/mobile header, footer.
 *
 * The icon is rendered with a plain <img> because these are static, cacheable,
 * CDN-served assets and we want this to work in every layout (server + client)
 * without width/height boilerplate.
 */
export function BrandLogo({
  size = 36,
  showWordmark = true,
  wordmarkClassName = 'font-bold text-lg',
  asLink = true,
  className,
  compact = false,
}: BrandLogoProps) {
  const src = compact ? '/logo-192.png' : '/logo.png';
  const img = (
    <img
      src={src}
      alt="MenuPro"
      width={size}
      height={size}
      className="rounded-lg object-contain"
      style={{ width: size, height: size }}
      draggable={false}
    />
  );

  const content = (
    <span className={cn('flex items-center gap-2.5', className)}>
      {img}
      {showWordmark && <span className={wordmarkClassName}>MenuPro</span>}
    </span>
  );

  if (!asLink) return content;

  return (
    <Link href="/" prefetch={false} className="hover:opacity-90 transition-opacity">
      {content}
    </Link>
  );
}
