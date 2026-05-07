"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { 
  Target, 
  TrendingUp, 
  Users, 
  Wallet, 
  CreditCard, 
  Share2, 
  ArrowLeft, 
  DollarSign,
  Loader2,
  Info,
  Heart,
  Calendar,
  MapPin,
  CheckCircle,
  AlertCircle,
  Zap,
  Globe,
  Smartphone
} from "lucide-react";

import { contributeToWallet } from "../../../utils/contributeToWallet";
import { fetchCampaignById, updateCampaignStats } from "../../../utils/campaignService";

import UpiPaymentModal from "../../upi-qr-modal/UpiPaymentModal";
import ShareCampaignModal from "../../../app/shareModal/ShareCampaignModal";

const CampaignDetails = () => {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contributionAmount, setContributionAmount] = useState("");
  const [isContributing, setIsContributing] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("eth");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    if (!id) return;
    
    const load = async () => {
      try {
        const data = await fetchCampaignById(id);
        setCampaign(data);
      } catch (error) {
        toast.error("Failed to load campaign details.");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    
    load();
  }, [id, router]);

  const campaignUrl = 
    typeof window !== "undefined" ? `${window.location.origin}/campaigns/${id}` : "";

  const handleContribute = async () => {
    if (!campaign) {
      toast.error("Campaign data not available.");
      return;
    }
    
    if (!campaign.walletAddress) {
      toast.error("Campaign wallet address not found!");
      return;
    }

    if (!contributionAmount || isNaN(contributionAmount) || Number(contributionAmount) <= 0) {
      toast.error("Please enter a valid amount to contribute.");
      return;
    }

    try {
      setIsContributing(true);
      
      const receipt = await contributeToWallet(campaign.walletAddress, contributionAmount);
      
      if (receipt) {
        const updated = await updateCampaignStats(id, campaign, parseFloat(contributionAmount));
        setCampaign((prev) => ({ ...prev, ...updated }));
        setContributionAmount("");
        toast.success(`Successfully contributed ${contributionAmount} ETH to ${campaign.title}!`);
      }
    } catch (error) {
      console.error("Contribution process failed:", error);
    } finally {
      setIsContributing(false);
    }
  };

  const handleUpiPaymentSuccess = async (amount) => {
    try {
      const ethApprox = amount / 250000;
      
      const updated = await updateCampaignStats(id, campaign, ethApprox);
      setCampaign((prev) => ({ ...prev, ...updated }));
      toast.success(`Successfully contributed ₹${amount} to ${campaign.title}!`);
    } catch (err) {
      console.error("Failed to update campaign stats after UPI payment:", err);
      toast.error("Payment recorded, but campaign stats couldn't be updated.");
    }
  };

  if (loading) {
    return (
      <div className="dark:bg-secondaryBlack min-h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-gray-400 text-lg flex items-center gap-2">
            <Info size={20} />
            Loading campaign details...
          </p>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min(
    ((campaign.collected || 0) / campaign.amount) * 100,
    100
  );

  const isGoalReached = progressPercentage >= 100;

  return (
    <div className="dark:bg-secondaryBlack bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] min-h-screen w-full py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-lg overflow-hidden shadow-xl border-2 border-[#3247C5]">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/5">
            <div className="relative h-64 md:h-80 w-full">
              {campaign.image && (
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent"></div>
              
              {/* Goal Badge */}
              <div className="absolute bottom-6 left-6">
                <span className="bg-[#FFC107] text-black text-sm font-bold px-3 py-1 rounded-full flex items-center gap-2">
                  <Target size={16} />
                  Goal: {campaign.amount} ETH
                </span>
              </div>

              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                {isGoalReached ? (
                  <span className="bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full flex items-center gap-2">
                    <CheckCircle size={16} />
                    Goal Reached!
                  </span>
                ) : (
                  <span className="bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full flex items-center gap-2">
                    <Zap size={16} />
                    Active
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="md:w-3/5 p-6">
            <h1 className="text-3xl font-heading text-blue-700 mb-3 flex items-center gap-3">
              <Heart className="text-red-500 fill-current" size={28} />
              {campaign.title}
            </h1>

            <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Info size={20} className="text-blue-600" />
                About this Campaign
              </h2>
              <p className="text-gray-700 whitespace-pre-line text-sm">
                {campaign.description}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      isGoalReached ? 'bg-green-500' : 'bg-[#28A745]'
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                  {isGoalReached && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  )}
                </div>
              </div>
              <div className="text-sm font-medium flex items-center gap-1">
                <TrendingUp size={16} className="text-green-600" />
                {progressPercentage.toFixed(1)}%
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg text-center border border-blue-200">
                <div className="flex items-center justify-center mb-1">
 <Image src="/ethereum-logo.svg" alt="ETH" width={16} height={16} />
                </div>
                <p className="text-xs text-gray-600">Raised</p>
                <p className="text-sm font-bold text-[#3247C5]">
                  {campaign.collected || 0} ETH
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg text-center border border-green-200">
                <div className="flex items-center justify-center mb-1">
                  <Target size={16} className="text-green-600" />
                </div>
                <p className="text-xs text-gray-600">Goal</p>
                <p className="text-sm font-bold text-green-600">
                  {campaign.amount} ETH
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg text-center border border-purple-200">
                <div className="flex items-center justify-center mb-1">
                  <Users size={16} className="text-purple-600" />
                </div>
                <p className="text-xs text-gray-600">Backers</p>
                <p className="text-sm font-bold text-purple-600">
                  {campaign.contributors || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
           <Image src="/ethereum-logo.svg" alt="ETH" width={20} height={20} />
            How to Contribute
          </h2>

          {/* Payment Method Toggle */}
          <div className="flex mb-4 bg-white rounded-lg p-1 max-w-xs shadow-sm border">
            <button
              onClick={() => setPaymentMethod("eth")}
              className={`flex-1 py-2 px-3 text-center rounded-md transition-all duration-200 flex items-center justify-center gap-2 ${
                paymentMethod === "eth"
                  ? "bg-[#3247C5] text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
               <Image src="/ethereum-logo.svg" alt="ETH" width={20} height={20} />
              ETH
            </button>
            <button
              onClick={() => setPaymentMethod("upi")}
              className={`flex-1 py-2 px-3 text-center rounded-md transition-all duration-200 flex items-center justify-center gap-2 ${
                paymentMethod === "upi"
                  ? "bg-[#3247C5] text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              disabled={!campaign.upiId}
            >
              <Smartphone size={16} />
              UPI
            </button>
          </div>

          {paymentMethod === "eth" ? (
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Image src="/ethereum-logo.svg" alt="ETH" width={20} height={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-800 mb-1">Contribute with Ethereum</p>
                  <p className="text-sm text-gray-600">
                    Connect your wallet and contribute ETH directly to support this campaign.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                 <Image src="/ethereum-logo.svg" alt="ETH" width={16} height={16}  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    placeholder="Enter amount (ETH)"
                    className="w-full pl-10 pr-3 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-[#3247C5] focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleContribute}
                  className="px-6 py-3 bg-[#28A745] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#218838] transition-all duration-200 flex items-center justify-center gap-2 min-w-[140px]"
                  disabled={isContributing}
                >
                  {isContributing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Heart size={16} />
                      Contribute Now
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              {campaign.upiId ? (
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Smartphone size={20} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 mb-1">Pay with UPI (INR)</p>
                    <p className="text-sm text-gray-600 mb-4">
                      Contribute in Indian Rupees using any UPI app like PhonePe, GPay, or Paytm.
                    </p>
                    <button
                      onClick={() => setShowUpiModal(true)}
                      className="w-full py-3 bg-[#3247C5] text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <CreditCard size={16} />
                      Pay with UPI
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertCircle size={20} className="text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    UPI payment is not available for this campaign.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
            <button
              onClick={() => setIsShareOpen(true)}
              className="px-8 py-3 bg-[#3247C5] text-white rounded-lg text-lg font-medium hover:bg-[#2a3aa0] transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <Share2 size={20} />
              Share Campaign
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-8 py-3 text-[#3247C5] border-2 border-[#3247C5] rounded-lg text-lg font-medium hover:bg-[#3247C5] hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ArrowLeft size={20} />
              Back to All Campaigns
            </button>
          </div>
        </div>
      </div>

      {campaign?.upiId && (
        <UpiPaymentModal
          isOpen={showUpiModal}
          onClose={() => setShowUpiModal(false)}
          upiId={campaign.upiId}
          campaignTitle={campaign.title}
          onSuccessfulPayment={handleUpiPaymentSuccess}
        />
      )}

      {isShareOpen && (
        <ShareCampaignModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          campaignUrl={campaignUrl}
          campaignTitle={campaign.title}
        />
      )}
    </div>
  );
};

export default CampaignDetails;