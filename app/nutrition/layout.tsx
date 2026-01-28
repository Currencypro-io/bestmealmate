import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nutrition Dashboard - BestMealMate",
  description: "Track your daily calories, protein, carbs, and fat. Get weekly nutrition insights based on your meal plan.",
  openGraph: {
    title: "Nutrition Dashboard - BestMealMate",
    description: "Track macros and nutrition for your meal plans.",
  },
};

export default function NutritionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
