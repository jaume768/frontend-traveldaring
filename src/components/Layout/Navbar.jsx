import { FaSearch, FaSignOutAlt } from 'react-icons/fa';
import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './css/Navbar.css';

const Navbar = () => {
  const { authState, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !authState.loading && Boolean(authState.token);
  const isDemo = Boolean(authState.user?.isDemo);
  const brandLink = isLoggedIn ? '/dashboard' : '/';

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cierra el menú móvil al navegar.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery.length >= 3) {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''} ${isMenuOpen ? 'navbar--open' : ''}`}>
      <div className="navbar-inner">
        <Link to={brandLink} className="navbar-brand">
          <img src="/images/TD.png" alt="Logo TravelDaring" className="navbar-logo" />
          <span className="navbar-wordmark">
            Travel<strong>Daring</strong>
          </span>
        </Link>

        <form onSubmit={handleSearch} className="navbar-search" role="search">
          <FaSearch className="search-icon" aria-hidden="true" />
          <input
            type="search"
            placeholder="Buscar itinerarios..."
            aria-label="Buscar itinerarios"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <button
          type="button"
          className="menu-icon"
          aria-label="Abrir menú"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="navbar-links">
          <NavLink to="/suggested">Sugeridos</NavLink>
          {isLoggedIn ? (
            <>
              <NavLink to="/dashboard">Mis viajes</NavLink>
              <NavLink to="/profile">Perfil</NavLink>
              {isDemo && <span className="badge badge--demo">Demo</span>}
              <Link to="/trips/create" className="btn-primary navbar-cta">
                Crear viaje
              </Link>
              <button type="button" className="navbar-logout" onClick={handleLogout} title="Cerrar sesión" aria-label="Cerrar sesión">
                <FaSignOutAlt />
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary navbar-cta">
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
