import React from 'react';

interface GiveHopeLogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
  className?: string;
}

export const GiveHopeLogo: React.FC<GiveHopeLogoProps> = ({
  variant = 'dark',
  size = 'md',
  iconOnly = false,
  className = '',
}) => {
  const iconSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }[size];

  const textClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  }[size];

  const isLight = variant === 'light';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon SVG Emblem: stylized heart embracing an uplifted hope sprout */}
      <svg
        className={`${iconSizeClasses} shrink-0 transition-transform hover:scale-105 duration-200`}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="40" height="40" rx="10" fill={isLight ? '#0F764C' : '#0D5C3A'} />
        {/* Subtle inner gradient badge */}
        <path
          d="M20 7C14.477 7 10 11.477 10 17C10 23.5 17.5 29.5 20 32C22.5 29.5 30 23.5 30 17C30 11.477 25.523 7 20 7Z"
          fill="white"
          fillOpacity="0.15"
        />
        {/* Stylized Heart Curves */}
        <path
          d="M20 30.5C18.2 28.7 12 23.3 12 17.5C12 13.35 15.35 10 19.5 10C20.4 10 21.3 10.2 22 10.6C22.7 10.2 23.6 10 24.5 10C28.65 10 32 13.35 32 17.5C32 23.3 25.8 28.7 24 30.5L20 30.5Z"
          fill="none"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Hope Sprout / Helping Leaf Stem */}
        <path
          d="M20 25V15M20 15C20 15 22 13 24 13.5C25.5 13.8 26 15.5 24.5 16.5C23 17.5 20 18 20 18M20 18C20 18 18 16.5 16.5 17C15 17.5 15 19.5 16.5 20C18 20.5 20 20 20 20"
          stroke="#FCD34D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {!iconOnly && (
        <span className={`font-serif font-bold tracking-tight ${textClasses}`}>
          <span className={isLight ? 'text-white' : 'text-[#1C1917]'}>Give</span>
          <span className="text-[#0D5C3A] font-semibold">Hope</span>
        </span>
      )}
    </div>
  );
};
