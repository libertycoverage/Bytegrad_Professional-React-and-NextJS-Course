import BrandingMessage from "@/components/branding-message";
//import H1 from "@/components/h1"; // removed due to refactoring to BrandingMessage
import Stats from "@/components/stats";
import SearchForm from "@/components/search-form";
import ContentBlock from "@/components/content-block";
import PetList from "@/components/pet-list";
import PetDetails from "@/components/pet-details";

export default async function DashboardPage() {
  const response = await fetch(
    "https://bytegrad.com/course-assets/projects/petsoft/api/pets"
  );
  if (!response.ok) {
    throw new Error("Could not fetch pets");
  }
  const data = await response.json();

  console.log(data);

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

        <div className="md:row-start-2 md:row-span-full md:col-start-1 md:col-span-1">
          <ContentBlock>
            <PetList pets={data} />
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
