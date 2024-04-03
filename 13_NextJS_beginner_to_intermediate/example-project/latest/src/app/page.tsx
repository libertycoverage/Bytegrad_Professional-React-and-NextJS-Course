export default function Home() {
  return (
    <main className="text-center pt-32 px-5">
      <h1 className="text-4xl md:text-5xl font-bold mb-5">
        Welcome to my blog
      </h1>
      {/* these classNames below come from Tailwind CSS, it is default in NextJS when you create the application */}
      <p className="max-w-[750px] mx-auto leading-8"> Lorem, ipsum</p>
    </main>
  );
}

// NextJS gives that global.css file;
// main benefit of Tailwind CSS is that you do not have to come up with a separate classNames
// putting them to global.css just like in a normal React app.
