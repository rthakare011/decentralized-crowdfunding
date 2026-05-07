// shareModal/ShareCampaignModal.jsx
'use client;'

import { use, useState } from "react";
import { 
  Facebook, 
  Twitter, 
  MessageCircle, 
  Linkedin, 
  Send, 
  Mail, 
  Copy, 
  Check,
  X,
  Link,
  Share,
  Heart,
  Megaphone
} from "lucide-react";

const ShareCampaignModal = ({ isOpen, onClose, campaignUrl, campaignTitle }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(campaignUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const shareHandlers = {
    Facebook: () =>
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(campaignUrl)}`, "_blank"),
    Twitter: () =>
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("Support this campaign: " + campaignTitle)}&url=${encodeURIComponent(campaignUrl)}`, "_blank"),
    WhatsApp: () =>
      window.open(`https://wa.me/?text=${encodeURIComponent("Support this campaign: " + campaignTitle + " " + campaignUrl)}`, "_blank"),
    LinkedIn: () =>
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(campaignUrl)}`, "_blank"),
    Telegram: () =>
      window.open(`https://t.me/share/url?url=${encodeURIComponent(campaignUrl)}&text=${encodeURIComponent("Support this campaign: " + campaignTitle + " " + campaignUrl)}`, "_blank"),
    Email: () =>
      window.open(`mailto:?subject=${encodeURIComponent("Support this campaign: " + campaignTitle)}&body=${encodeURIComponent("Check out this campaign: " + campaignUrl)}`),
  };

  const icons = [
    { 
      name: "Facebook", 
      icon: <Facebook size={20} className="text-white fill-current" />, 
      bg: "bg-[#1877F2] hover:bg-[#166FE5]",
      hoverScale: "hover:scale-110",
      description: "Share on Facebook"
    },
    { 
      name: "Twitter", 
      icon: <Twitter size={20} className="text-white fill-current" />, 
      bg: "bg-[#1DA1F2] hover:bg-[#1A91DA]",
      hoverScale: "hover:scale-110",
      description: "Post on Twitter"
    },
    { 
      name: "WhatsApp", 
      icon: <MessageCircle size={20} className="text-white" />, 
      bg: "bg-[#25D366] hover:bg-[#22C55E]",
      hoverScale: "hover:scale-110",
      description: "Share via WhatsApp"
    },
    { 
      name: "LinkedIn", 
      icon: <Linkedin size={20} className="text-white fill-current" />, 
      bg: "bg-[#0A66C2] hover:bg-[#095BA6]",
      hoverScale: "hover:scale-110",
      description: "Share on LinkedIn"
    },
    { 
      name: "Telegram", 
      icon: <Send size={20} className="text-white" />, 
      bg: "bg-[#0088CC] hover:bg-[#007BB5]",
      hoverScale: "hover:scale-110",
      description: "Send via Telegram"
    },
    { 
      name: "Email", 
      icon: <Mail size={20} className="text-white" />, 
      bg: "bg-[#EA4335] hover:bg-[#DB3E2F]",
      hoverScale: "hover:scale-110",
      description: "Share via Email"
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
        >
          <X size={20} />
        </button>

        <h3 className="text-2xl font-bold mb-2 text-center text-gray-800 flex items-center justify-center gap-2">
          <Heart size={24} className="text-red-500 fill-current" />
          Share This Campaign
        </h3>
        <p className="text-gray-600 text-center mb-8 text-sm flex items-center justify-center gap-1">
          <Megaphone size={16} className="text-blue-500" />
          Help spread the word and make a difference
        </p>

        {/* Social media icons */}
        <div className="mb-8 grid grid-cols-3 gap-1">
          {icons.map(({ name, icon, bg, hoverScale, description }) => (
            <button
              key={name}
              onClick={shareHandlers[name]}
              className="flex flex-col items-center justify-center p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group relative"
              title={description}
            >
              <div className={`flex items-center justify-center w-14 h-14 ${bg} ${hoverScale} rounded-full mb-3 transition-all duration-200 shadow-lg group-hover:shadow-xl`}>
                {icon}
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">{name}</span>
              <span className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">{description}</span>
            </button>
          ))}
        </div>

        {/* Copy link section */}
        <div className="mb-6">
          <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Link size={16} className="text-gray-500" />
            Campaign Link
          </label>
          <div className="flex items-center shadow-sm">
            <input
              type="text"
              value={campaignUrl}
              readOnly
              className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button
              onClick={handleCopyLink}
              className={`px-4 py-3 text-white rounded-r-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isCopied 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-[#3247C5] hover:bg-[#2a3aa0]'
              }`}
            >
              <div className="flex items-center gap-2">
                {isCopied ? <Check size={16} /> : <Copy size={16} />}
                <span className="text-sm">{isCopied ? "Copied!" : "Copy"}</span>
              </div>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <Share size={12} />
            Anyone with this link can view the campaign
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ShareCampaignModal;