import { NextResponse } from "next/server";
import connectDb from "@/lib/mongodb";
import PurchaseRequest from "@/models/PurchaseRequest";

// ✅ Get single purchase request by ID
export async function GET(req, { params }) {
  try {
    await connectDb();
    const { id } = params;
    console.log("📦 Fetching purchase request for ID:", id);

    const request = await PurchaseRequest.findById(id);
    // .populate("requester", "name email role")
    // .populate("approver", "name email role")
    // .populate("items.item");

    if (!request) {
      console.log("⚠️ No request found for ID:", id);
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    console.log("✅ Found request:", request._id);
    return NextResponse.json(request, { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching purchase request:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
// ✅ PATCH → Add items to existing request
export async function PATCH(req, { params }) {
  await connectDb();
  const { id } = params;
  const { item } = await req.json(); // expect { item: { _id, name, unit, quantity } }

  try {
    const request = await PurchaseRequest.findById(id);
    if (!request)
      return NextResponse.json({ error: "Request not found" }, { status: 404 });

    request.items.push(item); // add to items array
    await request.save();

    return NextResponse.json(request);
  } catch (err) {
    console.error("Error adding item:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
