'use client';
import React from 'react';
import { Rocket, PiggyBank } from 'lucide-react';

const PromotionalCard = () => (
  <section className="w-full px-4 py-20">
    <div className="max-w-4xl mx-auto rounded-3xl border border-indigo-200 shadow-2xl p-10 text-center bg-white ">
      <div className="mb-8">
        <img src="/logo.png" alt="DApp Logo" className="mx-auto w-44 h-auto drop-shadow-md" />
      </div>
      <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
        Fueling Ideas.
        <span className="block bg-gradient-to-r from-indigo-600 to-sky-600 bg-clip-text text-transparent mt-2">
          Transforming Lives.
        </span>
      </h2>
      <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto">
        Empower innovation and create social impact directly on the blockchain. <strong>Launch your campaign</strong> or <strong>become a vital backer</strong> today!
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <a href="/campaigns/create" className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg shadow-lg hover:bg-indigo-700 transition">
          <Rocket size={24} /> Start a Campaign
        </a>
        <a href="/dashboard" className="inline-flex items-center gap-3 px-8 py-4 border text-gray-800 bg-white rounded-full font-bold text-lg shadow hover:bg-gray-50 transition">
          <PiggyBank size={24} className="text-green-500" /> Back a Campaign
        </a>
      </div>
    </div>
  </section>
);

export default PromotionalCard;
