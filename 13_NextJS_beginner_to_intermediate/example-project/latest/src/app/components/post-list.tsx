import Link from "next/link";
import prisma from "@/lib/db";

// type PostsListProps = {
//   posts: Post[];
// };

// export default function PostsList({ posts }: PostsListProps) {
export default async function PostsList() {
  // MOVED HERE
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const posts = await prisma.post.findMany();
  // MOVED HERE

  return (
    <>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="max-w-[400px] mb-3 mx-auto]">
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
