import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import CONST_URLS from '~/misc/consts/urls';

// matches either markdown `[label](url)` (url can be absolute or a relative
// "/path") or a bare pasted url, e.g. "https://example.com/foo"
const LINK_REGEX = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)|(https?:\/\/[^\s<]+)/g;
const TRAILING_PUNCT_REGEX = /[.,!?;:)\]}»"'“”‘’]+$/;

type LinkSegment = { href: string; label: string; internal: boolean };
type Segment = { text: string } | LinkSegment;

function isSameSite(hostname: string): boolean {
  const siteHost = new URL(CONST_URLS.siteUrl).hostname.replace(/^www\./, '');
  return hostname.replace(/^www\./, '') === siteHost;
}

function isInternalUrl(url: string): boolean {
  if (url.startsWith('/')) return true;
  try {
    return isSameSite(new URL(url).hostname);
  } catch {
    return false;
  }
}

// for internal links, normalize to a bare path so <Link> does client-side routing
function toInternalHref(url: string): string {
  if (url.startsWith('/')) return url;
  try {
    const parsed = new URL(url);
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return url;
  }
}

function getDomainLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function parseLinkedSegments(text: string): Segment[] {
  const segments: Segment[] = [];
  let lastIndex = 0;
  LINK_REGEX.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = LINK_REGEX.exec(text))) {
    const [full, mdLabel, mdUrl, rawUrl] = match;
    const start = match.index;

    if (start > lastIndex) segments.push({ text: text.slice(lastIndex, start) });

    if (mdUrl) {
      segments.push({ href: mdUrl, label: mdLabel, internal: isInternalUrl(mdUrl) });
    } else if (rawUrl) {
      const trailMatch = rawUrl.match(TRAILING_PUNCT_REGEX);
      const cleanUrl = trailMatch ? rawUrl.slice(0, -trailMatch[0].length) : rawUrl;
      const trailing = trailMatch ? trailMatch[0] : '';

      if (cleanUrl) {
        segments.push({ href: cleanUrl, label: getDomainLabel(cleanUrl), internal: isInternalUrl(cleanUrl) });
      }
      if (trailing) segments.push({ text: trailing });
    }

    lastIndex = start + full.length;
  }

  if (lastIndex < text.length) segments.push({ text: text.slice(lastIndex) });
  return segments;
}

type LinkedTextProps = { text: string };

// renders plain text with markdown-style [label](url) links and bare pasted
// urls turned into clickable links (bare urls show just the domain); links to
// this site route client-side, external links open in a new tab
export const LinkedText = component$(({ text }: LinkedTextProps) => {
  const segments = parseLinkedSegments(text);

  return (
    <>
      {segments.map((seg, i) => {
        if (!('href' in seg)) return <span key={i}>{seg.text}</span>;

        return seg.internal ? (
          <Link key={i} href={toInternalHref(seg.href)} class="link link-info">
            {seg.label}
          </Link>
        ) : (
          <a
            key={i}
            href={seg.href}
            target="_blank"
            rel="noopener noreferrer"
            class="link link-info"
          >
            {seg.label}
          </a>
        );
      })}
    </>
  );
});
