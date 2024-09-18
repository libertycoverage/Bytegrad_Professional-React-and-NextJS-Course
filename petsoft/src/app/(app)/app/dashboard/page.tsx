import BrandingMessage from "@/components/branding-message";
//import H1 from "@/components/h1"; // removed due to refactoring to BrandingMessage
import Stats from "@/components/stats";

export default function DashboardPage() {
  return (
    <div className="flex items-center justify-between text-white py-8">
      <BrandingMessage />

      <Stats />
    </div>
  );
}
