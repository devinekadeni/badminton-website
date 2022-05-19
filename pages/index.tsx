import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Dudun Badminton Club</title>
        <meta name="description" content="Dudun Badminton Club" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header />
        <div className="flex justify-center items-center h-screen">
          <h1 className="font-bold text-5xl">Welcome To Dudun Badminton Club</h1>
        </div>
      </main>
    </div>
  )
}

export default Home
