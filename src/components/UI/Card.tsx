import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  hoverable = false,
  padding = '20px',
  children,
  className = '',
  style,
  ...props
}) => {
  return (
    <div
      className={`xem-card ${hoverable ? 'xem-card-hover' : ''} ${className}`}
      style={{ padding, ...style }}
      {...props}
    >
      {children}
    </div>
  );
};
