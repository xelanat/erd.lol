import Head from 'next/head'
import Link from 'next/link'

const LandingPage = () => (
  <div>
    <Head>
      <title>MermaidJS Diagram Tool</title>
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" sizes="any" />
    </Head>

    <main className="patterned-background h-screen">
      <section className="bg-white p-12 w-25 h-25">
        <h1 className="text-3xl text-black font-extrabold">erd.lol</h1>
        <div className="my-4 text-black font-bold">Create ERD diagrams with ease 🤭</div>
        <div className="mb-4 text-black font-bold">Built on MermaidJS.</div>
        <Link
          className="bg-black p-2 rounded text-white transition duration-200 border-2 hover:border-black hover:border-dotted hover:bg-white hover:text-black font-bold"
          href="./chart"
        >
          Diagram Away 🪄
        </Link>
      </section>
      <section className="p-12"></section>
    </main>
    <footer className="text-center p-4">© 2024 Alex Tan. All rights reserved.</footer>
  </div>
)

export default LandingPage
