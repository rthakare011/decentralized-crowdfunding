import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Fetch campaign data by ID.
 */
export const fetchCampaignById = async (id) => {
  const docRef = doc(db, "campaigns", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    throw new Error("Campaign not found.");
  }

  return { ...snapshot.data(), id };
};

/**
 * Update collected amount and contributor count.
 */
export const updateCampaignStats = async (id, campaign, amount) => {
  const docRef = doc(db, "campaigns", id);

  const newCollected = (campaign.collected || 0) + amount;
  const newContributors = (campaign.contributors || 0) + 1;

  await updateDoc(docRef, {
    collected: newCollected,
    contributors: newContributors,
  });

  return {
    collected: newCollected,
    contributors: newContributors,
  };
};
