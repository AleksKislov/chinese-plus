import { $, component$, useOnWindow, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { pluralRu } from '~/components/hsk/exams/levels';
import {
  type SheetChar,
  type SheetGrid,
  type SheetOptions,
  ORDER_CELL_MM,
  SHEET_PADDING_MM,
  SHEET_WIDTH_MM,
  cellMm,
  hasStrokes,
} from './types';

// hanzi-writer stroke paths per char; null - no stroke data, the char is drawn with a font
export type StrokesMap = Record<string, string[] | null | undefined>;
// 行书 outline per char of one font (1000x1000 box, y down); null - not in the font, drawn as 楷书
export type GlyphsMap = Record<string, string | null | undefined>;

const GRID_COLOR = '#e08080';
const MODEL_COLOR = '#111111';
const TRACE_COLOR = '#c4c4c4';
const DONE_STROKE_COLOR = '#c4c4c4';
// the sheet with its padding in CSS px (96 per inch)
const SHEET_PX = ((SHEET_WIDTH_MM + 2 * SHEET_PADDING_MM) * 96) / 25.4;

const KAI_FONT = "'KaiTi', 'STKaiti', 'Kaiti SC', 'Noto Serif SC', serif";

// empty cell, or a char in one colour, or a stroke order step (strokes up to `step`)
type Cell = {
  ch: string;
  strokes?: string[] | null;
  glyph?: string | null;
  color?: string;
  step?: number;
} | null;

const CharSvg = ({ cell, x, y }: { cell: NonNullable<Cell>; x: number; y: number }) =>
  cell.glyph ? (
    // a long stroke may reach a bit past the box, into the cell's margin
    <svg x={x + 5} y={y + 5} width={90} height={90} viewBox="0 0 1000 1000" overflow="visible">
      <path d={cell.glyph} fill={cell.color} />
    </svg>
  ) : (
    <svg x={x + 5} y={y + 5} width={90} height={90} viewBox="0 0 1024 1024">
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

// a block of cells (rows of equal length) as one svg, 100 units per cell, so neighbours share
// their borders; line widths are set in mm, so small and brush-size cells print the same lines
const Grid = ({ cells, sizeMm, grid }: { cells: Cell[][]; sizeMm: number; grid: SheetGrid }) => {
  const nCols = cells[0]?.length ?? 0;
  const width = nCols * 100;
  const height = cells.length * 100;
  const unit = 100 / sizeMm; // svg units per mm
  const dashed = {
    stroke: GRID_COLOR,
    'stroke-width': 0.15 * unit,
    'stroke-dasharray': `${0.8 * unit} ${0.6 * unit}`,
  };
  const solid = { stroke: GRID_COLOR, 'stroke-width': 0.25 * unit };
  const inset = 0.125 * unit;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: `${nCols * sizeMm}mm`, height: `${cells.length * sizeMm}mm` }}
      class="block"
    >
      {cells.map((_, r) => (
        <g key={`r${r}`}>
          {grid !== 'kou' && (
            <line x1={0} y1={r * 100 + 50} x2={width} y2={r * 100 + 50} {...dashed} />
          )}
          {r > 0 && <line x1={0} y1={r * 100} x2={width} y2={r * 100} {...solid} />}
        </g>
      ))}
      {cells[0]?.map((_, c) => (
        <g key={`c${c}`}>
          {grid !== 'kou' && (
            <line x1={c * 100 + 50} y1={0} x2={c * 100 + 50} y2={height} {...dashed} />
          )}
          {c > 0 && <line x1={c * 100} y1={0} x2={c * 100} y2={height} {...solid} />}
        </g>
      ))}
      {grid === 'mi' &&
        cells.map((row, r) =>
          row.map((_, c) => (
            <g key={`m${r}-${c}`}>
              <line x1={c * 100} y1={r * 100} x2={c * 100 + 100} y2={r * 100 + 100} {...dashed} />
              <line x1={c * 100 + 100} y1={r * 100} x2={c * 100} y2={r * 100 + 100} {...dashed} />
            </g>
          )),
        )}
      <rect
        x={inset}
        y={inset}
        width={width - 2 * inset}
        height={height - 2 * inset}
        fill="none"
        {...solid}
      />
      {cells.map((row, r) =>
        row.map(
          (cell, c) => cell && <CharSvg key={`${r}-${c}`} cell={cell} x={c * 100} y={r * 100} />,
        ),
      )}
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
  glyphs: GlyphsMap; // of opts.font
  opts: SheetOptions;
  title: string;
};

// dir v: column height, so a band with the header above it fits an A4 page (273 mm inside margins)
const V_GRID_MM = 220;

