import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Container, Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import ProfileAvatar from './ProfileAvatar';
import UserSearch from './UserSearch';
import { userProfilePath } from '../utils/userProfile';

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const closeMenu = () => setExpanded(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'nav-link active' : 'nav-link';

  return (
    <Navbar
      expand="md"
      fixed="top"
      className="navbar-main"
      variant="dark"
      expanded={expanded}
      onToggle={setExpanded}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-mono" onClick={closeMenu}>
          Anti-Social <span className="text-accent">Net</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <NavLink to="/" className={linkClass} end onClick={closeMenu}>
              Inicio
            </NavLink>
            <NavLink to="/nosotros" className={linkClass} onClick={closeMenu}>
              Nosotros
            </NavLink>
            <NavLink to="/contacto" className={linkClass} onClick={closeMenu}>
              Contacto
            </NavLink>
          </Nav>
          <UserSearch onNavigate={closeMenu} />
          <Nav className="navbar-actions-nav align-items-md-center gap-2">
            {user && (
              <Button
                as={NavLink}
                to="/nuevo-post"
                variant="accent"
                size="sm"
                className="navbar-create-post-btn"
                onClick={closeMenu}
              >
                ¿Qué pensás?
              </Button>
            )}
            {user ? (
              <>
                <NavDropdown
                  id="user-profile-menu"
                  align="end"
                  className="navbar-user-menu"
                  title={
                    <span className="navbar-user-menu-toggle d-flex align-items-center gap-2">
                      <ProfileAvatar user={user} size="sm" />
                      <span className="navbar-user-menu-nickname">@{user.nickname}</span>
                    </span>
                  }
                >
                  <NavDropdown.Item
                    as={NavLink}
                    to="/perfil"
                    className="navbar-user-menu-item"
                    onClick={closeMenu}
                  >
                    Editar perfil
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={NavLink}
                    to={userProfilePath(user.nickname)}
                    end
                    className="navbar-user-menu-item"
                    onClick={closeMenu}
                  >
                    Ver perfil
                  </NavDropdown.Item>
                </NavDropdown>
                <Button
                  variant="outline-accent"
                  size="sm"
                  onClick={() => {
                    closeMenu();
                    logout();
                  }}
                >
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass} onClick={closeMenu}>
                  Login
                </NavLink>
                <NavLink to="/registro" className={linkClass} onClick={closeMenu}>
                  Registro
                </NavLink>
              </>
            )}
            <ThemeToggle />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
