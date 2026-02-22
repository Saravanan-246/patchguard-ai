import React, { useState } from "react";
import { loginUser, registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield, Mail, User, Lock } from "lucide-react";

/* ================= INPUT COMPONENT (Moved Outside) ================= */
function InputField({
  name,
  type = "text",
  placeholder,
  icon: Icon,
  value,
  onChange,
  showPassword,
  togglePassword,
}) {
  return (
    <div style={styles.inputWrap}>
      <Icon size={18} style={styles.inputIcon} />
      <input
        name={name}
        type={type === "password" && showPassword ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        style={styles.input}
      />
      {name === "password" && (
        <button
          type="button"
          onClick={togglePassword}
          style={styles.eyeButton}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
      const response = isLogin
        ? await loginUser({ email: form.email, password: form.password })
        : await registerUser(form);

      const token = response?.data?.token;
      if (!token) throw new Error("Authentication failed.");

      localStorage.setItem("token", token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Authentication failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoRow}>
          <Shield size={28} color="#2563eb" />
          <h1 style={styles.brand}>PatchGuard AI</h1>
        </div>

        <h2 style={styles.title}>
          {isLogin ? "Welcome Back 👋" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <InputField
              name="name"
              placeholder="Full Name"
              icon={User}
              value={form.name}
              onChange={handleChange}
            />
          )}

          <InputField
            name="email"
            placeholder="Email Address"
            icon={Mail}
            value={form.email}
            onChange={handleChange}
          />

          <InputField
            name="password"
            type="password"
            placeholder="Password"
            icon={Lock}
            value={form.password}
            onChange={handleChange}
            showPassword={showPassword}
            togglePassword={() => setShowPassword((prev) => !prev)}
          />

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p style={styles.switchText}>
          {isLogin ? "New here?" : "Already have an account?"}
          <span
            style={styles.switchLink}
            onClick={() => {
              setIsLogin((prev) => !prev);
              setError("");
              setForm({ name: "", email: "", password: "" });
            }}
          >
            {isLogin ? " Create account" : " Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f1f5f9",
    padding: "20px",
    fontFamily: "Inter, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    background: "#fff",
    padding: "35px 28px",
    borderRadius: 16,
    boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    justifyContent: "center",
    marginBottom: 20,
  },
  brand: {
    fontSize: 20,
    fontWeight: 700,
    color: "#1e293b",
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 25,
    color: "#334155",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  inputWrap: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "14px 40px 14px 38px",
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    fontSize: 14,
    outline: "none",
  },
  eyeButton: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  button: {
    marginTop: 10,
    padding: "14px",
    borderRadius: 10,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  error: {
    background: "#fef2f2",
    color: "#dc2626",
    padding: 10,
    borderRadius: 8,
    fontSize: 13,
  },
  switchText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 13,
    color: "#64748b",
  },
  switchLink: {
    color: "#2563eb",
    fontWeight: 600,
    cursor: "pointer",
    marginLeft: 5,
  },
};