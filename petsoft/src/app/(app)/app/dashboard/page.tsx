import BrandingMessage from "@/components/branding-message";
//import H1 from "@/components/h1"; // removed due to refactoring to BrandingMessage
import Stats from "@/components/stats";
import SearchForm from "@/components/search-form";
import ContentBlock from "@/components/content-block";
import PetList from "@/components/pet-list";
import PetDetails from "@/components/pet-details";
import PetButton from "@/components/pet-button";

export default async function DashboardPage() {
  // const response = await fetch(
  //   "https://bytegrad.com/course-assets/projects/petsoft/api/pets"
  // );
  // if (!response.ok) {
  //   throw new Error("Could not fetch pets");
  // }
  // const data = await response.json();

  // console.log(data);
  // V280 fetching moved to nested layout `petsoft/src/app/(app)/app/layout.tsx` so it can be used by <PetContextProvider /> component passed there as a prop

  // V289
  // If we want to put the state in here with `useState()`, we need to make this a client component,
  // because only these client components can use this React hooks, at least for now.
  // we do not want to add `useState()` here.

  return (
    <main>
      <div className="flex items-center justify-between text-white py-8">
        <BrandingMessage />

        <Stats />
      </div>

      <div className="grid md:grid-cols-3 md:grid-rows-[45px_1fr] grid-rows-[45px_300px_500px] gap-4 md:h-[600px]">
        <div className="md:row-start-1 md:row-span-1 md:col-start-1 md:col-span-1">
          <SearchForm />
        </div>

        <div className="relative md:row-start-2 md:row-span-full md:col-start-1 md:col-span-1">
          <ContentBlock>
            {/* <PetList pets={data} /> */}
            {/* V280 prop 'data' accepted as `pets` removed for usage of Context API Provider component pet-context-provider.tsx */}
            <PetList />

            <div className="absolute bottom-4 right-4">
              <PetButton actionType="add" />
            </div>
          </ContentBlock>
        </div>

        <div className="md:row-start-1 md:row-span-full md:col-start-2 md:col-span-full">
          <ContentBlock>
            <PetDetails />
          </ContentBlock>
        </div>
      </div>
    </main>
  );
}
