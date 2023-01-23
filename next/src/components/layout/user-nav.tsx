"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import NavDropdown from "react-bootstrap/NavDropdown";
import { loadUser } from "../../context/auth/actions";
import { NullUser, useAuthCtx, User } from "../../context/auth/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

export default function UserNav() {
  const router = useRouter();
  const { user, setLoggedIn, setUser, loggedIn } = useAuthCtx();

  useEffect(() => {
    if (loggedIn) return;
    setTimeout(async () => {
      try {
        const user = await loadUser(localStorage.token);
        if (!user) throw new Error("not authorized");
        setLoggedIn(true);
        setUser(new User(user));
      } catch (err) {
        console.log(err);
        setLoggedIn(false);
        setUser(new NullUser());
      }
    });
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setUser(new NullUser());
    router.push("/");
  };

  const unAuthorithed = (
    <NavDropdown title={<FontAwesomeIcon icon={faRightToBracket} />}>
      <NavDropdown.Item href='/auth/login'>Войти</NavDropdown.Item>
      <NavDropdown.Item href='/auth/register'>Регистрация</NavDropdown.Item>
    </NavDropdown>
  );

  return user.isNull ? (
    unAuthorithed
  ) : (
    <NavDropdown
      placement={"auto"}
      title={
        <Image
          src={user.avatarPic}
          height={30}
          width={30}
          quality={80}
          alt='avatar'
          className='rounded'
        />
      }
    >
      <NavDropdown.Item href='/read/texts'>Тексты</NavDropdown.Item>
      <NavDropdown.Item href='/read/not_approved_texts'>На проверке</NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item href='#' onClick={logout}>
        Выход <FontAwesomeIcon icon={faSignOutAlt} />
      </NavDropdown.Item>
    </NavDropdown>
  );
}
