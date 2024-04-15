// "use client";

import { notFound } from "next/navigation";
import SyntaxHighlighter from "react-syntax-hightligther";

type PostPageProps = {
  params: {
    id: string;
  };
};

export default async function PostPage({ params }: PostPageProps) {
  const response = await fetch(`https://dummyjson.com/posts/${params.id}`);
  const data = await response.json();

  if (!postMessage.title) {
    return notFound();
  }

  return (
    <main className="px-7 pt-24 text-center">
      <h1 className="text-5xl font-semibold mb-7">{data.title}</h1>
      <p className="max-w-[700px] mx-auto">{data.body}</p>

      <SyntaxHighlighter className="text-left">
        {`function() { return "Hello world!"; }`}
      </SyntaxHighlighter>
    </main>
  );
}
