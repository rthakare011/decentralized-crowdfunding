'use client';

import {
  Sparkles,
  Shield,
  Wallet,
  TrendingUp,
  Eye,
  CheckCircle,
  Share2,
  FileText,
  Search,
  Monitor,
  Database,
  Rocket,
} from 'lucide-react';

const etheriumLogo = '/ethereum-logo.svg';

const projectStats = [
  { icon: Shield, label: 'Security Features', value: 'Multi-layer', color: 'red' },
  { icon: Wallet, label: 'Crypto Integration', value: 'MetaMask & UPI', color: 'green' },
  { icon: TrendingUp, label: 'Performance Gain', value: '40%', color: 'purple' },
  { icon: Monitor, label: 'Components Built', value: '15+', color: 'blue' },
];

const projectFeatures = [
  { icon: Shield, title: 'Decentralized & Trustless', description: 'Ethereum smart contracts ensure transparency', color: 'blue' },
  { icon: Wallet, title: 'Crypto Funding (ETH)', description: 'Secure contributions using MetaMask', color: 'green' },
  { icon: TrendingUp, title: 'Real-time Tracking', description: 'Live updates and contribution monitoring', color: 'purple' },
  { icon: Eye, title: 'Campaign Discovery', description: 'Search and explore detailed campaign stats', color: 'yellow' },
  { icon: CheckCircle, title: 'Admin Approval', description: 'Only verified campaigns go live', color: 'red' },
  { icon: Share2, title: 'Social Sharing', description: 'Shareable links for social media', color: 'indigo' },
];

const projectWorkflow = [
  { step: '1', title: 'Create Campaign', description: 'Users enter campaign details.', details: 'Data saved on-chain and off-chain.', icon: FileText, color: 'blue' },
  { step: '2', title: 'Admin Review', description: 'Approved before going live.', details: 'Ensures legitimacy.', icon: CheckCircle, color: 'green' },
  { step: '3', title: 'Public Discovery', description: 'Search, filter, view stats.', details: 'Engage with live campaigns.', icon: Search, color: 'purple' },
  { step: '4', title: 'Contribute', description: 'Donate via ETH or UPI.', details: 'On-chain or QR code modal.', icon: etheriumLogo, color: 'orange' },
  { step: '5', title: 'Real-time Updates', description: 'Live sync with Firebase.', details: 'Instant visual updates.', icon: TrendingUp, color: 'pink' },
];

const techStack = [
  { category: 'Smart Contracts', technologies: ['Solidity', 'Hardhat'], icon: Shield, color: 'blue' },
  { category: 'Frontend', technologies: ['Next.js', 'React', 'Tailwind CSS'], icon: Monitor, color: 'green' },
  { category: 'Wallet Integration', technologies: ['MetaMask', 'Ethers.js'], icon: Wallet, color: 'purple' },
  { category: 'Backend/DB', technologies: ['Firestore', 'REST APIs'], icon: Database, color: 'orange' },
  { category: 'Deployment', technologies: ['Vercel', 'GitHub Actions'], icon: Rocket, color: 'pink' },
];

const getColorClasses = (color) => ({
  blue: 'bg-blue-100 text-blue-600 border-blue-200',
  green: 'bg-green-100 text-green-600 border-green-200',
  purple: 'bg-purple-100 text-purple-600 border-purple-200',
  yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200',
  red: 'bg-red-100 text-red-600 border-red-200',
  orange: 'bg-orange-100 text-orange-600 border-orange-200',
  pink: 'bg-pink-100 text-pink-600 border-pink-200',
  indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200',
}[color] || 'bg-blue-100 text-blue-600 border-blue-200');

const getBgColorClasses = (color) => ({
  blue: 'bg-blue-50 border-blue-200',
  green: 'bg-green-50 border-green-200',
  purple: 'bg-purple-50 border-purple-200',
  yellow: 'bg-yellow-50 border-yellow-200',
  red: 'bg-red-50 border-red-200',
  orange: 'bg-orange-50 border-orange-200',
  pink: 'bg-pink-50 border-pink-200',
  indigo: 'bg-indigo-50 border-indigo-200',
}[color] || 'bg-blue-50 border-blue-200');

const AboutProject = () => (
  <section className="max-w-7xl mx-auto px-6 py-20">
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-100 mb-4">
        <Sparkles className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-700">Blockchain Crowdfunding DApp</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
        Crowdfunding with
        <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Decentralized Technology
        </span>
      </h1>
      <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
        Build, launch, and manage fundraising campaigns directly on Ethereum. Secure. Transparent. Empowering.
      </p>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
      {projectStats.map((stat, idx) => (
        <div key={idx} className="bg-white p-4 rounded-xl shadow border text-center">
          <div className={`inline-flex p-2 rounded-lg ${getColorClasses(stat.color)} mb-2`}>
            <stat.icon size={20} />
          </div>
          <div className="text-lg font-bold text-gray-800">{stat.value}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>

    {/* Features */}
    <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
      {projectFeatures.map((feature, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl shadow border text-center">
          <div className={`inline-flex p-3 rounded-xl ${getColorClasses(feature.color)} mb-4`}>
            <feature.icon size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>

    {/* Workflow */}
    <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
    <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-6 mb-16 text-center">
      {projectWorkflow.map((step, idx) => (
        <div key={idx} className="flex flex-col items-center gap-4">
          <div className={`w-24 h-24 flex flex-col justify-center items-center rounded-full shadow border-2 ${getBgColorClasses(step.color)}`}>
            {typeof step.icon === 'string' ? (
              <img src={step.icon} className="w-5 h-5 mb-1" alt={step.title} />
            ) : (
              <step.icon size={20} />
            )}
            <span className="text-xs font-bold text-gray-700">{step.step}</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-sm">
            <h4 className="font-bold text-gray-900 mb-1">{step.title}</h4>
            <p className="text-gray-600">{step.description}</p>
            <p className="text-gray-500 text-xs mt-1">{step.details}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Tech Stack */}
    <h2 className="text-3xl font-bold text-center mb-12">Technology Stack</h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {techStack.map((tech, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow p-6 border">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${getColorClasses(tech.color)}`}>
              <tech.icon size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{tech.category}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {tech.technologies.map((t, i) => (
              <span key={i} className={`px-3 py-1 text-sm rounded-full border ${getBgColorClasses(tech.color)}`}>
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default AboutProject;
