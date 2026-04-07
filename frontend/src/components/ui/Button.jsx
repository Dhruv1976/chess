import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 tracking-wide flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 focus:ring-offset-white',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 focus:ring-offset-white border border-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 focus:ring-offset-white',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 focus:ring-offset-white',
    success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 focus:ring-offset-white',
    outline: 'border-2 border-blue-500 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 focus:ring-offset-white',
  };

  const sizes = {
    sm: 'px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm',
    md: 'px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base',
    lg: 'px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg',
  };

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${widthStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
