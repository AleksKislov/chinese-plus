import { component$ } from "@builder.io/qwik";

type TagsLineProps = { tags: string[] };

export const TagsLine = component$(({ tags }: TagsLineProps) => {
  return (
    <span>
      {Array.isArray(tags) &&
        tags.map((tag, ind) => (
          <span key={ind} class='badge badge-outline mr-1'>
            {tag}
          </span>
        ))}
    </span>
  );
});
