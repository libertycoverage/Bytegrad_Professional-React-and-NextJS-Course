import BrandingMessage from "@/components/branding-message";
//import H1 from "@/components/h1"; // removed due to refactoring to BrandingMessage
import Stats from "@/components/stats";
import SearchForm from "@/components/search-form";
import ContentBlock from "@/components/content-block";
import PetList from "@/components/pet-list";
import PetDetails from "@/components/pet-details";

export default function DashboardPage() {
  return (
    <main>
      <div className="flex items-center justify-between text-white py-8">
        <BrandingMessage />

        <Stats />
      </div>

      <div className="grid grid-cols-3 grid-rows-[45px_1fr] gap-4 h-[600px]">
        <div className="row-start-1 row-span-1 col-start-1 col-span-1">
          <SearchForm />
        </div>

        <div className="row-start-2 row-span-full col-start-1 col-span-1">
          <ContentBlock>
            <PetList />
          </ContentBlock>
        </div>

        <div className="row-start-1 row-span-full col-start-2 col-span-full">
          <ContentBlock>
            <PetDetails />
          </ContentBlock>
        </div>
      </div>
    </main>
  );
}
