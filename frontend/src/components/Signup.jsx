import { Eye, EyeOff, UserPlus, Mail, Lock, User } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { colors } = useTheme();

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/v1/user/signup",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );
      alert(data.message || "Signup Succeeded");
      navigate("/login");
    } catch (error) {
      const msg = error?.response?.data?.errors || "Signup Failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSignup();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 transition-colors duration-300"
      style={{ backgroundColor: colors.bg.primary }}
    >
      <div
        className="w-full max-w-md rounded-3xl p-8 shadow-2xl border transition-colors"
        style={{
          backgroundColor: colors.bg.secondary,
          borderColor: colors.border,
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div
              className="p-3 rounded-2xl"
              style={{ backgroundColor: colors.bg.tertiary }}
            >
              <UserPlus size={28} style={{ color: colors.accent.primary }} />
            </div>
          </div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: colors.text.primary }}
          >
            Create Account
          </h1>
          <p
            className="text-sm"
            style={{ color: colors.text.secondary }}
          >
            Join ValkyrieAI and start chatting
          </p>
        </div>

        {/* First Name */}
        <div className="mb-6">
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: colors.text.primary }}
          >
            First Name
          </label>
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 focus-within:ring-2 transition-all"
            style={{
              backgroundColor: colors.bg.tertiary,
              borderColor: colors.border,
              "--tw-ring-color": colors.accent.primary,
            }}
          >
            <User size={18} style={{ color: colors.text.secondary }} />
            <input
              className="flex-1 bg-transparent outline-none text-base"
              type="text"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              style={{ color: colors.text.primary }}
            />
          </div>
        </div>

        {/* Last Name */}
        <div className="mb-6">
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: colors.text.primary }}
          >
            Last Name
          </label>
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 focus-within:ring-2 transition-all"
            style={{
              backgroundColor: colors.bg.tertiary,
              borderColor: colors.border,
              "--tw-ring-color": colors.accent.primary,
            }}
          >
            <User size={18} style={{ color: colors.text.secondary }} />
            <input
              className="flex-1 bg-transparent outline-none text-base"
              type="text"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              style={{ color: colors.text.primary }}
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-6">
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: colors.text.primary }}
          >
            Email Address
          </label>
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 focus-within:ring-2 transition-all"
            style={{
              backgroundColor: colors.bg.tertiary,
              borderColor: colors.border,
              "--tw-ring-color": colors.accent.primary,
            }}
          >
            <Mail size={18} style={{ color: colors.text.secondary }} />
            <input
              className="flex-1 bg-transparent outline-none text-base"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              style={{ color: colors.text.primary }}
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-6">
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: colors.text.primary }}
          >
            Password
          </label>
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 focus-within:ring-2 transition-all"
            style={{
              backgroundColor: colors.bg.tertiary,
              borderColor: colors.border,
              "--tw-ring-color": colors.accent.primary,
            }}
          >
            <Lock size={18} style={{ color: colors.text.secondary }} />
            <input
              className="flex-1 bg-transparent outline-none text-base"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Choose a strong password"
              value={formData.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              style={{ color: colors.text.primary }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="transition-colors"
              style={{ color: colors.text.secondary }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="p-3 rounded-lg mb-6 text-sm font-medium border-l-4"
            style={{
              backgroundColor: colors.bg.tertiary,
              color: colors.accent.error,
              borderLeftColor: colors.accent.error,
            }}
          >
            ❌ {error}
          </div>
        )}

        {/* Terms & Conditions */}
        <p
          className="text-xs mb-6 text-center"
          style={{ color: colors.text.secondary }}
        >
          By signing up, you consent to ValkyrieAI{" "}
          <a
            className="underline transition-colors"
            href="#"
            style={{ color: colors.accent.primary }}
          >
            Terms of Use
          </a>{" "}
          and{" "}
          <a
            className="underline transition-colors"
            href="#"
            style={{ color: colors.accent.primary }}
          >
            Privacy Policy
          </a>
        </p>

        {/* Signup Button */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full font-semibold py-3 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 text-white mb-6"
          style={{
            backgroundColor: colors.accent.primary,
          }}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating Account...
            </>
          ) : (
            <>
              <UserPlus size={18} />
              Sign Up
            </>
          )}
        </button>

        {/* Login Link */}
        <div className="text-center">
          <p style={{ color: colors.text.secondary }}>
            Already have an account?{" "}
            <Link
              className="font-semibold transition-colors hover:underline"
              to="/login"
              style={{ color: colors.accent.primary }}
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
