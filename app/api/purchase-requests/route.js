import connectDb from "@/lib/mongodb";
import PurchaseRequest from "@/models/PurchaseRequest";
import { getServerSession } from "next-auth"; // if you use NextAuth
import User from "@/models/User";

export async function GET() {
  try {
    await connectDb();
    const requests = await PurchaseRequest.find()
      .populate("requester", "name email")
      .populate("items.item", "name category sku");
    return new Response(JSON.stringify(requests), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    await connectDb();
    const body = await req.json();

    // normally you'd get user from session:
    // const session = await getServerSession(authOptions);
    // const requesterId = session.user.id;
    const requesterId = body.requester; // fallback for now

    const request = new PurchaseRequest({
      requester: requesterId,
      items: [],
      status: "Draft",
    });

    await request.save();
    return new Response(JSON.stringify(request), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
