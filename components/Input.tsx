import React, { useRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, id, leftIcon, rightIcon, type, ...props }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    if (inputRef.current) {
      // The showPicker() method is the modern, standard way to programmatically open the picker UI.
      if (typeof inputRef.current.showPicker === 'function') {
        inputRef.current.showPicker();
      } else {
        // Fallback for browsers that don't support showPicker() yet.
        inputRef.current.focus();
      }
    }
  };

  const isDate = type === 'date';

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {leftIcon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{leftIcon}</div>}
        <input
          id={id}
          ref={inputRef}
          type={type}
          className={`block w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`}
          {...props}
        />
        {rightIcon && (
          <div
            // If it's a date input, make the icon clickable to open the picker.
            // Otherwise, disable pointer events so clicks pass through to the input.
            className={`absolute inset-y-0 right-0 pr-3 flex items-center ${isDate ? 'cursor-pointer' : 'pointer-events-none'}`}
            onClick={isDate ? handleIconClick : undefined}
            aria-hidden="true"
          >
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;