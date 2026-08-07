import { component$, useContext } from '@builder.io/qwik';

import { userContext } from '~/root';
import { editSvg } from '../media/svg';
import { editWordModalId } from './word-tooltip';

export const EditWordBtn = component$(() => {
  const userState = useContext(userContext);
  const { isAdmin } = userState;

  if (!isAdmin) return null;

  return (
    <div class="tooltip tooltip-info tooltip-bottom" data-tip={'Редактировать'}>
      <label for={editWordModalId} class="btn btn-sm btn-info">
        {editSvg}
      </label>
    </div>
  );
});
