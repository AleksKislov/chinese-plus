import Link from "next/link";

export default function UndecLink({ href, txt }: { href: string; txt: string }) {
  return (
    <Link href={href} className='text-decoration-none'>
      {txt}
    </Link>
  );
}
