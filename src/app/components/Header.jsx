"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Wallet, Menu, X, Home, Info, Github } from "lucide-react";
import { useWeb3 } from "../../context/Web3Context";

const Header = () => {
  const { account, connectWallet, isLoading } = useWeb3();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActiveLink = (href) => pathname === href;

  const handleAboutClick = (e) => {
    if (pathname === "/") {
      e.preventDefault();
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push("/about-us");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg border-b-2 border-[#3247C5]">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Image
                src="/logo.png"
                alt="Logo"
                width={80}
                height={80}
                className="relative h-16 w-auto transform group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-8 text-lg">
              <li>
                <Link
                  href="/"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 ${isActiveLink("/")
                      ? "text-[#3247C5] bg-blue-50"
                      : "text-gray-700 hover:text-[#3247C5] hover:bg-blue-50/50"
                    }`}
                >
                  <Home size={18} />
                  Home
                </Link>
              </li>
              <li>
                <a
                  href={pathname === "/" ? "#about" : "/about-us"}
                  onClick={handleAboutClick}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 ${isActiveLink("/about-us")
                      ? "text-[#3247C5] bg-blue-50"
                      : "text-gray-700 hover:text-[#3247C5] hover:bg-blue-50/50"
                    }`}
                >
                  <Info size={18} />
                  About
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/rthakare011"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:text-[#3247C5] hover:bg-blue-50/50 font-medium transition-all duration-300"
                >
                  <Github size={18} />
                  GitHub
                </a>
              </li>

              {/* Wallet Connect */}
              <li>
                {account ? (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2.5 rounded-xl border-2 border-blue-100 text-[#3247C5] font-semibold shadow-sm">
                    <Wallet size={18} />
                    <span>{`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
                  </div>
                ) : (
                  <button
                    onClick={connectWallet}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#3247C5] text-white font-semibold rounded-xl shadow-md hover:bg-[#2a3aa1] hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Wallet size={18} />
                    {isLoading ? "Connecting..." : "Connect Wallet"}
                  </button>
                )}
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:text-[#3247C5] hover:bg-blue-50 transition-all duration-300"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <nav>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActiveLink("/")
                        ? "text-[#3247C5] bg-blue-50"
                        : "text-gray-700 hover:text-[#3247C5] hover:bg-blue-50/50"
                      }`}
                  >
                    <Home size={20} />
                    Home
                  </Link>
                </li>
                <li>
                  <a
                    href={pathname === "/" ? "#about" : "/about-us"}
                    onClick={(e) => {
                      handleAboutClick(e);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActiveLink("/about-us")
                        ? "text-[#3247C5] bg-blue-50"
                        : "text-gray-700 hover:text-[#3247C5] hover:bg-blue-50/50"
                      }`}
                  >
                    <Info size={20} />
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-[#3247C5] hover:bg-blue-50/50 font-medium transition-all duration-300"
                  >
                    <Github size={20} />
                    GitHub
                  </a>
                </li>

                {/* Mobile Wallet Connect */}
                <li className="pt-2 border-t border-gray-200">
                  {account ? (
                    <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 rounded-xl border-2 border-blue-100 text-[#3247C5] font-semibold">
                      <Wallet size={20} />
                      <span>{`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        connectWallet();
                        setIsMobileMenuOpen(false);
                      }}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#3247C5] text-white font-semibold rounded-xl shadow-md hover:bg-[#2a3aa1] transition-all duration-300 disabled:opacity-50"
                    >
                      <Wallet size={20} />
                      {isLoading ? "Connecting..." : "Connect Wallet"}
                    </button>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
