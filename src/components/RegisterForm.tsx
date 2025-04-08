"use client";

import React, { useState } from "react";
import { User, Lock, Mail, X } from "lucide-react";
import toast from "react-hot-toast";
import { register } from "@/services/authService";

interface RegisterFormProps {
  onClose: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onClose }) => {
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      toast.error("You must agree to the terms and conditions.");
      return;
    }

    try {
      setLoading(true);
      const data = await register(userName, email, password);

      if (data.success === false) {
        toast.error(data.message);
      } else if (data.success === true) {
        onClose(); // Close the modal on successful registration
        toast.success(data.message);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative ">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-0 right-0 z-50 mt-4 mr-4 text-gray-600 hover:text-gray-900"
        aria-label="Close"
      >
        <X className="text-white" />
      </button>
      <div className="bg-indigo-600 py-4  rounded-t-lg">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Register new account
        </h2>
      </div>

      <form className=" space-y-6 p-8" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px ">
          {/* User Name Input with Icon */}
          <div className="relative">
            <input
              id="userName"
              name="userName"
              type="text"
              required
              className="appearance-none rounded-none relative block w-full px-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-1 sm:text-sm"
              placeholder="User Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <User className="h-5 w-5 text-gray-500" />
            </div>
          </div>

          {/* Email Input with Icon */}
          <div className="relative">
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-none relative block w-full px-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-1 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Mail className="h-5 w-5 text-gray-500" />
            </div>
          </div>

          {/* Password Input with Icon */}
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none rounded-none relative block w-full px-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-1 sm:text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Lock className="h-5 w-5 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="agree-terms"
              name="agree-terms"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />

            <label
              htmlFor="agree-terms"
              className="ml-2 block text-sm text-gray-900"
            >
              I agree to the terms and conditions
            </label>
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
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
