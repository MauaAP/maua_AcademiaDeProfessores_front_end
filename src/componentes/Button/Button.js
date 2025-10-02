import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false, 
  icon, 
  className = '', 
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-maua-blue to-maua-light-blue text-white hover:from-maua-light-blue hover:to-maua-blue hover:shadow-lg focus:ring-maua-blue",
    secondary: "bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 hover:shadow-lg focus:ring-gray-500",
    success: "bg-gradient-to-r from-maua-green to-maua-green-hover text-white hover:from-maua-green-hover hover:to-maua-green hover:shadow-lg focus:ring-maua-green",
    warning: "bg-gradient-to-r from-maua-orange to-maua-orange-hover text-white hover:from-maua-orange-hover hover:to-maua-orange hover:shadow-lg focus:ring-maua-orange",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-lg focus:ring-red-500",
    outline: "border-2 border-maua-blue text-maua-blue hover:bg-maua-blue hover:text-white focus:ring-maua-blue",
    ghost: "text-maua-blue hover:bg-maua-blue/10 focus:ring-maua-blue",
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg",
    xl: "px-8 py-5 text-xl",
  };
  
  const hoverEffects = disabled || loading ? "" : "hover:scale-105 active:scale-95";
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${hoverEffects} ${className}`;
  
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Carregando...</span>
        </div>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;

// Botões específicos para diferentes ações
export const PrimaryButton = (props) => <Button variant="primary" {...props} />;
export const SuccessButton = (props) => <Button variant="success" {...props} />;
export const WarningButton = (props) => <Button variant="warning" {...props} />;
export const DangerButton = (props) => <Button variant="danger" {...props} />;
export const OutlineButton = (props) => <Button variant="outline" {...props} />;
export const GhostButton = (props) => <Button variant="ghost" {...props} />;
