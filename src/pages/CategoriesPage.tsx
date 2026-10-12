import React from "react";
import { Link } from "../router";
import { Activity, GraduationCap, AlertCircle, ArrowRight } from "lucide-react";

export const CategoriesPage: React.FC = () => {
  const categories = [
    {
      id: "HEALTH",
      title: "Health",
      icon: <Activity className="w-6 h-6 text-[#0D5C3A]" />,
      description:
        "Urgent medical interventions, pediatric oncology chemotherapy, open-heart surgeries, and essential chronic medicine supplies.",
      stats: "12 Active Fundraisers",
      href: "/categories/HEALTH",
    },
    {
      id: "EDUCATION",
      title: "Education",
      icon: <GraduationCap className="w-6 h-6 text-[#0D5C3A]" />,
      description:
        "Rebuilding rural schools, funding high-school scholarships for marginalized students, and equipping digital learning labs.",
      stats: "8 Active Fundraisers",
      href: "/categories/EDUCATION",
    },
    {
      id: "NATURAL DISASTER",
      title: "Natural Disaster",
      icon: <AlertCircle className="w-6 h-6 text-[#0D5C3A]" />,
      description:
        "Immediate humanitarian aid for monsoon flood victims, landslide rehabilitation, clean drinking water logistics, and winterization shelters.",
      stats: "6 Active Fundraisers",
      href: "/categories/NATURAL%20DISASTER",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="border-b border-[#E7E5E0] pb-8 space-y-3 max-w-2xl">
        <span className="text-xs uppercase tracking-widest text-[#0D5C3A] font-semibold">
          Platform Focus
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1917]">
          Campaign Categories
        </h1>
        <p className="text-sm sm:text-base text-[#57534E] leading-relaxed">
          GiveHope focuses verified mobilization across three critical pillars
          of humanitarian welfare where financial assistance produces direct,
          measurable change.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white border border-[#E7E5E0] rounded-xl p-8 flex flex-col justify-between hover:border-[#0D5C3A] transition-all group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-[#0D5C3A]/10 flex items-center justify-center">
                {cat.icon}
              </div>
              <h2 className="font-serif text-2xl font-semibold text-[#1C1917] group-hover:text-[#0D5C3A] transition-colors">
                {cat.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                {cat.description}
              </p>
            </div>

            <div className="pt-8 mt-8 border-t border-[#F5F4F0] flex items-center justify-between">
              <span className="text-xs text-[#78716C] font-mono">
                {cat.stats}
              </span>
              <Link
                href={cat.href}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D5C3A] hover:text-[#0A472C]"
              >
                <span>View Causes</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
