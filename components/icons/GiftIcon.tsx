import React from 'react';

// FIX: Update the component props to explicitly include `title` and render a
// <title> element within the SVG for accessibility. This resolves the type
// error when passing a `title` prop in JoinEventPage.tsx.
const GiftIcon: React.FC<React.SVGProps<SVGSVGElement> & { title?: string }> = ({ title, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    {title && <title>{title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5H3v10.5a1.5 1.5 0 001.5 1.5h15a1.5 1.5 0 001.5-1.5V7.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5V7.5m0-4.5c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3z" />
  </svg>
);

export default GiftIcon;
