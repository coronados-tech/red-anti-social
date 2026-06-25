import { Link, NavLink } from "react-router-dom";
import { Container, Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import ProfileAvatar from "./ProfileAvatar";
import UserSearch from "./UserSearch";
import { userProfilePath } from "../utils/userProfile";

export default function AppNavbar() {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <Navbar expand="md" fixed="top" className="navbar-coronados" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-mono">
          Anti-Social <span className="text-accent">Net</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <NavLink to="/" className={linkClass} end>
              Inicio
            </NavLink>
          </Nav>
          <UserSearch />
          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>
          <NavLink to="/registro" className={linkClass}>
            Registro
          </NavLink>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
