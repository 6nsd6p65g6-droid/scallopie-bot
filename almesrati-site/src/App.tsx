import { useEffect } from "react";
import { Calculator } from "./components/site/calculator";
import { Catalog } from "./components/site/catalog";
import { setupReveal } from "./components/site/fx";
import { Hero } from "./components/site/hero";
import { Looks } from "./components/site/looks";
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
          <Looks />
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
