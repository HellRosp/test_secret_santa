
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', ...props }) => {
  const baseClasses = 'w-full font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5';
  
  const variantClasses = {
    primary: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300 shadow-md hover:shadow-lg',
    secondary: 'bg-slate-200 text-slate-700 hover:bg-slate-300 focus:ring-slate-300'
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
