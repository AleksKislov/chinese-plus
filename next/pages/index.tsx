import type { NextPage } from "next";
import Head from "next/head";
// import Image from "next/image";
// import "../styles/Home.module.css";
// import "../styles/light-theme.css";
import Layout from "../components/layout/layout";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Layout>
        <p>here</p>
        <a href='/pinyin'>pinyin</a>
      </Layout>
    </>
  );
};

export default Home;
