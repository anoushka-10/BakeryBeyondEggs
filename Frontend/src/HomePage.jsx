import React from "react";
import CategoriesPage from "./CategoriesPage";
import About from "./About"; // Or any other component you want with it
import FounderSection from "./FounderSection";
import Contact from "./Contact";
import Carousel from "./Carousel";

function HomePage() {
  return (
    <>
      <Carousel/>
      <CategoriesPage />
      <About />
      <FounderSection/>
      <Contact/>
    </>
  );
}

export default HomePage;
