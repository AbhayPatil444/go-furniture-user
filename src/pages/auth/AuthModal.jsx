import { useState } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { login } from "../../reduxStore/authSlice";
import { toast } from "react-toastify";

const API_KEY = import.meta.env.VITE_USER_FIREBASE_AUTH_API_KEY;

const friendlyError = (raw = "") => {
  if (raw.includes("EMAIL_NOT_FOUND"))        return "No account found with this email.";
  if (raw.includes("INVALID_PASSWORD"))        return "Incorrect password. Please try again.";
  if (raw.includes("INVALID_LOGIN_CREDENTIALS")) return "Incorrect email or password.";
  if (raw.includes("TOO_MANY_ATTEMPTS"))       return "Too many attempts. Please try again later.";
  if (raw.includes("EMAIL_EXISTS"))            return "An account with this email already exists.";
  if (raw.includes("WEAK_PASSWORD"))           return "Password must be at least 6 characters.";
  if (raw.includes("INVALID_EMAIL"))           return "Please enter a valid email address.";
  return raw || "Something went wrong. Please try again.";
};

const AuthModal = ({ show, onHide, defaultMode = "login" }) => {
  const dispatch = useDispatch();

  const [mode, setMode] = useState(defaultMode); 
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ email: "", password: "", confirmPassword: "" });

  const handleClose = () => {
    setLoginData({ email: "", password: "" });
    setSignupData({ email: "", password: "", confirmPassword: "" });
    setLoading(false);
    onHide();
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    if (newMode === "login") {
      setSignupData({ email: "", password: "", confirmPassword: "" });
    } else {
      setLoginData({ email: "", password: "" });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: loginData.email,
            password: loginData.password,
            returnSecureToken: true,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message);

      dispatch(login({ token: data.idToken, email: data.email }));
      toast.success("Welcome back! 👋");
      handleClose();
    } catch (err) {
      toast.error(friendlyError(err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (signupData.password.length < 6) {
      toast.warning("Password must be at least 6 characters.");
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: signupData.email,
            password: signupData.password,
            returnSecureToken: true,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message);

      dispatch(login({ token: data.idToken, email: data.email }));
      toast.success("Account created! Welcome 🎉");
      handleClose();
    } catch (err) {
      toast.error(friendlyError(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="auth-modal">
      <Modal.Header closeButton className="border-0 pb-0" />

      <Modal.Body className="px-4 pb-4 pt-0">

        <div className="auth-modal-tabs">
          <button
            className={`auth-tab ${mode === "login" ? "auth-tab--active" : ""}`}
            onClick={() => switchMode("login")}
          >
            Login
          </button>
          <button
            className={`auth-tab ${mode === "signup" ? "auth-tab--active" : ""}`}
            onClick={() => switchMode("signup")}
          >
            Sign Up
          </button>
        </div>

        {mode === "login" && (
          <>
            <h5 className="auth-modal-title">Welcome back</h5>
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  disabled={loading}
                />
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="w-100 fw-semibold py-2"
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Login"}
              </Button>
            </Form>

            <p className="text-center mt-3 mb-0" style={{ fontSize: "0.875rem" }}>
              Don't have an account?{" "}
              <button className="auth-switch-btn" onClick={() => switchMode("signup")}>
                Sign Up
              </button>
            </p>
          </>
        )}

        {mode === "signup" && (
          <>
            <h5 className="auth-modal-title">Create an account</h5>
            <Form onSubmit={handleSignup}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="At least 6 characters"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  required
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Repeat your password"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  required
                  disabled={loading}
                />
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="w-100 fw-semibold py-2"
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Create Account"}
              </Button>
            </Form>

            <p className="text-center mt-3 mb-0" style={{ fontSize: "0.875rem" }}>
              Already have an account?{" "}
              <button className="auth-switch-btn" onClick={() => switchMode("login")}>
                Login
              </button>
            </p>
          </>
        )}

      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;