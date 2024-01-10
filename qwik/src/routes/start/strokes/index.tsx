import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { CharactersLinkCard } from "~/components/common/content-cards/characters-link-card";
import { FlexRow } from "~/components/common/layout/flex-row";
import { MainContent } from "~/components/common/layout/main-content";
import { Sidebar } from "~/components/common/layout/sidebar";
import { PageTitle } from "~/components/common/layout/title";
import { StrokeCard } from "~/components/strokes/stroke-card";

export type StrokeExample = {
  name: string;
  example: string;
  examples: string[];
  ruName?: string;
  strokeNum: number;
};

export default component$(() => {
  const simpleStrokes: StrokeExample[] = [
    {
      name: "点",
      example: "犬",
      ruName: "точка",
      strokeNum: 4,
      examples: ["文", "头", "主"],
    },
    {
      name: "横",
      example: "一",
      ruName: "горизонталь",
      strokeNum: 1,
      examples: ["王", "天", "二"],
    },
    {
      name: "竖",
      example: "十",
      ruName: "вертикаль",
      strokeNum: 2,
      examples: ["中", "干", "工"],
    },
    {
      name: "撇",
      example: "八",
      ruName: "откидная влево",
      strokeNum: 1,
      examples: ["人", "大", "行"],
    },
    {
      name: "捺",
      example: "又",
      ruName: "откидная вправо",
      strokeNum: 2,
      examples: ["入", "夫", "丈"],
    },
    {
      name: "提",
      example: "河",
      ruName: "восходящая",
      strokeNum: 3,
      examples: ["冰", "冷", "湖"],
    },
  ];

  const compexStrokes: StrokeExample[] = [
    {
      name: "横钩",
      example: "买",
      strokeNum: 1,
      examples: ["卖", "定", "皮"],
    },
    {
      name: "竖钩",
      example: "小",
      strokeNum: 1,
      examples: ["水", "寸", "刮"],
    },
    {
      name: "斜钩",
      example: "我",
      strokeNum: 5,
      examples: ["代", "或", "钱"],
    },
    {
      name: "横折",
      example: "口",
      strokeNum: 2,
      examples: ["国", "目", "皿"],
    },
    {
      name: "竖折",
      example: "山",
      strokeNum: 2,
      examples: ["出", "医", "区"],
    },
    {
      name: "横撇",
      example: "又",
      strokeNum: 1,
      examples: ["友", "麦", "权"],
    },
    {
      name: "撇点",
      example: "女",
      strokeNum: 1,
      examples: ["巡", "姜", "好"],
    },
    {
      name: "横折折折钩",
      example: "乃",
      strokeNum: 1,
      examples: ["汤", "孕", "场"],
    },

    {
      name: "横斜弯钩",
      example: "乙",
      strokeNum: 1,
      examples: ["乙", "亿", "忆"],
    },

    {
      name: "竖弯钩",
      example: "扎",
      strokeNum: 4,
      examples: ["乱", "扎", "己"],
    },
    {
      name: "横折弯钩",
      example: "几",
      strokeNum: 2,
      examples: ["九", "机", "究"],
    },

    {
      name: "竖折弯钩",
      example: "马",
      strokeNum: 2,
      examples: ["号", "丐", "弓"],
    },

    {
      name: "弯钩",
      example: "狗",
      strokeNum: 2,
      examples: ["家", "狄", "逐"],
    },

    {
      name: "横折钩",
      example: "习",
      strokeNum: 1,
      examples: ["羽", "包", "刀"],
    },

    {
      name: "横折提",
      example: "计",
      strokeNum: 2,
      examples: ["识", "认", "话"],
    },
    {
      name: "横折折撇",
      example: "及",
      strokeNum: 2,
      examples: ["建", "极", "级"],
    },

    {
      name: "横撇弯钩",
      example: "队",
      strokeNum: 1,
      examples: ["邮", "郊", "部"],
    },

    {
      name: "撇折",
      example: "公",
      strokeNum: 3,
      examples: ["弘", "台", "挨"],
    },

    {
      name: "竖提",
      example: "民",
      strokeNum: 3,
      examples: ["很", "良", "食"],
    },

    {
      name: "竖折撇",
      example: "专",
      strokeNum: 3,
      examples: ["传", "转", "砖"],
    },

    {
      name: "竖折折",
      example: "鼎",
      strokeNum: 6,
      examples: ["鼎", "鼎", "鼎"],
    },

    {
      name: "横折折",
      example: "凹",
      strokeNum: 2,
      examples: ["凹", "凹", "凹"],
    },

    {
      name: "横折折折",
      example: "凸",
      strokeNum: 4,
      examples: ["凸", "凸", "凸"],
    },

    {
      name: "横折弯",
      example: "朵",
      strokeNum: 2,
      examples: ["投", "沿", "剁"],
    },

    {
      name: "扁斜钩",
      example: "心",
      strokeNum: 2,
      examples: ["必", "密", "蕊"],
    },
    {
      name: "横斜钩",
      example: "飞",
      strokeNum: 1,
      examples: ["氧", "气", "风"],
    },
  ];
  return (
    <>
      <PageTitle txt={"Черты китайских иероглифов"} />

      <FlexRow>
        <Sidebar>
          <div class='card w-full bg-base-200'>
            <div class='card-body'>
              <h2 class='card-title'>Черточки</h2>
              <p>
                Познакомились с чертами - переходите знакомиться со следующим понятием в
                иероглифике:{" "}
                <Link href='/start/radicals' class='link hover:link-success font-bold'>
                  ключи
                </Link>
              </p>
            </div>
          </div>
          <CharactersLinkCard />
        </Sidebar>
        <MainContent>
          <div class='prose mb-3'>
            <p>
              Черта по-китайски - это 笔画 bǐhuà или иногда просто 画 huà. Ниже приведены черты, из
              которых состоят все иероглифы китайского языка. Как бы сложно иероглиф ни выглядел,
              его всегда можно разложить на определенное количество черт.
            </p>
            <p>
              Черты можно разделить на базовые (или простые) и комплексные (сложные). Сложные черты
              состоят из двух и более простых (плюс элемент "крюк" или 钩 gōu), но они также пишутся
              без отрыва кисти/ручки от бумаги.
            </p>
          </div>

          <div class='prose mb-2'>
            <h3>Простые черты</h3>
          </div>
          <div class='max-w-prose'>
            {simpleStrokes.map((x, ind) => (
              <StrokeCard char={x} ind={ind} isSimple={1} />
            ))}
          </div>

          <div class='prose mb-2'>
            <h3>Комплексные черты</h3>
          </div>
          <div class='max-w-prose'>
            {compexStrokes.map((x, ind) => (
              <StrokeCard char={x} ind={ind} isSimple={0} />
            ))}
          </div>
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: "Chinese+ Черты китайских иероглифов",
  meta: [
    {
      name: "description",
      content: "Черточек, из которых состоят китайские иероглифы, не так уж и много.",
    },
  ],
};
