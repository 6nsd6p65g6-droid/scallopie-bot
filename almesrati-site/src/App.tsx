import { useEffect } from "react";
import { Calculator } from "./components/site/calculator";
import { Catalog } from "./components/site/catalog";
import { setupReveal } from "./components/site/fx";
import { Hero } from "./components/site/hero";
import { RequestDrawer, RequestProvider } from "./components/site/request";
import { Contact, Footer, Header, Steps } from "./components/site/sections";
import { Videos } from "./components/site/videos";

export function App() {
  useEffect(() => {
    document.documentElement.classList.add("js");
    return setupReveal();
  }, []);

  return (
    <RequestProvider>
      <div className="site">
        <a href="#catalog" className="skip">
          تخطَّ إلى الأصناف
        </a>
        <Header />
        <main>
          <Hero />
          <Videos />
          <Catalog />
          <Calculator />
          <Steps />
          <Contact />
        </main>
        <Footer />
      </div>
      <RequestDrawer />
    </RequestProvider>
  );
}
