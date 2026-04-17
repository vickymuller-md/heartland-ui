import type { ReactNode } from 'react';
import { HeartLineMark } from './HeartLineMark';
import {
  HEARTLAND_NETWORK,
  findSite,
  type HeartlandSiteId,
} from '../tokens/network';

export interface MastheadCta {
  /** Display text, e.g. "Request access". */
  label: string;
  /** URL -- external or site-internal path. */
  href: string;
  /** Adds target="_blank" rel handling when true. */
  external?: boolean;
}

export interface MastheadNavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface MastheadProps {
  /** Which site in the HEARTLAND network is rendering this masthead. */
  currentSite: HeartlandSiteId;
  /**
   * Optional secondary nav (above the primary CTA).
   * If omitted, a compact "network switcher" dropdown is rendered instead.
   */
  navItems?: MastheadNavItem[];
  /** Optional primary CTA on the right. Omit on marketing sites with nothing to click. */
  cta?: MastheadCta;
  /**
   * Override the wordmark. Defaults to the site's label from the network config
   * (e.g. "Heartland" for home, "Heartland · Clinical App" for app).
   */
  wordmark?: ReactNode;
  /** Homepage URL for the logo click target. Defaults to the current site's root. */
  homeHref?: string;
}

function buildWordmark(currentSite: HeartlandSiteId): string {
  if (currentSite === 'home') return 'Heartland';
  const entry = findSite(currentSite);
  return `Heartland · ${entry.shortLabel}`;
}

/**
 * Masthead — soft, generous nav bar shared by every HEARTLAND site.
 * Left: wordmark + HeartLineMark. Middle: optional navItems or network switcher.
 * Right: optional CTA.
 */
export function Masthead({
  currentSite,
  navItems,
  cta,
  wordmark,
  homeHref,
}: MastheadProps) {
  const href = homeHref ?? findSite(currentSite).url;
  const label = wordmark ?? buildWordmark(currentSite);

  return (
    <header className="border-b border-[color:var(--color-grid)] bg-[color:var(--color-terminal)]/85 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--color-terminal)]/70">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-8 px-6 py-5">
        <a
          href={href}
          className="group flex items-center gap-2.5"
        >
          <HeartLineMark className="h-7 w-7 text-[color:var(--color-alert)] transition-transform group-hover:scale-105" />
          <span className="text-[18px] font-semibold tracking-tight text-[color:var(--color-cool)]">
            {label}
          </span>
        </a>

        {navItems && navItems.length > 0 ? (
          <nav
            aria-label="Primary"
            className="hidden items-center gap-8 text-[14px] text-[color:var(--color-cool)]/80 md:flex"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className="transition-colors hover:text-[color:var(--color-alert)]"
              >
                {item.label}
              </a>
            ))}
          </nav>
        ) : (
          <NetworkSwitcher currentSite={currentSite} />
        )}

        {cta ? (
          <a
            href={cta.href}
            target={cta.external ? '_blank' : undefined}
            rel={cta.external ? 'noopener noreferrer' : undefined}
            className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--color-cool)] px-5 py-2.5 text-[13.5px] font-medium text-[color:var(--color-terminal)] transition-colors hover:bg-[color:var(--color-alert)] hover:text-[color:var(--color-cool)]"
          >
            {cta.label}
            <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>
              →
            </span>
          </a>
        ) : null}
      </div>
    </header>
  );
}

/**
 * Network switcher -- a compact <details> dropdown listing the 8 HEARTLAND
 * subdomains. Pure HTML/CSS, no JS dependency, no portal. Degrades gracefully
 * in Astro or static renderers.
 */
function NetworkSwitcher({ currentSite }: { currentSite: HeartlandSiteId }) {
  return (
    <details className="relative hidden md:block">
      <summary className="cursor-pointer list-none text-[14px] text-[color:var(--color-cool)]/80 transition-colors hover:text-[color:var(--color-alert)]">
        HEARTLAND Network ▾
      </summary>
      <ul className="absolute right-0 top-full z-50 mt-3 w-72 rounded-2xl border border-[color:var(--color-grid)] bg-[color:var(--color-panel)] p-3 shadow-lg">
        {HEARTLAND_NETWORK.map((site) => (
          <li key={site.id}>
            <a
              href={site.url}
              className={`block rounded-lg px-3 py-2 text-[13.5px] transition-colors hover:bg-[color:var(--color-panel-hi)] ${
                site.id === currentSite
                  ? 'bg-[color:var(--color-panel-hi)] text-[color:var(--color-cool)]'
                  : 'text-[color:var(--color-cool)]/80'
              }`}
              aria-current={site.id === currentSite ? 'page' : undefined}
            >
              <span className="block font-medium">{site.label}</span>
              <span className="mt-0.5 block text-[12px] text-[color:var(--color-stone)]">
                {site.url.replace('https://', '')}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
