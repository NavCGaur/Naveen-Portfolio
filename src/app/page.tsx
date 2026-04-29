import Nav from "@/components/layout/Nav";
import Hero from "@/components/sections/Hero";
import Problems from "@/components/sections/Problems";
import Services from "@/components/sections/Services";
import WhyMe from "@/components/sections/WhyMe";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problems />
        <Services />
        <WhyMe />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
