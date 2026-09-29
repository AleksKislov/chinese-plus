import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { JsonLd } from '~/components/common/seo/json-ld';
import CONST_URLS from '~/misc/consts/urls';

export type Crumb = {
  name: string;
  // Omitted on the last crumb - the page the visitor is already on.
  href?: string;
};

type BreadcrumbsProps = {
  // Everything after "Главная", which is always prepended.
  items: Crumb[];
};

/**
 * Visible breadcrumb trail plus the matching schema.org BreadcrumbList, so search
 * engines show the same path in the result snippet instead of the raw URL.
 */
export const Breadcrumbs = component$(({ items }: BreadcrumbsProps) => {
  const crumbs: Crumb[] = [{ name: 'Главная', href: '/' }, ...items];

  return (
    <>
      <nav aria-label="Навигационная цепочка" class="breadcrumbs text-sm pt-0 mb-2">
        <ul>
          {crumbs.map(({ name, href }, ind) => (
            <li key={ind}>
              {href && ind < crumbs.length - 1 ? (
                <Link href={href} class="link link-hover">
                  {name}
                </Link>
              ) : (
                <span aria-current="page" class="opacity-70">
                  {name}
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: crumbs.map(({ name, href }, ind) => ({
            '@type': 'ListItem',
            position: ind + 1,
            name,
            ...(href ? { item: `${CONST_URLS.siteUrl}${href}` } : {}),
          })),
        }}
      />
    </>
  );
});
