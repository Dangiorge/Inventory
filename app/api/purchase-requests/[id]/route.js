import connectDb from "@/lib/mongodb";
import PurchaseRequest from "@/models/PurchaseRequest";

export async function GET(req, { params }) {
  try {
    await connectDb();
    const pr = await PurchaseRequest.findById(params.id)
      .populate("items.item", "name sku category")
      .populate("requester", "name email");
    return new Response(JSON.stringify(pr), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDb();
    const body = await req.json();
    const pr = await PurchaseRequest.findById(params.id);

    if (!pr) return new Response("Not found", { status: 404 });

    // Prevent edits if approved
    if (pr.status === "Approved") {
      return new Response("Cannot edit an approved request", { status: 400 });
    }

    // Update PR items/status
    Object.assign(pr, body);
    await pr.save();

    return new Response(JSON.stringify(pr), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDb();
    await PurchaseRequest.findByIdAndDelete(params.id);
    return new Response(JSON.stringify({ message: "Deleted" }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
