"use client";
import React, { useState } from "react";
import RegisterForm from "./RegisterForm";
import { Lock, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { setCookie } from "@/utils/cookieutil";
import { login } from "@/services/authService";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const validateForm = () => {
    let isValid = true;
    setEmailError(null);
    setPasswordError(null);

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    // Password validation (min 6 characters)
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const data = await login(email, password);
      console.log(data), "forn login";
      if (data.success === true) {
        setCookie("email", data.user.email);
        setCookie("userName", data.user.userName);
        toast.success("Login successful!");
        router.push("/blogs");
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Login failed! " + error);
    } finally {
      setLoading(false);
    }
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-indigo-600 py-4">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Sign in to your account
            </h2>
          </div>
          <div className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                {/* Email Input */}
                <div className="relative">
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`appearance-none rounded-none relative block w-full px-10 py-2 border ${
                      emailError ? "border-red-500" : "border-gray-300"
                    } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-1 sm:text-sm`}
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
                {emailError && (
                  <p className="text-red-500 text-sm">{emailError}</p>
                )}

                {/* Password Input */}
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className={`appearance-none rounded-none relative block w-full px-10 py-2 border ${
                      passwordError ? "border-red-500" : "border-gray-300"
                    } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-1 sm:text-sm`}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  {passwordError && (
                    <p className="text-red-500 text-xs absolute left-2 -bottom-5">
                      {passwordError}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`group relative w-full flex justify-center items-center py-2 px-4 border border-transparent font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <div>
                  <button
                    onClick={openRegisterModal}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Register new account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Register Modal with smooth transition */}
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-50 transition-opacity duration-300 ${
            isRegisterModalOpen
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
          style={{ transition: "opacity 0.3s ease-in-out" }}
          onClick={closeRegisterModal}
        >
          <div
            className={`w-full max-w-md bg-white rounded-lg shadow-xl transition-transform duration-300 ${
              isRegisterModalOpen ? "transform scale-100" : "transform scale-95"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <RegisterForm onClose={closeRegisterModal} />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
