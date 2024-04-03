import PostsList from "@/components/posts-list";

//export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const randomNumber = Math.floor(Math.random() * 10) + 1; // to explain server caches in Next.js

  // const response = await fetch(`https://dummyjson.com/posts?limit=3`);
  const response = await fetch(
    `https://dummyjson.com/posts?limit=${randomNumber}`,
    // {
    //   cache: "no-cache",
    // }
    {
      next: {
        revalidate: 3600,
      },
    }
  ); // to explain server caches in Next.js we added randomNumber
  const data = await response.json();

  return (
    <main className="text-center pt-16 px-5">
      <h1 className="text-5xl font-semibold mb-7">All posts</h1>
      <PostsList posts={data.posts} />
    </main>
  );
}
