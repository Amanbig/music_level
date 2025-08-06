import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'glass' | 'gradient';
}

export const Card: React.FC<CardProps> = ({ children, className = '', variant = 'default' }) => {
  const variantClasses = {
    default: 'bg-card border border-border shadow-sm hover:shadow-md dark:shadow-lg/10 dark:hover:shadow-lg/20',
    elevated: 'bg-card border border-border shadow-lg hover:shadow-xl dark:shadow-lg/20 dark:hover:shadow-xl/30',
    glass: 'bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg dark:bg-card/60 dark:border-border/30',
    gradient: 'bg-gradient-to-br from-card to-muted border border-border shadow-lg dark:from-card dark:to-muted/50'
  };

  return (
    <div className={`rounded-xl transition-all duration-300 ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-5 border-b border-border ${className}`}>
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
    <h3 className={`text-xl font-bold text-card-foreground tracking-tight ${className}`}>
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <p className={`text-sm text-muted-foreground mt-1.5 ${className}`}>
      {children}
    </p>
  );
};