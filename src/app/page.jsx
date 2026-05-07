'use client';

import React from "react";
import HeroSection from "./components/HeroSection";
import { useWeb3 } from "../context/Web3Context";
import Aboutus from "./about-us/page";
import Footer from "./components/Footer";
const HomePage = () => {
  const { isLoading } = useWeb3();

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <main>
        <HeroSection />
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <p className="text-lg">Connecting to wallet...</p>
            </div>
          </div>
        )}
        <Aboutus />
        <Footer/>
      </main>
    </div>
  );
};

export default HomePage;