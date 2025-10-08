import connectDb from "@/lib/mongodb";
import PurchaseRequest from "@/models/PurchaseRequest";

// GET single request
export async function GET(req, { params }) {
  await connectDb();

  const request = await PurchaseRequest.findById(params.id);
  // .populate("requester", "name email")
  // .populate("items.item", "name unit");

  if (!request) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
    });
  }

  return Response.json(request);
}

// UPDATE (add items, edit remark)
export async function PUT(req, { params }) {
  await connectDb();
  const body = await req.json();

  let update = {};
  if (body.remark !== undefined) update.remark = body.remark;
  if (body.itemId && body.quantity) {
    update.$push = { items: { item: body.itemId, quantity: body.quantity } };
  }

  const updated = await PurchaseRequest.findByIdAndUpdate(params.id, update, {
    new: true,
  }).populate("items.item", "name unit");

  return Response.json(updated);
}

// PATCH (status changes like submit, approve, reject)
export async function PATCH(req, { params }) {
  await connectDb();
  const body = await req.json();

  const update = {};
  if (body.status === "Pending Approval") {
    update.status = "Pending Approval";
  }
  if (body.status === "Approved") {
    update.status = "Approved";
    update.approvedAt = new Date();
    update.approvedBy = body.userId;
  }
  if (body.status === "Rejected") {
    update.status = "Rejected";
    update.approvedAt = new Date();
    update.approvedBy = body.userId;
  }

  const updated = await PurchaseRequest.findByIdAndUpdate(params.id, update, {
    new: true,
  }).populate("items.item", "name unit");

  return Response.json(updated);
}

// DELETE request (only if Draft)
export async function DELETE(req, { params }) {
  await connectDb();

  const request = await PurchaseRequest.findById(params.id);
  if (!request) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
    });
  }

  if (request.status !== "Draft") {
    return new Response(
      JSON.stringify({ error: "Only draft requests can be deleted" }),
      { status: 400 },
    );
  }

  await PurchaseRequest.findByIdAndDelete(params.id);

  return Response.json({ success: true });
}
