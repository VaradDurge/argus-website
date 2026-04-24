import HeroSection from "./components/HeroSection";
import DemoSection from "./components/DemoSection";
import FAQSection from "./components/FAQSection";
import { MinimalFooter } from "@/components/ui/minimal-footer";

export default function Home() {
  return (
    <main className="relative isolate">
      <HeroSection />
      <DemoSection />
      <FAQSection />
      <MinimalFooter />
    </main>
  );
}
