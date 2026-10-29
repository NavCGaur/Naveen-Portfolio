import Nav from "@/components/layout/Nav";
import Hero from "@/components/sections/Hero";
import Problems from "@/components/sections/Problems";
import Services from "@/components/sections/Services";
import ProcessBanner from "@/components/sections/ProcessBanner";
import WhyMe from "@/components/sections/WhyMe";
import Projects from "@/components/sections/Projects";
import SeoResults from "@/components/sections/SeoResults";
import Testimonials from "@/components/sections/Testimonials";
import UpworkStats from "@/components/sections/UpworkStats";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <UpworkStats />
        <Problems />
        <Projects />
        <SeoResults />
        <Testimonials />
        <WhyMe />
        <Services />
        <ProcessBanner />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
