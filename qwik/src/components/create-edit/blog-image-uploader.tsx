import { component$, useContext, useSignal, useTask$, type QRL } from '@builder.io/qwik';
import { useUploadBlogImage } from '~/misc/actions/blog/upload-image';
import { useGetPics, type ThemePicType } from '~/routes/(content)/create/text';
import CONSTANTS from '~/misc/consts/consts';
import { arrorUturnDown } from '../common/media/svg';
import { alertsContext } from '~/root';

type BlogImagePickerProps = {
  label?: string;
  initialUrl?: string;
  onChange$: QRL<(url: string) => void>;
};

export const BlogImagePicker = component$(
  ({ label, initialUrl, onChange$ }: BlogImagePickerProps) => {
    const alertsState = useContext(alertsContext);
    const uploadImage = useUploadBlogImage();
    const getPics = useGetPics();
    const mode = useSignal<'upload' | 'url' | 'unsplash'>('upload');
    const urlInput = useSignal(initialUrl || '');
    const picTheme = useSignal('');
    const picsRequestsLeft = useSignal(CONSTANTS.maxThemePicRequests);

    useTask$(({ track }) => {
      const res = track(() => uploadImage.value);
      if (res?.url) onChange$(res.url);
    });

    return (
      <div class="form-control w-full">
        {label && (
          <label class="label">
            <span class="label-text">{label}</span>
          </label>
        )}

        <div class="join mb-1">
          <button
            type="button"
            class={`btn btn-xs join-item ${mode.value === 'upload' ? 'btn-active' : ''}`}
            onClick$={() => (mode.value = 'upload')}
          >
            Загрузить
          </button>
          <button
            type="button"
            class={`btn btn-xs join-item ${mode.value === 'url' ? 'btn-active' : ''}`}
            onClick$={() => (mode.value = 'url')}
          >
            По ссылке
          </button>
          <button
            type="button"
            class={`btn btn-xs join-item ${mode.value === 'unsplash' ? 'btn-active' : ''}`}
            onClick$={() => (mode.value = 'unsplash')}
          >
            Unsplash
          </button>
        </div>

        {mode.value === 'upload' && (
          <input
            type="file"
            accept="image/*"
            class="file-input file-input-bordered file-input-sm w-full"
            disabled={uploadImage.isRunning}
            onChange$={(_, el) => {
              const file = el.files?.[0];
              if (!file) return;
              const formData = new FormData();
              formData.append('image', file);
              uploadImage.submit(formData);
            }}
          />
        )}

        {mode.value === 'url' && (
          <input
            type="text"
            placeholder="https://..."
            class="input input-bordered input-sm w-full"
            value={urlInput.value}
            onChange$={(e) => {
              urlInput.value = (e.target as HTMLInputElement).value;
              onChange$(urlInput.value);
            }}
          />
        )}

        {mode.value === 'unsplash' && (
          <div>
            <div class="join mb-1">
              <input
                type="text"
                placeholder="An English word"
                class="input input-bordered input-sm join-item"
                bind:value={picTheme}
              />
              <button
                type="button"
                class="btn btn-sm join-item btn-primary"
                disabled={picsRequestsLeft.value <= 0}
                onClick$={() => {
                  const latinLettersRegex = /^[A-Za-z]*$/;

                  if (picTheme.value && latinLettersRegex.test(picTheme.value)) {
                    getPics.submit({ picTheme: picTheme.value, orientation: 'any' });
                    picsRequestsLeft.value--;
                  } else {
                    alertsState.push({
                      bg: 'alert-error',
                      text: 'Тема картинки должна быть на английском',
                    });
                  }
                }}
              >
                {arrorUturnDown}
                <span class="ml-1">{picsRequestsLeft.value}</span>
              </button>
            </div>

            {Array.isArray(getPics.value) && getPics.value.length > 0 && (
              <div class="flex flex-wrap gap-2">
                {getPics.value.map((pic: ThemePicType, ind) => (
                  <img
                    key={ind}
                    src={pic.small}
                    class={`object-cover w-16 h-16 rounded-md cursor-pointer ${
                      pic.regular === urlInput.value ? 'border-2 border-primary' : ''
                    }`}
                    onClick$={() => {
                      urlInput.value = pic.regular;
                      onChange$(pic.regular);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {uploadImage.isRunning && <span class="loading loading-spinner loading-sm mt-2"></span>}
      </div>
    );
  },
);
