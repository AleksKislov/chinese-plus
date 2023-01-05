import Image from "next/image";
import Link from "next/link";
import SellPoints from "../components/landing/points";
import landingBg from "../assets/img/land-bg.jpg";

export default function HomePage() {
  return (
    <>
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
        quality={50}
        alt='Иероглифы'
      />
      <div className='container'>
        <div className='row my-5'>
          <div className='col-md-12 text-center'>
            <h2 className='LandingWhiteTxt'>Клуб Chinese+</h2>
            <p className='lead LandingWhiteTxt'>Приложение для изучения китайского языка</p>
            <div className='buttons'>
              <Link href='/register' className='btn btn-dark mx-1'>
                Регистрация
              </Link>
              <Link href='/login' className='btn btn-light mx-1'>
                Войти
              </Link>
            </div>
          </div>
        </div>

        <SellPoints />

        <div className='row my-5'>
          <div className='col-12 d-flex justify-content-center'>
            <div className='embed-responsive embed-responsive-16by9' style={{ maxWidth: "50rem" }}>
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
        </div>

        {/* <div className='row mb-5'>
          <div className='col-sm-6 LandingWhiteTxt mb-3'>
            <CommentsCard />
          </div>
          <div className='col-sm-6'>
            <h4 className='LandingWhiteTxt'>Последние записи в Гостевой:</h4>

            {posts.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </div>
        </div> */}
      </div>
    </>
  );
}

// async function getSmth(): Promise<Object> {
//   const res = await fetch("http://127.0.0.1:5000/api/notices");
//   const data = await res.json();
//   return data;
// }
