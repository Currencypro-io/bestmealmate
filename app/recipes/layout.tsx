import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recipe Library - BestMealMate",
  description: "Browse 200+ family-friendly recipes. Search, filter by dietary needs, and create your own custom recipes.",
  openGraph: {
    title: "Recipe Library - BestMealMate",
    description: "Browse 200+ family-friendly recipes with search and filters.",
  },
};

export default function RecipesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
