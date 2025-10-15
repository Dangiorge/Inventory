import { NextResponse } from "next/server";
import connectDb from "@/lib/mongodb";
import PurchaseRequest from "@/models/PurchaseRequest";
// import PurchaseRequest from "@/models/PurchaseRequest";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export async function GET(req) {
//   await connectDb();
//   const { searchParams } = new URL(req.url);
//   const date = searchParams.get("date");
//   const sort = searchParams.get("sort");

//   let filter = {};
//   if (date) {
//     const start = new Date(date);
//     const end = new Date(date);
//     end.setHours(23, 59, 59, 999);
//     filter.createdAt = { $gte: start, $lte: end };
//   }

//   let requests = await PurchaseRequest.find(filter)
//     .populate("requester", "name")
//     .populate("approver", "name");
//   if (sort === "name") {
//     requests = requests.sort((a, b) =>
//       a.requester.name.localeCompare(b.requester.name),
//     );
//   }

//   return NextResponse.json(requests);
// }
export async function GET(req) {
  await connectDb();

  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const sort = searchParams.get("sort");
    const filter = {};

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.createdAt = { $gte: start, $lt: end };
    }

    const requests = await PurchaseRequest.find(filter).populate(
      "requester",
      "name",
    );
    // .populate("approvedBy", "name");
    // console.log(requests);
    if (sort === "name") query = query.sort({ "requester.name": 1 });
    if (sort === "date") query = query.sort({ createdAt: -1 });

    // const requests = await query.exec();

    return Response.json(requests, { status: 200 });
  } catch (error) {
    console.error("GET /purchase-requests error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
// export async function POST(req) {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return new Response(JSON.stringify({ error: "Unauthorized" }), {
//       status: 401,
//     });
//   }
//   await connectDb();
//   const body = await req.json();
//   const userId = session.user.id;
//   const userRole = session.user.role;
//   console.log(userId);
//   try {
//     const newRequest = await PurchaseRequest.create(body);
//     return NextResponse.json(newRequest, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 400 });
//   }
// }
export async function POST(req) {
  const session = await getServerSession({ req, ...authOptions }); // ✅ pass req + authOptions
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  await connectDb();

  const body = await req.json();
  const { department, remark } = body;
  const items = {};

  const requesterId = session.user.id; // ✅ get the logged-in user's ID
  const role = session.user.role; // ✅ get the logged-in user's role
  const requesterEmail = session.user.email;
  console.log(session.user.email); // ✅ get the logged-in user's role
  // console.log(requesterId);
  const newRequest = await PurchaseRequest.create({
    requester: requesterId,
    requester_email: requesterEmail,
    department,
    remark,
    role,
  });
  console.log(newRequest);
  // await newRequest.save();

  return new Response(JSON.stringify({ success: true, data: newRequest }), {
    status: 201,
  });
}

export async function PUT(req) {
  await connectDb();
  const body = await req.json();

  try {
    const updated = await PurchaseRequest.findByIdAndUpdate(
      body.id,
      { status: "Approved", approver: body.approver },
      { new: true },
    ).populate("approver", "name");

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
