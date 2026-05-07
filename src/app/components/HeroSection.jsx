'use client';

import React from "react";
import { useWeb3 } from '../../context/Web3Context';
import { useRouter } from 'next/navigation';
import { Wallet, Plus, BarChart3, Megaphone, Link, Users } from 'lucide-react';
import Image from "next/image";

const HeroSection = () => {
    const { account, connectWallet } = useWeb3();
    const router = useRouter();

    const handleCreateCampaign = () => {
        if (!account) {
            connectWallet();
        } else {
            router.push('/campaigns/create');
        }
    };

    // Stats data

const stats = [
  {
    icon: Link,
    label: "Decentralized & Trustless",
    value: "Ethereum-based",
  },
  { icon: () => (
      <Image src="/ethereum-logo.svg" alt="ETH" width={25} height={25} />
    ),
     label: "Crypto-Based Funding",
    value: "ETH Donations",
  },
  {
    icon: Megaphone,
    label: "Campaign Transparency",
    value: "On-Chain Data",
  },
];

    return (
        <section className="dark:bg-secondaryBlack inset-0 flex min-h-[90vh] w-full flex-col items-center justify-center -mt-16 bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] relative overflow-hidden">
            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
            <div className="absolute top-40 right-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
            <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-slow"></div>

            <div className="relative z-10 mx-auto w-container max-w-full px-5 py-[100px] text-center lg:py-[130px]">
                {/* Enhanced Title */}
                <div className="mb-8">
                    <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-blue-700 font-medium text-sm">Blockchain Powered</span>
                    </div>
                    
                    <h1 className="text-xl font-bold text-blue-700 md:text-5xl lg:text-6xl mb-4">
                        Decentralized Crowdfunding
                        <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Platform
                        </span>
                    </h1>
                    
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                </div>
                 {/* Enhanced Buttons */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
                    {!account && (
                        <button
                            onClick={connectWallet}
                            className="group relative overflow-hidden h-[55px] px-8 bg-[#3247C5] text-white rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <Wallet size={20} className="relative z-10" />
                            <span className="relative z-10">Connect Wallet</span>
                        </button>
                    )}
                    
                    <button
                        onClick={handleCreateCampaign}
                        className="group relative overflow-hidden h-[55px] px-8 bg-[#28A745] text-white rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <Plus size={20} className="relative z-10" />
                        <span className="relative z-10">Create Campaign</span>
                    </button>
                    
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="group relative overflow-hidden h-[55px] px-8 bg-[#FFC107] text-black rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <BarChart3 size={20} className="relative z-10" />
                        <span className="relative z-10">Dashboard</span>
                    </button>
                </div>


                <p className="my-8 text-lg font-normal leading-relaxed text-gray-700 md:text-xl lg:text-2xl lg:leading-relaxed max-w-4xl mx-auto">
                    Empowering secure and transparent fundraising through blockchain technology.
                    Launch campaigns, set goals, and build trust with contributors worldwide.
                </p>

                {/* Stats Cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
  {stats.map((stat, index) => (
    <div
      key={index}
      className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="p-2 bg-blue-100 rounded-lg">
          {typeof stat.icon === "string" ? (
            <Image src={stat.icon} alt={stat.label} className="w-5 h-5" />
          ) : (
            <stat.icon size={20} className="text-blue-600" />
          )}
        </div>
      </div>
      <div className="text-xl font-bold text-gray-800">{stat.value}</div>
      <div className="text-sm text-gray-600">{stat.label}</div>
    </div>
  ))}
</div>


               
                {/* Connection Status */}
                {account && (
                    <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-700 font-medium text-sm">
                            Wallet Connected: {account.slice(0, 6)}...{account.slice(-4)}
                        </span>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) scale(1); }
                    50% { transform: translateY(-20px) scale(1.05); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px) scale(1); }
                    50% { transform: translateY(-30px) scale(0.95); }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) scale(1); }
                    50% { transform: translateY(-15px) scale(1.02); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 8s ease-in-out infinite;
                    animation-delay: 2s;
                }
                .animate-float-slow {
                    animation: float-slow 10s ease-in-out infinite;
                    animation-delay: 4s;
                }
            `}</style>
        </section>
    );
};

export default HeroSection;