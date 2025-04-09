"use client";
import React, { useState, useRef, useEffect } from "react";
import { getCookie, deleteCookie } from "../utils/cookieutil";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  ChevronDown,
  LogOut,
  Settings,
  User,
  Bell,
  ListTodo,
  LayoutDashboard,
} from "lucide-react";
import LogoutConfirmationModal from "./LogoutConfirmationModal";

const Header: React.FC = () => {
  const pathname = usePathname();
  if (pathname === "/login") return null;
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const userName = getCookie("userName") || "User";
  const email = getCookie("email") || "user@email.com";
  const firstLetter = userName.charAt(0).toUpperCase();
  const [mounted, setMounted] = useState(false);

  const handleLogout = () => {
    deleteCookie("userName");
    deleteCookie("email");
    router.push("/login");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-lg mr-3">
              <ListTodo className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              <Link href="/blogs"> BlogMaster</Link>
            </h1>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-150"
                onClick={() => {
                  setNotificationOpen(!notificationOpen);
                  setDropdownOpen(false);
                }}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>

            {/* User Menu */}
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center gap-3 cursor-pointer py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                  setNotificationOpen(false);
                }}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-medium text-md shadow-sm">
                  {firstLetter}
                </div>
                <span className="text-gray-700 font-medium capitalize hidden sm:flex items-center">
                  <span className="max-w-[120px] truncate">{userName}</span>
                  <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
                </span>
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <p className="font-medium text-gray-800 capitalize">
                      {userName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{email}</p>
                  </div>

                  <div className="py-1">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => router.push("/dashboard")}
                    >
                      <LayoutDashboard className="w-4 h-4 text-gray-500" />
                      Dashboard
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => console.log("Profile clicked")}
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      Your Profile
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => console.log("Settings clicked")}
                    >
                      <Settings className="w-4 h-4 text-gray-500" />
                      Settings
                    </button>
                  </div>

                  <div className="py-1 border-t border-gray-100">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      onClick={() => {
                        setDropdownOpen(false);
                        setIsLogoutModalOpen(true);
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Header;
