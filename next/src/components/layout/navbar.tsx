"use client";
import { useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { loadUser } from "../../context/auth/actions";
import { NullUser, useAuthCtx } from "../../context/auth/store";

export default function TopNavbar() {
  const { user, setLoggedIn, setUser } = useAuthCtx();

  useEffect(() => {
    setTimeout(async () => {
      try {
        const user = await loadUser(localStorage.token);
        if (!user) throw new Error("not authorized");
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        console.log(err);
        setLoggedIn(false);
        setUser(NullUser);
      }
    });
  }, []);

  return (
    <Navbar bg='primary' expand='lg' variant='dark'>
      <Container>
        <Navbar.Brand href='/'>Chinese+Club</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav>
            <NavDropdown title='Читалка'>
              <NavDropdown.Item href='/read/texts'>Тексты</NavDropdown.Item>
              <NavDropdown.Item href='/read/book'>Книги</NavDropdown.Item>
              <NavDropdown.Item href='/read/not_approved_texts'>На проверке</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href='/read/statistics'>Герои Клуба</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title='Видео'>
              <NavDropdown.Item href='/watch/videos'>Видео</NavDropdown.Item>
              <NavDropdown.Item href='/watch/not_approved_videos'>На проверке</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title='Начинающим'>
              <NavDropdown.Item href='/start/pinyin-chart'>Таблица Пиньиня</NavDropdown.Item>
              <NavDropdown.Item href='/start/pinyin-tests'>Тесты на пиньинь</NavDropdown.Item>
              <NavDropdown.Item href='/start/radicals'>Ключи иероглифов</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title='HSK'>
              <NavDropdown.ItemText className='text-info small'>HSK 2.0</NavDropdown.ItemText>
              <NavDropdown.Item href='/hsk/2/table'>Все слова</NavDropdown.Item>
              <NavDropdown.Item href='/hsk/2/tests'>Тесты</NavDropdown.Item>
              <NavDropdown.Item href='/hsk/2/search'>Поиск</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.ItemText className='text-info small'>HSK 3.0</NavDropdown.ItemText>
              <NavDropdown.Item href='/hsk/3/table'>Все слова</NavDropdown.Item>
              <NavDropdown.Item href='/hsk/3/tests'>Тесты</NavDropdown.Item>
              <NavDropdown.Item href='/hsk/3/search'>Поиск</NavDropdown.Item>{" "}
            </NavDropdown>
            <NavDropdown title='Словарь'>
              <NavDropdown.Item href='/search'>Словарь</NavDropdown.Item>
              <NavDropdown.Item href='/translate'>Pop-up перевод</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href='/feedback'>Гостевая</Nav.Link>
            <Nav.Link href='#'>{user.name}</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
