import "../app/bootstrap.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import MainLayout from "../components/layout/main-layout";

export default function Custom404() {
  return (
    <MainLayout>
      {
        <div>
          <h1 className='text-primary'>
            <FontAwesomeIcon icon={faCoffee} /> Страница Не Найдена
          </h1>
          <p className='mb-0'>Упс, такой страницы нет.</p>
        </div>
      }
    </MainLayout>
  );
}
