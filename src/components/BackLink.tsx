import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ArrowLeftIcon } from './Icons';

interface BackLinkProps {
  to: string;
  children: ReactNode;
}

export default function BackLink({ to, children }: BackLinkProps) {
  return (
    <Link to={to} className="back-link small d-inline-flex align-items-center gap-1 mb-3">
      <ArrowLeftIcon className="back-link-icon" aria-hidden="true" />
      {children}
    </Link>
  );
}
