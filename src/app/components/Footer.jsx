import React from 'react';
import logo from "../../../public/crowdfunding.svg";
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-700 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-8">
          
          {/* Brand Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="flex items-center">
              <Image 
                src={logo} 
                alt="Crowdfunding Logo" 
                width={24} 
                height={24}
                className="mr-2"
              />
            </div>
            
            {/* Navigation Links */}
            <nav className="flex flex-wrap items-center gap-4 sm:gap-6">
              <Link href="/" className="text-gray-300 hover:text-white text-sm">
                Home
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-white text-sm">
                About
              </Link>
              <Link href="/campaigns" className="text-gray-300 hover:text-white text-sm">
                Campaigns
              </Link>
              <Link 
                href="https://github.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white text-sm"
              >
                GitHub
              </Link>
              <Link href="/dashboard" className="text-gray-300 hover:text-white text-sm">
                Dashboard
              </Link>
            </nav>
          </div>

          {/* Social & Contact */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-4">
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 text-sm">
                Contact
              </Link>
              <Link 
                href="https://linkedin.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                LinkedIn
              </Link>
            </div>
            
            {/* Copyright */}
            <div className="text-gray-500 text-xs sm:text-sm">
              © {new Date().getFullYear()} Decentralized Crowdfunding DApp — All rights reserved.
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;