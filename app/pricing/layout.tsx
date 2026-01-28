import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - BestMealMate",
  description: "Start your 14-day free trial. Premium meal planning with AI Chef, unlimited recipes, and family sharing for $4.99/month.",
  openGraph: {
    title: "Pricing - BestMealMate",
    description: "Start your 14-day free trial. Premium features for $4.99/month.",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
