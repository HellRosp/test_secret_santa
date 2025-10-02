
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

// FIX: Wrap the Card component with `React.forwardRef` to allow a ref to be passed
// down to the underlying `div` element. This is required by the Modal component,
// which needs a reference to its DOM node, and resolves the TypeScript error
// indicating that the 'ref' property does not exist on `CardProps`.
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '' }, ref) => {
    return (
      <div ref={ref} className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
        <div className="p-6 sm:p-8">
          {children}
        </div>
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;