import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

type BackBtnProps = {
  path: string;
};

export const BackBtn = component$(({ path }: BackBtnProps) => (
  <div class='mb-3'>
    <Link href={path}>
      <button class={`btn btn-sm btn-info btn-outline`} type='button'>
        назад
      </button>
    </Link>
  </div>
));
