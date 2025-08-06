import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'glass' | 'gradient';
}

export const Card: React.FC<CardProps> = ({ children, className = '', variant = 'default' }) => {
  const variantClasses = {
    default: 'bg-white border border-slate-200 shadow-sm hover:shadow-md',
    elevated: 'bg-white border border-slate-200 shadow-lg hover:shadow-xl',
    glass: 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg',
    gradient: 'bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-lg'
  };

  return (
    <div className={`rounded-xl transition-all duration-300 ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-5 border-b border-slate-100 ${className}`}>
      {children}
    </div>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-5 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <h3 className={`text-xl font-bold text-slate-900 tracking-tight ${className}`}>
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <p className={`text-sm text-slate-600 mt-1.5 ${className}`}>
      {children}
    </p>
  );
};