import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Chef - BestMealMate",
  description: "Your personal AI cooking assistant. Get recipe guidance, meal suggestions, and cooking tips through voice or text chat.",
  openGraph: {
    title: "AI Chef - BestMealMate",
    description: "Your personal AI cooking assistant with voice support.",
  },
};

export default function ChefLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
