import { Button } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';
import { MoonIcon, SunIcon } from './Icons';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline-accent"
      size="sm"
      className="theme-toggle ms-lg-2"
      onClick={toggleTheme}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {isDark ? (
        <SunIcon className="theme-toggle-icon" />
      ) : (
        <MoonIcon className="theme-toggle-icon" />
      )}
    </Button>
  );
}
