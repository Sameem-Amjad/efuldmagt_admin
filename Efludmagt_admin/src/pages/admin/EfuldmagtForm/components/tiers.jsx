"use client";

import { Card } from "@/components/ui/card";
import { Gift, Check } from "lucide-react";

export default function PricingTiers({ selectedTier, onTierSelect }) {
  const tiers = [
    {
      id: "free",
      name: "Free",
      price: "Free",
      description: "Lorem Ipsum",
      icon: <Gift className="w-6 h-6 text-blue-500" />,
    },
    {
      id: "tier1",
      name: "Tier 1",
      price: "DKK 9",
      description: "Lorem Ipsum",
    },
    {
      id: "tier3",
      name: "Tier 3",
      price: "DKK 17",
      description: "Lorem Ipsum",
    },
    {
      id: "tier5",
      name: "Tier 5",
      price: "DKK 25",
      description: "Lorem Ipsum",
    },
    {
      id: "tier7",
      name: "Tier 7",
      price: "DKK 35",
      description: "Lorem Ipsum",
    },
    {
      id: "tier10",
      name: "Tier 10",
      price: "DKK 45",
      description: "Lorem Ipsum",
    },
    {
      id: "tier12",
      name: "Tier 12",
      price: "DKK 59",
      description: "Lorem Ipsum",
    },
    {
      id: "tier14",
      name: "Tier 14",
      price: "DKK 69",
      description: "Lorem Ipsum",
    },
    {
      id: "tier16",
      name: "Tier 16",
      price: "DKK 79",
      description: "Lorem Ipsum",
    },
    {
      id: "tier18",
      name: "Tier 18",
      price: "DKK 89",
      description: "Lorem Ipsum",
    },
    {
      id: "tier20",
      name: "Tier 20",
      price: "DKK 99",
      description: "Lorem Ipsum",
    },
    {
      id: "tier30",
      name: "Tier 30",
      price: "DKK 149",
      description: "Lorem Ipsum",
    },
    {
      id: "tier40",
      name: "Tier 40",
      price: "DKK 199",
      description: "Lorem Ipsum",
    },
    {
      id: "tier50",
      name: "Tier 50",
      price: "DKK 249",
      description: "Lorem Ipsum",
    },
    {
      id: "tier60",
      name: "Tier 60",
      price: "DKK 299",
      description: "Lorem Ipsum",
    },
    {
      id: "tier80",
      name: "Tier 80",
      price: "DKK 399",
      description: "Lorem Ipsum",
    },
    {
      id: "tier100",
      name: "Tier 100",
      price: "DKK 499",
      description: "Lorem Ipsum",
    },
    {
      id: "tier120",
      name: "Tier 120",
      price: "DKK 599",
      description: "Lorem Ipsum",
    },
    {
      id: "tier140",
      name: "Tier 140",
      price: "DKK 699",
      description: "Lorem Ipsum",
    },
    {
      id: "tier160",
      name: "Tier 160",
      price: "DKK 799",
      description: "Lorem Ipsum",
    },
    {
      id: "tier200",
      name: "Tier 200",
      price: "DKK 999",
      description: "Lorem Ipsum",
    },
  ];

  return (
    <div className="space-y-8 mb-8">
      <div className="mb-8">
        <h1 className="text-lg font-semibold mb-2">
          Choose Pricing: Free or Paid Tiers
        </h1>
        <p className="text-gray-500">Lorem Ipsum</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {tiers.map((tier) => (
          <Card
            key={tier.id}
            className={`relative p-6 cursor-pointer transition-all hover:shadow-md ${
              selectedTier === tier.name
                ? "border-2 border-[#47B5FF]"
                : "border border-gray-200"
            }`}
            onClick={() => onTierSelect(tier.name)}
          >
            {selectedTier === tier.name && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#47B5FF] rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="flex flex-col items-center text-center">
              {tier.icon && (
                <div className="mb-4 p-2 bg-blue-50 rounded-lg">
                  {tier.icon}
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2">{tier.price}</h3>
              <p className="text-[#47B5FF] font-medium mb-2">{tier.name}</p>
              <p className="text-gray-500 text-sm">{tier.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
