import { $, component$, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';
import { Loader } from '~/components/common/ui/loader';

const CANVAS_HEIGHT = 180;
const FALLBACK_WIDTH = 320;

type Point = { x: number; y: number };

export const HandwritingInput = component$(() => {
  const nav = useNavigate();
  const containerRef = useSignal<HTMLDivElement>();
  const canvasRef = useSignal<HTMLCanvasElement>();
  const canvasWidth = useSignal(FALLBACK_WIDTH);
  const isDrawing = useSignal(false);
  const strokes = useStore<number[][][]>([]);
  const candidates = useSignal<string[] | null>(null);
  const loading = useSignal(false);

  useVisibleTask$(({ cleanup }) => {
    const resize = () => {
      const width = containerRef.value?.clientWidth;
      if (!width || Math.round(width) === canvasWidth.value) return;

      canvasWidth.value = Math.round(width);
      strokes.splice(0, strokes.length);
      candidates.value = null;
    };

    resize();
    window.addEventListener('resize', resize);
    cleanup(() => window.removeEventListener('resize', resize));
  });

  const getPoint = $((e: PointerEvent): Point | null => {
    const canvas = canvasRef.value;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  });

  const startStroke = $(async (e: PointerEvent) => {
    const point = await getPoint(e);
    if (!point) return;

    isDrawing.value = true;
    candidates.value = null;
    strokes.push([[point.x], [point.y]]);

    const ctx = canvasRef.value?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
    }
  });

  const continueStroke = $(async (e: PointerEvent) => {
    if (!isDrawing.value) return;
    const point = await getPoint(e);
    if (!point) return;

    const current = strokes[strokes.length - 1];
    current[0].push(point.x);
    current[1].push(point.y);

    const ctx = canvasRef.value?.getContext('2d');
    if (ctx) {
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  });

  const endStroke = $(() => {
    isDrawing.value = false;
  });

  const clear = $(() => {
    strokes.splice(0, strokes.length);
    candidates.value = null;

    const canvas = canvasRef.value;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  const recognize = $(async () => {
    if (!strokes.length) return;
    loading.value = true;
    const res = await ApiService.post(
      '/api/dictionary/handwritingSearch',
      {
        strokes: strokes.map((stroke) => [[...stroke[0]], [...stroke[1]]]),
        width: canvasWidth.value,
        height: CANVAS_HEIGHT,
      },
      undefined,
      { candidates: [] },
    );
    candidates.value = res.candidates || [];
    loading.value = false;
  });

  return (
    <div class="my-3" ref={containerRef}>
      <div class="text-sm opacity-70 mb-1">Можно сразу несколько иероглифов</div>

      <canvas
        ref={canvasRef}
        width={canvasWidth.value}
        height={CANVAS_HEIGHT}
        class="border border-base-300 rounded bg-white touch-none w-full"
        onPointerDown$={startStroke}
        onPointerMove$={continueStroke}
        onPointerUp$={endStroke}
        onPointerLeave$={endStroke}
      />

      <div class="flex gap-2 mt-2">
        <button type="button" class="btn btn-sm" onClick$={clear}>
          Очистить
        </button>
        <button
          type="button"
          class="btn btn-sm btn-primary"
          onClick$={recognize}
          disabled={loading.value}
        >
          {loading.value ? <Loader size="sm" /> : 'Распознать'}
        </button>
      </div>

      {candidates.value && candidates.value.length > 0 && (
        <div class="flex flex-wrap gap-2 mt-2">
          {candidates.value.map((char) => (
            <button
              key={char}
              type="button"
              class="btn btn-sm btn-outline text-lg"
              onClick$={() => nav('/dictionary/' + encodeURIComponent(char))}
            >
              {char}
            </button>
          ))}
        </div>
      )}

      {candidates.value && candidates.value.length === 0 && (
        <div class="mt-2 text-sm opacity-70">Символы не распознаны, попробуйте ещё раз</div>
      )}
    </div>
  );
});
