import { component$ } from "@builder.io/qwik";

type TextsNumInfoCardProps = {
  approved?: number;
  notApproved?: number;
  withAudio?: number;
};
export const TextsNumInfoCard = component$(
  ({ approved, notApproved, withAudio }: TextsNumInfoCardProps) => {
    return (
      <div class='card bg-primary text-primary-content'>
        <div class='card-body'>
          <h2 class='card-title'>Читай и учись</h2>
          <p>Чтение китайских текстов с умным переводом.</p>
          <p>
            Всего <span class='badge badge-accent'>{approved || 0}</span> текстов
          </p>
          <p>
            С аудио - <span class='badge badge-accent'>{withAudio || 0}</span>
          </p>
          {notApproved && (
            <p>
              На проверке: <span class='badge badge-accent'>{notApproved || 0}</span>
            </p>
          )}
        </div>
      </div>
    );
  }
);
