"use client";
import React from "react";
import { Heart, Github, Coffee, ExternalLink } from "lucide-react";
import { usePathname } from "next/navigation";

const Footer: React.FC = () => {
  const pathname = usePathname();
  if (pathname === "/login") return null;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and copyright */}
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <span className="text-blue-600 font-bold text-xl">
                BlogMaster
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              &copy; {currentYear} BlogMaster. All rights reserved.
            </p>
          </div>

          {/* Middle links */}
          <div className="flex gap-6 mb-4 md:mb-0 text-sm">
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              Help Center
            </a>
          </div>

          {/* Social links */}
          <div className="flex gap-4">
            <a
              href="https://github.com/bishnuf66"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="flex items-center gap-1 text-gray-500 hover:text-amber-600 transition-colors duration-200"
              aria-label="Buy me a coffee"
            >
              <Coffee className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-red-500 transition-colors duration-200"
              aria-label="Made with love"
            >
              <Heart className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Attribution line */}
        <div className="border-t border-gray-200 mt-6 pt-4 text-center text-xs text-gray-400">
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500" /> by Bishnu |
            <a
              href="https://github.com/bishnuf66/nextjs-blog"
              className="text-blue-500 hover:text-blue-700 inline-flex items-center gap-1 ml-1"
            >
              View Source <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
