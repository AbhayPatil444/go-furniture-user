import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../reduxStore/authSlice";
import { clearCart } from "../../reduxStore/cartSlice";
import { useEffect, useState } from "react";
import AuthModal from "../../pages/auth/authModal";

const categories = [
  { label: "Chairs", path: "/category/chairs" },
  { label: "Sofas", path: "/category/sofas" },
  { label: "Beds", path: "/category/beds" },
  { label: "Wardrobes", path: "/category/wardrobes" },
  { label: "Benches / Tables", path: "/category/benches-tables" },
];

const MobileSidebar = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [show]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    onHide();
    navigate("/");
  };

  const handleNav = (path) => {
    navigate(path);
    onHide();
  };

  const handleOpenAuth = () => {
    onHide();
    setShowAuth(true);
  };

  return (
    <>
      <AuthModal show={showAuth} onHide={() => setShowAuth(false)} />

      <div
        className={`sidebar-backdrop ${show ? "sidebar-backdrop--visible" : ""}`}
        onClick={onHide}
      />

      <aside className={`mobile-sidebar ${show ? "mobile-sidebar--open" : ""}`}>
        <div className="mobile-sidebar__header">
          <span className="brand-logo" style={{ fontSize: "1.2rem" }}>
            Go<span className="dot">-</span>Furniture
          </span>
          <button className="sidebar-close-btn" onClick={onHide} aria-label="Close menu">
            ✕
          </button>
        </div>

        <nav className="mobile-sidebar__nav">
          <p className="sidebar-section-label">Categories</p>
          {categories.map((c) => (
            <NavLink
              key={c.path}
              to={c.path}
              onClick={onHide}
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? "sidebar-nav-link--active" : ""}`
              }
            >
              {c.label}
            </NavLink>
          ))}

          <div className="sidebar-divider" />

          <p className="sidebar-section-label">Account</p>

          {isLoggedIn ? (
            <>
              <button className="sidebar-nav-link sidebar-nav-btn" onClick={() => handleNav("/orders")}>
                My Orders
              </button>
              <button className="sidebar-nav-link sidebar-nav-btn" onClick={() => handleNav("/profile")}>
                My Profile
              </button>
              <button
                className="sidebar-nav-link sidebar-nav-btn sidebar-nav-btn--danger"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="sidebar-nav-link sidebar-nav-btn" onClick={handleOpenAuth}>
                Login
              </button>
              <button className="sidebar-nav-link sidebar-nav-btn" onClick={handleOpenAuth}>
                Sign Up
              </button>
            </>
          )}
        </nav>
      </aside>
    </>
  );
};

export default MobileSidebar;