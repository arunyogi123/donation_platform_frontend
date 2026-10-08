import React from 'react';
import { Link } from '../../router';
import { GiveHopeLogo } from '../brand/GiveHopeLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1C1917] text-[#D6D3D1] border-t border-[#292524] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              <GiveHopeLogo variant="light" size="md" />
            </Link>

            <p className="text-xs text-[#A8A29E] leading-relaxed">
              Small acts. Real impact. A transparent donation and community fundraising platform
              directing emergency aid, medical support, and educational infrastructure to those who
              need it most.
            </p>
            <div className="text-xs text-[#78716C] pt-2">
              <span>Verified DRF Integration Architecture</span>
            </div>
          </div>

          {/* Col 2: Discover */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#E7E5E4]">
              Discover
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/campaigns" className="hover:text-white transition-colors">
                  Campaigns
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/categories/HEALTH" className="hover:text-white transition-colors">
                  Health Causes
                </Link>
              </li>
              <li>
                <Link href="/categories/EDUCATION" className="hover:text-white transition-colors">
                  Education Projects
                </Link>
              </li>
              <li>
                <Link href="/categories/NATURAL%20DISASTER" className="hover:text-white transition-colors">
                  Natural Disaster Relief
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#E7E5E4]">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About GiveHope
                </Link>
              </li>
              <li>
                <Link href="/start-a-campaign" className="hover:text-white transition-colors">
                  Start a Campaign
                </Link>
              </li>
              <li>
                <Link href="/my-donations" className="hover:text-white transition-colors">
                  My Donations
                </Link>
              </li>
              <li>
                <Link href="/my-recurring-donations" className="hover:text-white transition-colors">
                  Recurring Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#E7E5E4]">
              Support & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-[#A8A29E] hover:text-white cursor-pointer transition-colors">
                  Support & Verification
                </span>
              </li>
              <li>
                <span className="text-[#A8A29E] hover:text-white cursor-pointer transition-colors">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-[#A8A29E] hover:text-white cursor-pointer transition-colors">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="text-[#A8A29E] hover:text-white cursor-pointer transition-colors">
                  Contact Platform Staff
                </span>
              </li>
            </ul>
            <div className="pt-2 text-xs text-[#78716C] leading-normal">
              Secure payments powered by Khalti Payment Gateway integration.
            </div>
          </div>
        </div>

        <div className="border-t border-[#292524] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#78716C]">
          <p>© {new Date().getFullYear()} GiveHope. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-3 sm:mt-0">
            <span>Transparent Philanthropy</span>
            <span aria-hidden="true">·</span>
            <span>Non-Profit Integrity</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
