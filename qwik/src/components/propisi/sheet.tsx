import { $, component$, useOnWindow, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { pluralRu } from '~/components/hsk/exams/levels';
import {
  type SheetChar,
  type SheetGrid,
  type SheetOptions,
  CELL_MM,
  ORDER_CELL_MM,
  SHEET_PADDING_MM,
  SHEET_WIDTH_MM,
  cellsPerRow,
} from './types';

// hanzi-writer stroke paths per char; null - no stroke data, the char is drawn with a font
export type StrokesMap = Record<string, string[] | null | undefined>;

const GRID_COLOR = '#e08080';
const MODEL_COLOR = '#111111';
const TRACE_COLOR = '#c4c4c4';
const DONE_STROKE_COLOR = '#c4c4c4';
// the sheet with its padding in CSS px (96 per inch)
const SHEET_PX = ((SHEET_WIDTH_MM + 2 * SHEET_PADDING_MM) * 96) / 25.4;

const KAI_FONT = "'KaiTi', 'STKaiti', 'Kaiti SC', 'Noto Serif SC', serif";

// empty cell, or a char in one colour, or a stroke order step (strokes up to `step`)
type Cell = { ch: string; strokes?: string[] | null; color?: string; step?: number } | null;

const CharSvg = ({ cell, x }: { cell: NonNullable<Cell>; x: number }) => (
  <svg x={x + 5} y={5} width={90} height={90} viewBox="0 0 1024 1024">
    {cell.strokes ? (
      <g transform="translate(0, 900) scale(1, -1)">
        {cell.strokes.map((d, i) =>
          cell.step !== undefined && i > cell.step ? null : (
            <path
              key={i}
              d={d}
              fill={cell.step !== undefined && i < cell.step ? DONE_STROKE_COLOR : cell.color}
            />
          ),
        )}
      </g>
    ) : (
      <text
        x="512"
        y="520"
        font-size="880"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family={KAI_FONT}
        fill={cell.color}
      >
        {cell.ch}
      </text>
    )}
  </svg>
);

// a row of cells as one svg, 100 units per cell, so neighbours share their borders
const GridRow = ({ cells, cellMm, grid }: { cells: Cell[]; cellMm: number; grid: SheetGrid }) => {
  const width = cells.length * 100;
  const dashed = { stroke: GRID_COLOR, 'stroke-width': 0.8, 'stroke-dasharray': '4 3' };
  const solid = { stroke: GRID_COLOR, 'stroke-width': 1.4 };

  return (
    <svg
      viewBox={`0 0 ${width} 100`}
      style={{ width: `${cells.length * cellMm}mm`, height: `${cellMm}mm` }}
      class="block"
    >
      {grid !== 'kou' && <line x1={0} y1={50} x2={width} y2={50} {...dashed} />}
      {cells.map((_, i) => (
        <g key={i}>
          {grid !== 'kou' && (
            <line x1={i * 100 + 50} y1={0} x2={i * 100 + 50} y2={100} {...dashed} />
          )}
          {grid === 'mi' && (
            <>
              <line x1={i * 100} y1={0} x2={i * 100 + 100} y2={100} {...dashed} />
              <line x1={i * 100 + 100} y1={0} x2={i * 100} y2={100} {...dashed} />
            </>
          )}
          {i > 0 && <line x1={i * 100} y1={0} x2={i * 100} y2={100} {...solid} />}
        </g>
      ))}
      <rect x={0.7} y={0.7} width={width - 1.4} height={98.6} fill="none" {...solid} />
      {cells.map((cell, i) => cell && <CharSvg key={i} cell={cell} x={i * 100} />)}
    </svg>
  );
};

const chunk = <T,>(arr: T[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );

type SheetProps = {
  chars: SheetChar[];
  strokes: StrokesMap;
  opts: SheetOptions;
  title: string;
};

export const Sheet = component$(({ chars, strokes, opts, title }: SheetProps) => {
  const cols = cellsPerRow(opts.size);
  const cellMm = CELL_MM[opts.size];
  const orderCols = Math.floor(SHEET_WIDTH_MM / ORDER_CELL_MM);

  // on narrow screens the A4 preview is scaled down to fit; print CSS resets zoom to 1
  const wrapRef = useSignal<HTMLElement>();
  const zoom = useSignal(1);
  const fit = $(() => {
    const width = wrapRef.value?.clientWidth;
    if (width) zoom.value = Math.min(1, width / SHEET_PX);
  });
  useOnWindow('resize', fit);
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => fit());

  return (
    <div ref={wrapRef} class="overflow-x-auto">
      <div
        id="propisi-sheet"
        class="w-fit mx-auto bg-white text-black rounded-md shadow-lg print:shadow-none"
        style={{ padding: `${SHEET_PADDING_MM}mm`, zoom: String(zoom.value) }}
      >
        <div style={{ width: `${SHEET_WIDTH_MM}mm` }}>
          <div class="flex justify-between items-end gap-4 text-[10pt] mb-[5mm]">
            <span class="font-semibold">{title}</span>
            <span class="whitespace-nowrap">Имя: ____________ Дата: ________</span>
          </div>

          {chars.map(({ ch, py, ru }) => {
            const charStrokes = strokes[ch];
            const practice: Cell[][] = Array.from({ length: opts.rows }, (_, row) =>
              Array.from({ length: cols }, (_, i) => {
                if (row > 0 || i > opts.trace) return null;
                return { ch, strokes: charStrokes, color: i === 0 ? MODEL_COLOR : TRACE_COLOR };
              }),
            );
            const orderCells: Cell[] = (charStrokes || []).map((_, step) => ({
              ch,
              strokes: charStrokes,
              color: MODEL_COLOR,
              step,
            }));

            return (
              <div key={ch} class="break-inside-avoid mb-[5mm]">
                <div class="flex flex-wrap items-baseline gap-x-2 text-[11pt] mb-[1.5mm]">
                  {opts.py && py && <span class="font-semibold">{py}</span>}
                  {opts.ru && ru && <span>— {ru}</span>}
                  {charStrokes && (
                    <span class="text-gray-500">
                      · {charStrokes.length}{' '}
                      {pluralRu(charStrokes.length, ['черта', 'черты', 'черт'])}
                    </span>
                  )}
                </div>

                {opts.order &&
                  chunk(orderCells, orderCols).map((cells, i) => (
                    <div key={i} class="mb-[1.5mm]">
                      <GridRow cells={cells} cellMm={ORDER_CELL_MM} grid={opts.grid} />
                    </div>
                  ))}

                {practice.map((cells, i) => (
                  <div key={i} class="mb-[1.5mm]">
                    <GridRow cells={cells} cellMm={cellMm} grid={opts.grid} />
                  </div>
                ))}
              </div>
            );
          })}

          <div class="text-[8pt] text-gray-500 mt-[2mm]">
            chineseplus.club/propisi · порядок черт
          </div>
        </div>
      </div>
    </div>
  );
});
