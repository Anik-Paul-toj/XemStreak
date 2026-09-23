import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  style,
  ...props
}) => {
  let baseClass = 'xem-button-primary';
  if (variant === 'secondary') baseClass = 'xem-button-secondary';
  if (variant === 'tertiary') baseClass = 'xem-button-tertiary';

  const sizeStyles: React.CSSProperties = 
    size === 'lg' ? { height: '56px', fontSize: '16px', padding: '14px 28px' } :
    size === 'sm' ? { height: '36px', fontSize: '13px', padding: '6px 14px' } :
    { height: '46px', fontSize: '14px', padding: '10px 20px' };

  return (
    <button
      className={`${baseClass} ${className}`}
      style={{ ...sizeStyles, ...style }}
      {...props}
    >
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
