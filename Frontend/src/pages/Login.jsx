import React, { useState, useEffect, useCallback } from "react";
import { loginUser, registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield, Mail, User, Lock } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);

  /* ================= SAFE RESPONSIVE INIT ================= */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  /* ================= INPUT HANDLER ================= */
  const handleChange = useCallback((e) => {
    setError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    if (!form.email || !form.password) {
      return "Email and password are required.";
    }

    if (!isLogin && !form.name.trim()) {
      return "Full name is required.";
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return "Please enter a valid email address.";
    }

    if (form.password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    return null;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = isLogin
        ? await loginUser({ email: form.email, password: form.password })
        : await registerUser(form);

      const token = response?.data?.token;

      if (!token) {
        throw new Error("Authentication failed. No token received.");
      }

      localStorage.setItem("token", token);

      setForm({ name: "", email: "", password: "" });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to authenticate. Please try again."
      );

      setForm((prev) => ({ ...prev, password: "" }));
    } finally {
      setLoading(false);
    }
  };

  /* ================= INPUT COMPONENT ================= */
  const InputField = ({ name, type = "text", placeholder, icon: Icon }) => (
    <div style={styles.inputWrap}>
      <Icon size={20} style={styles.inputIcon} />
      <input
        name={name}
        type={type === "password" && showPassword ? "text" : type}
        placeholder={placeholder}
        value={form[name]}
        onChange={handleChange}
        required
        autoComplete={
          name === "password"
            ? "current-password"
            : name === "email"
            ? "email"
            : "name"
        }
        style={styles.input}
      />
      {name === "password" && (
        <div
          style={styles.eye}
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </div>
      )}
    </div>
  );

  return (
    <div
      style={{
        ...styles.container,
        flexDirection: isDesktop ? "row" : "column",
      }}
    >
      {isDesktop && (
        <div style={styles.left}>
          <div style={styles.brandBox}>
            <div style={styles.logo}>
              <Shield size={42} color="#fff" />
            </div>
            <h1 style={styles.brand}>PatchGuard AI</h1>
            <p style={styles.tagline}>
              Enterprise Vulnerability Intelligence & Patch Automation
            </p>
          </div>
        </div>
      )}

      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>
            {isLogin ? "Welcome Back 👋" : "Create Account"}
          </h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            {!isLogin && (
              <InputField name="name" placeholder="Full Name" icon={User} />
            )}

            <InputField name="email" placeholder="Email Address" icon={Mail} />

            <InputField
              name="password"
              type="password"
              placeholder="Password"
              icon={Lock}
            />

            {error && <div style={styles.error}>{error}</div>}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.btn,
                ...(loading && styles.btnDisabled),
              }}
            >
              {loading
                ? "Processing..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          <p style={styles.switch}>
            {isLogin ? "No account?" : "Already registered?"}
            <span
              style={styles.switchSpan}
              onClick={() => {
                setIsLogin((prev) => !prev);
                setError("");
                setForm({ name: "", email: "", password: "" });
              }}
            >
              {isLogin ? " Create one" : " Sign in"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    fontFamily: "'Inter', sans-serif",
    background: "#f8fafc",
  },
  left: {
    flex: 1,
    background: "linear-gradient(135deg,#1e3a8a,#0f172a)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 60px",
  },
  brandBox: { textAlign: "center", maxWidth: 420 },
  logo: {
    width: 90,
    height: 90,
    background: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 30px",
    backdropFilter: "blur(15px)",
  },
  brand: { fontSize: 40, fontWeight: 900, marginBottom: 16 },
  tagline: { opacity: 0.85, lineHeight: 1.6 },
  right: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 20px",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    padding: "36px 28px",
    borderRadius: 20,
    background: "#ffffff",
    boxShadow: "0 25px 60px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    textAlign: "center",
    marginBottom: 28,
  },
  form: { display: "flex", flexDirection: "column", gap: 18 },
  inputWrap: { position: "relative" },
  inputIcon: {
    position: "absolute",
    left: 16,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8",
  },
  input: {
    width: "100%",
    padding: "16px 18px 16px 48px",
    borderRadius: 12,
    border: "1.8px solid #e2e8f0",
    fontSize: 15,
    outline: "none",
  },
  eye: {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#94a3b8",
  },
  error: {
    padding: 12,
    borderRadius: 10,
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    fontSize: 14,
  },
  btn: {
    padding: 16,
    borderRadius: 12,
    background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
    color: "#fff",
    fontWeight: 600,
    fontSize: 15,
    border: "none",
    cursor: "pointer",
  },
  btnDisabled: { opacity: 0.7, transform: "scale(0.98)" },
  switch: {
    textAlign: "center",
    marginTop: 22,
    fontSize: 14,
    color: "#64748b",
  },
  switchSpan: {
    color: "#3b82f6",
    fontWeight: 600,
    cursor: "pointer",
  },
};