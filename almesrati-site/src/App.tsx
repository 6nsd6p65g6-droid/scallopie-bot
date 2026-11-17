import { useEffect } from "react";
import { Calculator } from "./components/site/calculator";
import { Catalog } from "./components/site/catalog";
import { Deck } from "./components/site/deck";
import { setupReveal } from "./components/site/fx";
import { Hero } from "./components/site/hero";
import { Ideas } from "./components/site/ideas";
import { Looks } from "./components/site/looks";
import { ModernSurface } from "./components/site/modern/ModernSurface";
import { NewArrivals } from "./components/site/news";
import { RequestDrawer, RequestProvider } from "./components/site/request";
import { Samples } from "./components/site/samples";
import { Contact, Footer, Header, Steps, TabBar } from "./components/site/sections";
import { Videos } from "./components/site/videos";

export function App() {
  useEffect(() => {
    document.documentElement.classList.add("js");
    return setupReveal();
  }, []);

  return (
    <RequestProvider>
      <div className="site">
        <a href="#looks" className="skip">
          تخطَّ إلى التصاميم
        </a>
        <Header />
        <main>
          <Hero />
          <NewArrivals />
          <ModernSurface />
          <Deck />
          <Looks />
          <Ideas />
          <Samples />
          <Videos />
          <Catalog />
          <Calculator />
          <Steps />
          <Contact />
        </main>
        <Footer />
      </div>
      <TabBar />
      <RequestDrawer />
    </RequestProvider>
  );
}
