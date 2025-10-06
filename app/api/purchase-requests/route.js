import { NextResponse } from "next/server";
import connectDb from "@/lib/mongodb";
import PurchaseRequest from "@/models/PurchaseRequest";

export async function GET(req) {
  await connectDb();
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const sort = searchParams.get("sort");

  let filter = {};
  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    filter.createdAt = { $gte: start, $lte: end };
  }

  let requests = await PurchaseRequest.find(filter)
    .populate("requester", "name")
    .populate("approver", "name");

  if (sort === "name") {
    requests = requests.sort((a, b) =>
      a.requester.name.localeCompare(b.requester.name),
    );
  }

  return NextResponse.json(requests);
}

export async function POST(req) {
  await connectDb();
  const body = await req.json();
  console.log(body);
  try {
    const newRequest = await PurchaseRequest.create(body);
    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
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
