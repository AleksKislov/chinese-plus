import { component$ } from '@builder.io/qwik';

type JsonLdProps = {
  data: Record<string, unknown>;
};

// Escape "<" so user-generated titles/descriptions containing "</script>" can't break out of the tag.
export const JsonLd = component$(({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={JSON.stringify(data).replace(/</g, '\\u003c')}
  />
));
