import { revalidatePath } from "next/cache";
import SubmitBtn from "./submit-btn";
import prisma from "@/lib/db";

export default function AddPostForm() {
  const addPost = async (formData: FormData) => {
    "use server";

    //to slow down the server manually to see the change of a color of a button setting to grey while is is disabled
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await prisma.post.create({
      data: {
        title: formData.get("title") as string,
        body: formData.get("body") as string,
      },
    });

    revalidatePath("posts"); //this is optional to not to refresh after adding a new post
    // after update to the database it will re-render this route
  };

  //   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();

  //     const formData = new FormData(e.currentTarget);

  //     fetch("/api/posts", {
  //         method: "POST",
  //         body: formData,
  //     });
  //   }

  return (
    <form
      //before you had to make /api route with like
      // onSubmit={handleSubmite}
      action={addPost}
      className="flex flex-col rounded max-w-[500px] mb-10 mx-auto space-y-2"
    >
      <input
        type="text"
        name="title"
        placeholder="Title"
        className="border rounded h-10 px-3"
        required
      />
      <textarea
        name="body"
        placeholder="Body"
        className="border rounded p-3"
        rows={5}
        required
      />
      <SubmitBtn />
    </form>
  );
}
