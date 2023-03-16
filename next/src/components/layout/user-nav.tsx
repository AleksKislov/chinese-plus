"use client";
import Image from "next/image";
import NavDropdown from "react-bootstrap/NavDropdown";
import { removeCookie } from "../../context/auth/cookie-manager";
import { User } from "../../context/auth/store";
import { useRouter } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

export default function UserNav({ userFromBE }: { userFromBE: UserFromBE | null }) {
  const router = useRouter();
  let user: User | null = null;
  if (userFromBE) user = new User(userFromBE);

  const logout = () => {
    removeCookie("token");
    router.refresh();
  };

  const unAuthorithed = (
    <NavDropdown title={<FontAwesomeIcon icon={faRightToBracket} />}>
      <NavDropdown.Item href='/auth/login'>Войти</NavDropdown.Item>
      <NavDropdown.Item href='/auth/register'>Регистрация</NavDropdown.Item>
    </NavDropdown>
  );

  return !user ? (
    unAuthorithed
  ) : (
    <NavDropdown
      placement={"auto"}
      title={
        <Image
          loader={() => user!.avatarPic}
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
