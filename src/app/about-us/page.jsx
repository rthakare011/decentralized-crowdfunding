import AboutProject from './aboutProject';
import AboutDeveloper from './aboutDeveloper';
import PromotionalCard from '../components/promotionalCard';

const AboutUsPage = () => (
  <section id="about" className="min-h-screen w-full relative bg-white overflow-hidden scroll-mt-24">
    <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808022_1px,transparent_1px),linear-gradient(to_bottom,#80808022_1px,transparent_1px)] bg-[size:70px_70px]"></div>
    <div className="relative z-10">
      <AboutProject />
      <AboutDeveloper />
      <PromotionalCard />
    </div>
  </section>
);

export default AboutUsPage;
