import { Container, Form, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import CartModal from "../home/CartModal";
import MobileSidebar from "./MobileSidebar";
import AuthModal from "../../pages/auth/authModal";

const Header = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useSelector((state) => state.auth);
    const cartCount = useSelector((state) => 
      state.cart.items.reduce((sum, item)=> sum + item.cartQuantity, 0)
    );

    const [query, setQuery] = useState("");
    const [showCart, setShowCart] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false); 
    const [showAuth, setShowAuth] = useState(false);

    const performSearch = () => {
        if (!query.trim()) return;
        navigate(`/search?query=${query}`);
    };

    useDebounce(performSearch, 500, [query]);

  return (
    <>
    <CartModal show={showCart} onHide={() => setShowCart(false)} />
      <MobileSidebar show={showSidebar} onHide={() => setShowSidebar(false)} />
      <AuthModal show={showAuth} onHide={() => setShowAuth(false)} />

      <header className="site-header py-3 shadow-sm bg-white">
        <Container fluid className="px-3 px-md-4">

         <div className="d-flex d-md-none align-items-center justify-content-between">
            <button
              className="hamburger-btn"
              onClick={() => setShowSidebar(true)}
              aria-label="Open menu"
            >
              <span /><span /><span />
            </button>

            <span
              className="brand-logo"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            >
              Go<span className="dot">-</span>Furniture
            </span>

            <button
              className="cart-icon-btn position-relative"
              onClick={() => setShowCart(true)}
              aria-label="Open cart"
            >
              🛒
              {cartCount > 0 && ( 
                <Badge bg="danger" pill className="cart-badge">
                  {cartCount}
                </Badge>
              )}
            </button>
          </div>

          <div className="d-flex d-md-none mt-2">
            <Form className="d-flex w-100">
              <Form.Control
                type="search"
                placeholder="Search furniture..."
                className="me-2"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </Form>
          </div>

          <div className="d-none d-md-flex align-items-center gap-3">

            <div style={{ minWidth: "200px" }}>
              <span
                className="brand-logo"
                onClick={() => navigate("/")}
                style={{ cursor: "pointer" }}
              >
                Go<span className="dot">-</span>Furniture
              </span>
            </div>

            <Form className="d-flex flex-grow-1">
              <Form.Control
                type="search"
                placeholder="Search for furniture, wardrobes, sofas..."
                className="me-2"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </Form>

            <div
              className="d-flex align-items-center gap-3"
              style={{ minWidth: "200px", justifyContent: "flex-end" }}
            >
              {isLoggedIn ? (
                <Button variant="outline-dark" size="sm" onClick={() => navigate("/profile")}>
                  My Account
                </Button>
              ) : (
                <button
                  className="auth-trigger-btn"
                  onClick={() => setShowAuth(true)}
                >
                  Login / Register
                </button>
              )}

              <button
                className="cart-icon-btn position-relative"
                onClick={() => setShowCart(true)}
                aria-label="Open cart"
              >
                🛒
                {cartCount > 0 && ( 
                  <Badge bg="danger" pill className="cart-badge">
                    {cartCount}
                  </Badge>
                )}
              </button>
            </div>
          </div>

        </Container>
      </header>
  </>);
};

export default Header;