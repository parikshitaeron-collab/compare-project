"use client";

import AiRecommendationSection from "@/components/specduel/AiRecommendationSection";
import BrandsSection from "@/components/specduel/BrandsSection";
import BudgetSection from "@/components/specduel/BudgetSection";
import { CatalogFiltersProvider } from "@/components/specduel/catalog-filters-context";
import CompareWorkflow from "@/components/specduel/CompareWorkflow";
import FeaturedSection from "@/components/specduel/FeaturedSection";
import FeaturesSection from "@/components/specduel/FeaturesSection";
import Hero from "@/components/specduel/Hero";
import Navbar from "@/components/specduel/Navbar";
import OrDivider from "@/components/specduel/OrDivider";
import SiteFooter from "@/components/specduel/SiteFooter";

export default function HomePageClient() {
  return (
    <>
      <div className="bg-scene" />
      <div id="app">
        <CatalogFiltersProvider>
          <Navbar />
          <Hero />
          <BrandsSection />
          <FeaturesSection />
          <BudgetSection />
          <AiRecommendationSection />
          <OrDivider />
          <FeaturedSection />
          <CompareWorkflow />
          <SiteFooter />
        </CatalogFiltersProvider>
      </div>
    </>
  );
}
