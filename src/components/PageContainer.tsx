import { Container } from 'react-bootstrap';
import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  fill?: boolean;
}

export default function PageContainer({ children, className = '', fill = false }: PageContainerProps) {
  const classes = ['page-container', fill && 'page-container--fill', className]
    .filter(Boolean)
    .join(' ');

  return <Container className={classes}>{children}</Container>;
}
