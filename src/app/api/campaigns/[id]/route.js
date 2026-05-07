import { db } from "../../../../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export async function GET(req, { params }) {
  const { id } = params; // Get campaign ID

  try {
    const campaignDoc = await getDoc(doc(db, "campaigns", id));

    if (!campaignDoc.exists()) {
      return new Response(JSON.stringify({ error: "Campaign not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(campaignDoc.data()), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching campaign", details: error.message }), { status: 500 });
  }
}
