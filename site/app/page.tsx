import Nav from '@/components/ui/Nav';
import Hero from '@/components/sections/Hero';
import Preloader from '@/components/sections/Preloader';
import TrustMarquee from '@/components/sections/TrustMarquee';
import Services from '@/components/sections/Services';
import Work from '@/components/sections/Work';
import Process from '@/components/sections/Process';
import Impact from '@/components/sections/Impact';
import DualContinent from '@/components/sections/DualContinent';
import CTA from '@/components/sections/CTA';
import Footer from '@/components/sections/Footer';

/**
 * Pacing order (DESIGN.md §1): loud hero → quiet trust strip → loud pinned
 * services → quiet work rows → quiet process → one loud blue impact band →
 * quiet dual-continent → loud CTA → quiet footer. Never two loud sections
 * back to back.
 */
export default function Home() {
  return (
    <>
      <Preloader />
      <Nav />
      <main id="top">
        <Hero />
        <TrustMarquee />
        <Services />
        <Work />
        <Process />
        <Impact />
        <DualContinent />
        <CTA />
      </main>

      <Footer />
    </>
  );
}
