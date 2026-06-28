import { AlertTriangleIcon } from './Icons';

interface ReportPostButtonProps {
  onClick: () => void;
  className?: string;
}

export default function ReportPostButton({ onClick, className = '' }: ReportPostButtonProps) {
  return (
    <button
      type="button"
      className={`post-report-btn ${className}`.trim()}
      onClick={onClick}
      aria-label="Reportar publicación"
      title="Reportar publicación"
    >
      <AlertTriangleIcon className="post-report-btn-icon" />
    </button>
  );
}
