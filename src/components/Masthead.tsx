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
  /** Optional outlined secondary CTA shown to the left of the primary CTA (e.g. GitHub). */
  secondaryCta?: MastheadCta;
  /**
   * Override the wordmark. Defaults to the site's label from the network config
   * (e.g. "Heartland" for home, "Heartland · Clinical App" for app).
   */
  wordmark?: ReactNode;
  /** Optional small version chip shown after the wordmark (e.g. "v1.0.2"). */
  version?: string;
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
 * Sticky, warm-terminal background, editorial font across every node.
 * Mirrors the canonical layout used on synthetic.heartlandprotocol.org.
 */
export function Masthead({
  currentSite,
  navItems,
  cta,
  secondaryCta,
  wordmark,
  version,
  homeHref,
}: MastheadProps) {
  const href = homeHref ?? findSite(currentSite).url;
  const label = wordmark ?? buildWordmark(currentSite);

  return (
    <header className="sticky top-0 z-40 border-b border-grid bg-terminal/85 backdrop-blur supports-[backdrop-filter]:bg-terminal/70">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-8 px-6 py-5">
        <a href={href} className="group flex items-center gap-2.5">
          <HeartLineMark className="h-7 w-7 text-alert transition-transform group-hover:scale-105" />
          <span className="font-editorial text-[18px] font-semibold tracking-tight text-cool">
            {label}
          </span>
          {version ? (
            <span className="ml-1 hidden rounded-full border border-grid bg-panel px-2 py-0.5 font-mono text-[10.5px] tracking-tight text-cool/70 sm:inline-flex">
              {version}
            </span>
          ) : null}
        </a>

        {navItems && navItems.length > 0 ? (
          <nav
            aria-label="Primary"
            className="hidden items-center gap-8 font-editorial text-[14px] text-cool/80 md:flex"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className="transition-colors hover:text-alert"
              >
                {item.label}
              </a>
            ))}
          </nav>
        ) : (
          <NetworkSwitcher currentSite={currentSite} />
        )}

        <div className="flex items-center gap-2">
          {secondaryCta ? (
            <a
              href={secondaryCta.href}
              target={secondaryCta.external ? '_blank' : undefined}
              rel={secondaryCta.external ? 'noopener noreferrer' : undefined}
              className="hidden items-center gap-2 rounded-full border border-grid bg-panel px-4 py-2.5 font-editorial text-[13.5px] font-medium text-cool/85 transition-colors hover:border-cool/40 hover:text-cool sm:inline-flex"
            >
              {secondaryCta.label}
              {secondaryCta.external ? (
                <span className="text-[11px] text-stone" aria-hidden>
                  ↗
                </span>
              ) : null}
            </a>
          ) : null}
          {cta ? (
            <a
              href={cta.href}
              target={cta.external ? '_blank' : undefined}
              rel={cta.external ? 'noopener noreferrer' : undefined}
              className="group inline-flex items-center gap-2 rounded-full bg-cool px-5 py-2.5 font-editorial text-[13.5px] font-medium text-terminal transition-colors hover:bg-alert hover:text-cool"
            >
              {cta.label}
              <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>
                →
              </span>
            </a>
          ) : null}
        </div>
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
      <summary className="cursor-pointer list-none font-editorial text-[14px] text-cool/80 transition-colors hover:text-alert">
        HEARTLAND Network ▾
      </summary>
      <ul className="absolute right-0 top-full z-50 mt-3 w-72 rounded-2xl border border-grid bg-panel p-3 shadow-lg">
        {HEARTLAND_NETWORK.map((site) => (
          <li key={site.id}>
            <a
              href={site.url}
              className={`block rounded-lg px-3 py-2 font-editorial text-[13.5px] transition-colors hover:bg-panel-hi ${
                site.id === currentSite
                  ? 'bg-panel-hi text-cool'
                  : 'text-cool/80'
              }`}
              aria-current={site.id === currentSite ? 'page' : undefined}
            >
              <span className="block font-medium">{site.label}</span>
              <span className="mt-0.5 block text-[12px] text-stone">
                {site.url.replace('https://', '')}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
