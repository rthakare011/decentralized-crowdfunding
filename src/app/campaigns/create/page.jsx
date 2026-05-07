"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../../firebase/config";
import { collection, addDoc } from "firebase/firestore";

const CreateCampaign = () => {
  const [campaign, setCampaign] = useState({
    title: "",
    description: "",
    amount: "",
    image: "",
    walletAddress: "",
    upiId: ""
  });

  const router = useRouter();

  const handleChange = (e) => {
    setCampaign({ ...campaign, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, "campaigns"), campaign);
      console.log("Campaign added with ID:", docRef.id);
      router.push(`/campaigns/${docRef.id}`);
    } catch (error) {
      console.error("Error adding campaign:", error);
    }
  };

  return (
    <section className="p-6">
      <div className="max-w-2xl mx-auto p-6 bg-white border-4 border-black rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-blue-700">Create a Campaign</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input
            type="text"
            name="title"
            value={campaign.title}
            onChange={handleChange}
            placeholder="Campaign Title"
            className="w-full p-2 border-2 border-black rounded"
            required
          />
          <textarea
            name="description"
            value={campaign.description}
            onChange={handleChange}
            placeholder="Campaign Description"
            className="w-full p-2 border-2 border-black rounded"
            required
          />
          <input
            type="text"
            name="amount"
            value={campaign.amount}
            onChange={handleChange}
            placeholder="Target Amount (ETH)"
            className="w-full p-2 border-2 border-black rounded"
            required
          />
          <input
            type="text"
            name="image"
            value={campaign.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full p-2 border-2 border-black rounded"
            required
          />
          <input
            type="text"
            name="walletAddress"
            value={campaign.walletAddress}
            onChange={handleChange}
            placeholder="Your Wallet Address (ETH)"
            className="w-full p-2 border-2 border-black rounded"
            required
          />
          <input
            type="text"
            name="upiId"
            value={campaign.upiId}
            onChange={handleChange}
            placeholder="Your UPI ID (e.g. name@upi)"
            className="w-full p-2 border-2 border-black rounded"
            required
          />
          <button
            type="submit"
            className="w-full p-3 bg-[#28A745] text-white font-bold rounded shadow-md hover:bg-[#218838]"
          >
            Create Campaign
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateCampaign;