import Link from "next/link";
// import { useUser } from "../lib/hooks";

const Navbar = () => {
  const user = useUser();

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link href='/'>
              <a>Home</a>
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link href='/profile'>
                  <a>Profile</a>
                </Link>
              </li>
              <li>
                <a href='/api/logout'>Logout</a>
              </li>
            </>
          ) : (
            <li>
              <Link href='/login'>
                <a>Login</a>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
