import { Button } from "react-bootstrap";
import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline-light"
      size="sm"
      onClick={toggleTheme}
      className="ms-2"
      title={`Cambiar a tema ${theme === "light" ? "oscuro" : "claro"}`}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </Button>
  );
}