export const Sheet = component$(({ chars, strokes, glyphs, opts, title }: SheetProps) => {
  const cols = opts.cols;
  const sizeMm = cellMm(cols);
  const orderCols = Math.floor(SHEET_WIDTH_MM / ORDER_CELL_MM);
  const showOrder = opts.order && hasStrokes(opts.font);
  const showCount = opts.count && hasStrokes(opts.font);

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

  const charCell = (ch: string, color: string): Cell => ({
    ch,
    strokes: strokes[ch],
    glyph: opts.font === 'kai' ? null : glyphs[ch],
    color,
  });

  const orderRows = (ch: string) => {
    const charStrokes = strokes[ch];
    const cells: Cell[] = (charStrokes || []).map((_, step) => ({
      ch,
      strokes: charStrokes,
      color: MODEL_COLOR,
      step,
    }));
    return chunk(cells, orderCols).map((row, i) => (
      <div key={i} class={i ? 'mt-[1.5mm]' : ''}>
        <Grid cells={[row]} sizeMm={ORDER_CELL_MM} grid={opts.grid} />
      </div>
    ));
  };

  // dir v: every char is its stroke order (a strip of small cells, top to bottom) and opts.rows
  // columns, the first one with the model and the traces under the 楷书 char and its pinyin;
  // chars that fit across the sheet form a band, the rest of a band's width is empty columns
  const vertical = () => {
    const height = Math.max(cols, Math.floor(V_GRID_MM / sizeMm));
    const perOrderCol = Math.floor((height * sizeMm) / ORDER_CELL_MM);
    const gap = showOrder ? 2 : 0;
    const pyMm = Math.min(3.5, sizeMm * 0.28);
    const chMm = Math.min(9, sizeMm * 0.6);

    const items = chars.map((char) => {
      const steps = (showOrder && strokes[char.ch]?.length) || 0;
      const orderCols = Math.ceil(steps / perOrderCol);
      const orderMm = orderCols ? orderCols * ORDER_CELL_MM + 1 : 0;
      const charCols = Math.max(
        1,
        Math.min(opts.rows, Math.floor((SHEET_WIDTH_MM - orderMm + 0.01) / sizeMm)),
      );
      return { char, steps, orderCols, orderMm, charCols, width: orderMm + charCols * sizeMm };
    });

    const bands: typeof items[] = [];
    let used = Infinity;
    items.forEach((item) => {
      if (used + gap + item.width > SHEET_WIDTH_MM + 0.01) {
        bands.push([]);
        used = -gap;
      }
      bands[bands.length - 1].push(item);
      used += gap + item.width;
    });

    const emptyCols = (n: number): Cell[][] =>
      Array.from({ length: height }, () => Array.from({ length: n }, () => null));

    return bands.map((band, b) => {
      const bandMm = band.reduce((sum, item) => sum + item.width, 0) + gap * (band.length - 1);
      const extra = Math.floor((SHEET_WIDTH_MM - bandMm - gap + 0.01) / sizeMm);

      return (
        <div key={b} class="flex items-end break-inside-avoid mb-[6mm]" style={{ gap: `${gap}mm` }}>
          {band.map(({ char: { ch, py }, steps, orderCols, orderMm, charCols }) => {
            const orderRowsN = Math.ceil(steps / (orderCols || 1));
            const orderCells: Cell[][] = Array.from({ length: orderRowsN }, (_, r) =>
              Array.from({ length: orderCols }, (_, c) => {
                const step = c * orderRowsN + r;
                return step < steps ? { ch, strokes: strokes[ch], color: MODEL_COLOR, step } : null;
              }),
            );
            const practice: Cell[][] = Array.from({ length: height }, (_, r) =>
              Array.from({ length: charCols }, (_, c) =>
                c > 0 || r > opts.trace ? null : charCell(ch, r === 0 ? MODEL_COLOR : TRACE_COLOR),
              ),
            );

            return (
              <div key={ch}>
                <div
                  class="flex flex-col items-center leading-none mb-[1mm]"
                  style={{ marginLeft: `${orderMm}mm`, width: `${sizeMm}mm` }}
                >
                  <span style={{ fontFamily: KAI_FONT, fontSize: `${chMm}mm` }}>{ch}</span>
                  {opts.py && (
                    <span
                      class="whitespace-nowrap text-gray-800 mt-[0.8mm]"
                      style={{ fontSize: `${pyMm}mm` }}
                    >
                      {py || '\u00a0'}
                    </span>
                  )}
                </div>
                <div class="flex items-start gap-[1mm]">
                  {orderCols > 0 && (
                    <Grid cells={orderCells} sizeMm={ORDER_CELL_MM} grid={opts.grid} />
                  )}
                  <Grid cells={practice} sizeMm={sizeMm} grid={opts.grid} />
                </div>
              </div>
            );
          })}
          {extra > 0 && <Grid cells={emptyCols(extra)} sizeMm={sizeMm} grid={opts.grid} />}
        </div>
      );
    });
  };

  // dir h: every char is a line of pinyin, translation and stroke count, its stroke order and
  // opts.rows rows, the first one with the model and the traces
  const horizontal = () =>
    chars.map(({ ch, py, ru }) => {
      const n = strokes[ch]?.length;
      return (
        <div key={ch} class="break-inside-avoid mb-[5mm]">
          <div class="flex flex-wrap items-baseline gap-x-2 text-[11pt] mb-[1.5mm]">
            {opts.py && py && <span class="font-semibold">{py}</span>}
            {opts.ru && ru && <span>— {ru}</span>}
            {showCount && n && (
              <span class="text-gray-500">
                · {n} {pluralRu(n, ['черта', 'черты', 'черт'])}
              </span>
            )}
          </div>
          {showOrder && <div class="mb-[1.5mm]">{orderRows(ch)}</div>}
          {Array.from({ length: opts.rows }, (_, row) => (
            <div key={row} class="mb-[1.5mm]">
              <Grid
                cells={[
                  Array.from({ length: cols }, (_, i) =>
                    row > 0 || i > opts.trace
                      ? null
                      : charCell(ch, i === 0 ? MODEL_COLOR : TRACE_COLOR),
                  ),
                ]}
                sizeMm={sizeMm}
                grid={opts.grid}
              />
            </div>
          ))}
        </div>
      );
    });

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

          {opts.dir === 'v' ? vertical() : horizontal()}

          <div class="text-[8pt] text-gray-500 mt-[2mm]">
            chineseplus.club/propisi · все для изучения китайского языка
          </div>
        </div>
      </div>
    </div>
  );
});
