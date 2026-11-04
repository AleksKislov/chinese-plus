import { component$, useSignal, Slot } from '@builder.io/qwik';
import { dropdownArrowBottom } from '../../media/svg';

export type MenuDropdownGroupProps = {
  name: string;
};

export const MenuDropdownGroup = component$(({ name }: MenuDropdownGroupProps) => {
  const isOpen = useSignal(false);

  return (
    <li
      class="dropdown dropdown-hover hover:text-success"
      onMouseEnter$={() => (isOpen.value = true)}
      onMouseLeave$={() => (isOpen.value = false)}
    >
      <label
        tabIndex={0}
        class="my-1 hover:text-secondary"
        onClick$={() => (isOpen.value = !isOpen.value)}
      >
        {name}
        {dropdownArrowBottom}
      </label>
      <ul
        class={`dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-64 text-base-content ${
          isOpen.value ? '' : 'hidden'
        }`}
        onClick$={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest('a')) {
            isOpen.value = false;
          }
        }}
      >
        <Slot />
      </ul>
    </li>
  );
});
