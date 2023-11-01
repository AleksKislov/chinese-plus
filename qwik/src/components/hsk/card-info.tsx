import { component$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";

export const CardInfo = component$(
  ({ isOldHsk, isForTests }: { isForTests: boolean; isOldHsk: boolean }) => {
    let text, title;

    const refresh = useNavigate();

    const isNewHskTable = !isOldHsk && !isForTests;
    const isOldHskTable = isOldHsk && !isForTests;
    const isNewHskTests = !isOldHsk && isForTests;
    const isOldHskTests = isOldHsk && isForTests;

    if (isOldHskTable) {
      text = "Все 5000 слов HSK, отсортированные по уровням сложности: от 1 до 6";
      title = "Слова HSK 2.0";
    } else if (isNewHskTable) {
      text =
        "Все слова нового HSK v3.0, отсортированные по уровням сложности (aka band): от 1 до 7-8-9 (последние 3 уровня не разделяют)";
      title = "Слова HSK 3.0";
    } else if (isNewHskTests) {
      text =
        "Проверьте насколько хорошо вы знаете лексику нового HSK 3.0 разных уровней сложности.";
      title = "Короткие тесты HSK 3.0";
    } else if (isOldHskTests) {
      text = "Проверьте насколько хорошо вы знаете лексику HSK 2.0 разных уровней сложности.";
      title = "Короткие тесты HSK 2.0";
    }

    return (
      <>
        <p class='card-title'>{title}</p>
        <p>{text}</p>
        {isForTests && (
          <button class='btn my-2' onClick$={() => refresh()}>
            Обновить тесты
          </button>
        )}
      </>
    );
  }
);
