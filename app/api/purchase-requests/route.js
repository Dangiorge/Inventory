import connectDb from "@/lib/mongodb";
import PurchaseRequest from "@/models/PurchaseRequest";
import { getServerSession } from "next-auth";
// GET all requests
export async function GET(req) {
  await connectDb();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  let filter = {};
  if (status) filter.status = status;
  if (search) {
    filter.remark = { $regex: search, $options: "i" };
  }

  const requests = await PurchaseRequest.find(filter)
    .populate("requester", "name email")
    .sort({ createdAt: -1 });

  return Response.json(requests);
}

// CREATE a new request
export async function POST(req) {
  await connectDb();
  const session = await getServerSession();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const body = await req.json();

  const newRequest = await PurchaseRequest.create({
    requester: session.user.id, // 👈 this fixes the error
    remark: body.remark || "",
    status: "Draft",
  });

  return Response.json(newRequest);
}
