"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config"; // Ensure correct path

const CreateCampaign = ({ params }) => {
  const { id } = params; // Directly access params
  const [campaign, setCampaign] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchCampaign() {
      if (!id) return; // Prevent running on undefined id

      try {
        const campaignDocRef = doc(db, "campaigns", id);
        const campaignDoc = await getDoc(campaignDocRef);

        if (campaignDoc.exists()) {
          setCampaign(campaignDoc.data());
        } else {
          router.push("/404"); // Redirect if campaign not found
        }
      } catch (error) {
        console.error("Error fetching campaign:", error);
      }
    }

    fetchCampaign();
  }, [id, router]);

  if (!campaign) return <p>Loading...</p>;

  const shareCampaign = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Campaign link copied to clipboard!");
  };

  return (
    <div className="p-6">
      <div><header /></div>
      <div className="p-6 bg-white border-4 border-black rounded-lg shadow-lg">
        <img src={campaign.image} alt={campaign.title} className="w-full h-60 object-cover border-b-2 border-black" />
        <h2 className="text-3xl font-bold mt-4">{campaign.title}</h2>
        <p className="text-gray-700 mt-2">{campaign.description}</p>
        <strong className="block mt-4">{campaign.amount} ETH</strong>

        <button onClick={shareCampaign} className="mt-4 p-2 bg-black text-white font-bold rounded">
          Share Campaign
        </button>

        <h3 className="text-2xl font-bold mt-6">How to Contribute</h3>
        <p className="text-gray-700">1. Click the "Contribute" button.</p>
        <p className="text-gray-700">2. Enter the amount in ETH.</p>
        <p className="text-gray-700">3. Connect your wallet and confirm.</p>
      </div>
    </div>
  );
};

export default CreateCampaign;
