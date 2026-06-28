import type { ReactNode } from 'react';
import BackLink from './BackLink';
import PageContainer from './PageContainer';

interface LegalPageProps {
  title: string;
  children: ReactNode;
}

export default function LegalPage({ title, children }: LegalPageProps) {
  return (
    <PageContainer>
      <BackLink to="/">Volver al inicio</BackLink>
      <h1 className="h3 mb-4">{title}</h1>
      <div className="legal-content">{children}</div>
    </PageContainer>
  );
}
