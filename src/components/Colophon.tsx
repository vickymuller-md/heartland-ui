import type { ReactNode } from 'react';
import { HeartLineMark } from './HeartLineMark';
import {
  HEARTLAND_EXTERNAL_LINKS,
  HEARTLAND_NETWORK,
  findSite,
  type HeartlandSiteId,
} from '../tokens/network';

export interface ColophonLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface ColophonBlock {
  title: string;
  links: ColophonLink[];
}

export interface ColophonProps {
  currentSite: HeartlandSiteId;
  /**
   * Optional extra footer blocks shown before the shared "Research" + "Network"
   * blocks (e.g. per-site platform/package links).
   */
  extraBlocks?: ColophonBlock[];
  /** Optional description text shown under the wordmark. Defaults to a generic tagline. */
  description?: ReactNode;
  /** Override the legal microcopy. Keep brief; default carries the HIPAA/PHI guardrail. */
  legal?: ReactNode;
  /** Version label shown at the bottom right. E.g. "v3.2", "v1.0.2". */
  version?: string;
}

const DEFAULT_DESCRIPTION =
  'Heart failure Evidence-based Access in Rural Treatment, Linking Advanced Network Delivery — a peer-reviewed implementation framework and its companion open-source toolkit.';

const DEFAULT_LEGAL =
  'Built by Vicky Muller Ferreira, MD. For licensed clinicians only. Not a medical device. Not for direct patient care. No patient health information is ever stored.';

/**
 * Colophon — uncluttered footer shared across every HEARTLAND site.
 * Always includes: brand block, optional site-specific blocks, Research,
 * HEARTLAND Network, and a copyright bar.
 */
export function Colophon({
  currentSite,
  extraBlocks = [],
  description = DEFAULT_DESCRIPTION,
  legal = DEFAULT_LEGAL,
  version,
}: ColophonProps) {
  const site = findSite(currentSite);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[color:var(--color-grid)] bg-[color:var(--color-terminal)]">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Brand block */}
          <div className="md:col-span-5">
            <a
              href={site.url}
              className="inline-flex items-center gap-2.5"
            >
              <HeartLineMark className="h-7 w-7 text-[color:var(--color-alert)]" />
              <span className="text-[18px] font-semibold tracking-tight text-[color:var(--color-cool)]">
                {currentSite === 'home' ? 'Heartland' : `Heartland · ${site.shortLabel}`}
              </span>
            </a>
            <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-[color:var(--color-cool)]/70">
              {description}
            </p>
            <p className="mt-6 text-[12.5px] leading-relaxed text-[color:var(--color-stone)]">
              {legal}
            </p>
          </div>

          {/* Extra site-specific blocks */}
          {extraBlocks.map((block) => (
            <FooterBlock key={block.title} title={block.title}>
              {block.links.map((l) => (
                <FooterLink
                  key={`${block.title}-${l.href}`}
                  href={l.href}
                  external={l.external}
                >
                  {l.label}
                </FooterLink>
              ))}
            </FooterBlock>
          ))}

          {/* Canonical Research block */}
          <FooterBlock title="Research">
            <FooterLink href={HEARTLAND_EXTERNAL_LINKS.cureus} external>
              Cureus article
            </FooterLink>
            <FooterLink href={HEARTLAND_EXTERNAL_LINKS.zenodo} external>
              Zenodo deposit
            </FooterLink>
            <FooterLink href={HEARTLAND_EXTERNAL_LINKS.osf} external>
              OSF deposit
            </FooterLink>
            <FooterLink href={HEARTLAND_EXTERNAL_LINKS.orcid} external>
              ORCID profile
            </FooterLink>
          </FooterBlock>

          {/* Network block -- always included */}
          <FooterBlock title="Network">
            {HEARTLAND_NETWORK.map((entry) => (
              <FooterLink
                key={entry.id}
                href={entry.url}
                external={entry.id !== currentSite}
                current={entry.id === currentSite}
              >
                {entry.shortLabel}
              </FooterLink>
            ))}
          </FooterBlock>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[color:var(--color-grid)] pt-6 text-[12.5px] text-[color:var(--color-stone)] md:flex-row md:items-center md:justify-between">
          <p>
            © {year} Vicky Muller Ferreira, MD · Released under MIT
          </p>
          <p>
            {currentSite === 'home' ? 'HEARTLAND Protocol' : `Heartland · ${site.shortLabel}`}
            {version ? ` · ${version}` : ''} · open source
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="md:col-span-2">
      <p className="mb-4 text-[12.5px] uppercase tracking-[0.18em] text-[color:var(--color-cool)]">
        {title}
      </p>
      <ul className="space-y-3 text-[14.5px]">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
  external,
  current,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  current?: boolean;
}) {
  const externalAttrs = external
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {};
  return (
    <li>
      <a
        href={href}
        {...externalAttrs}
        aria-current={current ? 'page' : undefined}
        className={`inline-flex items-baseline gap-1 transition-colors hover:text-[color:var(--color-alert)] ${
          current
            ? 'text-[color:var(--color-cool)]'
            : 'text-[color:var(--color-cool)]/80'
        }`}
      >
        {children}
        {external && (
          <span className="text-[11px] text-[color:var(--color-stone)]" aria-hidden>
            ↗
          </span>
        )}
      </a>
    </li>
  );
}
