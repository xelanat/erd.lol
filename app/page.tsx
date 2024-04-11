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
        <div className="my-4 border-2 border-transparent text-black font-bold">Create entity-relationship diagrams with ease 🤭.</div>
        <div className="mb-4 border-2 border-transparent text-black font-bold">
          Built with&nbsp;
            <Link
            className="duration-200 text-purple-600 hover:text-purple-500"
            href="https://mermaid.js.org/"
          >
            MermaidJS
          </Link>
          .
        </div>
        <Link
          className="bg-black p-2 rounded text-white transition duration-200 border-2 hover:border-black hover:bg-white hover:text-black font-bold"
          href="./make"
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
