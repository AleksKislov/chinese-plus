import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { type GrammarLevelInfo, grammarLevelLabel, grammarLevelUrl } from './types';

type GrammarLevelsCardProps = {
  levels: GrammarLevelInfo[];
  curLevel: string;
};

export const GrammarLevelsCard = component$(({ levels, curLevel }: GrammarLevelsCardProps) => {
  return (
    <div class="card bg-primary text-primary-content">
      <div class="card-body">
        <p class="card-title">Грамматика по уровням HSK 3.0</p>
        <p>
          Все темы грамматического минимума нового HSK 3.0 (редакция 2026) с объяснениями,
          примерами, переводом и озвучкой
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="table w-full overflow-hidden !rounded-t-none">
          <tbody>
            {levels.map(({ level, count }) => (
              <tr
                key={level}
                class={`hover ${curLevel === level ? 'bg-base-200 text-primary-focus' : ''}`}
              >
                <td class="pl-8">
                  <Link href={grammarLevelUrl(level)} class="block">
                    Уровень {grammarLevelLabel(level)}
                  </Link>
                </td>
                <td class="float-right pr-8">
                  <span class="badge bg-warning text-warning-content">{count}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
