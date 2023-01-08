import Image from "next/image";
import Link from "next/link";
import SellPoints from "../src/components/landing/points";
import landingBg from "../public/img/land-bg.jpg";
import CommentsCard from "../src/components/dashboard/comments-card";
import PostsCard from "../src/components/landing/posts-card";

export default function HomePage() {
  return (
    <div>
      <div className='bgwrap'>
        <Image
          src={landingBg}
          fill
          style={{
            zIndex: -1,
            opacity: 0.3,
            backgroundColor: "black",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          quality={80}
          alt='Иероглифы'
        />
      </div>
      <div>
        <div className='row my-5'>
          <div className='col-12 text-center'>
            <h2 className='LandingWhiteTxt'>Клуб Chinese+</h2>
            <p className='lead LandingWhiteTxt'>Приложение для изучения китайского языка</p>
            <div className='buttons'>
              <Link href='/auth/register' className='btn btn-dark mx-1'>
                Регистрация
              </Link>
              <Link href='/auth/login' className='btn btn-light mx-1'>
                Войти
              </Link>
            </div>
          </div>
        </div>

        <SellPoints />

        <div className='row my-5'>
          <div className='col-sm-1'></div>
          <div className='col-sm-10'>
            <div className='ratio ratio-16x9'>
              <iframe
                className='embed-responsive-item'
                width='560'
                height='315'
                src='https://www.youtube.com/embed/fxM8lH17fUY'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              ></iframe>
            </div>
          </div>
          <div className='col-sm-1'></div>
        </div>

        <div className='row mb-5'>
          <div className='col-sm-6 mb-3'>
            {/* @ts-expect-error Server Component */}
            <CommentsCard />
          </div>
          <div className='col-sm-6'>
            {/* @ts-expect-error Server Component */}
            <PostsCard />
          </div>
        </div>
      </div>
    </div>
  );
}

// async function getSmth(): Promise<Object> {
//   const res = await fetch("http://127.0.0.1:5000/api/notices");
//   const data = await res.json();
//   return data;
// }
