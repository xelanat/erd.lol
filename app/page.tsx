import Head from 'next/head'
import Link from 'next/link'

const LandingPage = () => (
  <div>
    <Head>
      <title>MermaidJS Diagram Tool</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className="font-retro bg-retro-blue text-white">
      <section className="text-center p-12">
        <h1 className="text-3xl">MermaidJS Diagrams</h1>
        <p>Create ERD diagrams with ease.</p>
        {/* <button className="mt-4 bg-retro-pink p-2 rounded" onClick={() => }>Try It Now</button> */}
        <Link className="mt-4 bg-retro-pink p-2 rounded text-white" href="./chart">
          Try It Now
        </Link>
      </section>
      <section className="p-12 bg-retro-green"></section>
    </main>
    {/* Footer */}
    <footer className="text-center p-4 bg-retro-yellow">
        © 2024 Alex Tan. All rights reserved.
      </footer>
  </div>
)

export default LandingPage
