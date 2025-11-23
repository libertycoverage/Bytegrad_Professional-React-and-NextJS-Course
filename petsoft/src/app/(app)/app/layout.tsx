import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import BackgroundPattern from "@/components/background-pattern";
import { Toaster } from "@/components/ui/sonner";
import PetContextProvider from "@/contexts/pet-context-provider";
import SearchContextProvider from "@/contexts/search-context-provider";
//import { Pet } from "@/lib/types";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth"; //V357
import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/server-utils"; //V363

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // // V280 fetching moved to layout.tsx here from `petsoft/src/app/(app)/app/dashboard/page.tsx` so it can be used by <PetContextProvider /> component passed there as a prop
  // const response = await fetch(
  //   "https://bytegrad.com/course-assets/projects/petsoft/api/pets"
  // );
  // if (!response.ok) {
  //   throw new Error("Could not fetch pets");
  // }
  // const data: Pet[] = await response.json();

  // console.log(data);
  // const session = await auth(); //V357
  // if (!session?.user) {
  //   redirect("/login");
  // } //V357
  const session = await checkAuth(); //V363

  console.log(session.user); //V358

  const pets = await prisma.pet.findMany({
    where: {
      userId: session.user.id,
    },
  }); //V357
  console.log(pets.length);

  return (
    <>
      <BackgroundPattern />

      <div className="flex flex-col max-w-[1050px] mx-auto px-4 min-h-screen">
        <AppHeader />

        <SearchContextProvider>
          {/* V289 */}
          <PetContextProvider data={pets}>{children}</PetContextProvider>
        </SearchContextProvider>

        <AppFooter />
      </div>

      <Toaster position="top-right" />
    </>
  );
}
