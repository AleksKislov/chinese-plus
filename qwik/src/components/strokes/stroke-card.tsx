import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import HanziWriter from 'hanzi-writer';
import { type StrokeExample } from '~/routes/start/strokes';

type StrokeCardProps = {
  char: StrokeExample;
  ind: number;
  isSimple: 1 | 0;
};
export const GreenColor = '#32a852';
export const GreyColor = '#71717a';

export const HanziWriterSettings = {
  width: 80,
  height: 80,
  padding: 0,
  showOutline: true,
  strokeColor: GreyColor,
};

export const StrokeCard = component$(({ char, ind, isSimple }: StrokeCardProps) => {
  const mainCharDivId = 'mainCharDivId' + ind + isSimple;
  const CHAR_SVG_DIV_ID = 'CHAR_SVG_DIV_ID' + ind + isSimple;
  const CHAR_SVG_DIV_ID1 = CHAR_SVG_DIV_ID + 0;
  const CHAR_SVG_DIV_ID2 = CHAR_SVG_DIV_ID + 1;
  const CHAR_SVG_DIV_ID3 = CHAR_SVG_DIV_ID + 2;

  useVisibleTask$(() => {
    HanziWriter.loadCharacterData(char.example).then(function (charData) {
      const target = document.getElementById(mainCharDivId);
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.style.width = '150px';
      svg.style.height = '150px';
      target!.appendChild(svg);
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

      const transformData = HanziWriter.getScalingTransform(150, 150);
      group.setAttributeNS(null, 'transform', transformData.transform);
      svg.appendChild(group);

      // @ts-ignore
      charData.strokes.forEach((strokePath, ind) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttributeNS(null, 'd', strokePath);
        if (ind === char.strokeNum - 1) {
          path.style.fill = GreenColor;
        } else {
          path.style.fill = GreyColor;
        }

        group.appendChild(path);
      });
    });

    char.examples.forEach((x, i) => {
      const id = CHAR_SVG_DIV_ID + i;
      const writer = HanziWriter.create(id, x, HanziWriterSettings);
      document.getElementById(id)!.addEventListener('click', () => writer.animateCharacter());
    });
  });

  return (
    <div class="card w-full bg-base-200 mb-3">
      <div class="card-body">
        <div class="flex flex-col lg:flex-row">
          <div id={mainCharDivId} class="mr-3"></div>
          <div class="w-full">
            <div>
              На китайском:{' '}
              <div class="tooltip tooltip-info" data-tip={'Посмотреть в словаре'}>
                <Link class="text-2xl hover:link-success" href={`/search/?q=${char.name}`}>
                  {char.name}
                </Link>
              </div>
            </div>
            {char.ruName ? (
              <p>
                На русском: <span class="font-bold">{char.ruName}</span>
              </p>
            ) : null}

            <hr class="mt-3" />
            <p>
              <span class="text-xs">клик на иероглиф для анимации</span>{' '}
            </p>
            <div class="flex flex-row">
              <div id={CHAR_SVG_DIV_ID1}></div>
              <div id={CHAR_SVG_DIV_ID2}></div>
              <div id={CHAR_SVG_DIV_ID3}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
