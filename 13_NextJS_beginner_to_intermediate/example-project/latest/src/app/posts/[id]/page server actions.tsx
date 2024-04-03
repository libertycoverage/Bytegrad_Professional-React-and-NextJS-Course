import AddPostForm from "@/components/add-post-form";
import PostsList from "@/components/posts-list";
import prisma from "@/lib/db";
import { Suspense } from "react";

export default async function PostsPage() {
  // MOVED TO post-list.tsx
  //await new Promise((resolve) => setTimeout(resolve, 1000));
  //const posts = await prisma.post.findMany();
  // MOVED TO post-list.tsx

  return (
    <main className="text-center pt-16 px-5">
      <AddPostForm />

      <h1 className="text-5xl font-semibold mb-7">All posts</h1>

      {/* <PostsList posts={posts} /> */}

      {/* <PostsList /> */}

      <Suspense fallback="Loading...">
        <PostsList />
      </Suspense>
    </main>
  );
}
