import connectDb from "@/utils/connectDb";
import Item from "@/models/Item";

export async function PUT(req, { params }) {
  await connectDb();
  try {
    const { id } = params;
    const body = await req.json();
    const { name, category, description } = body;

    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { name, category, description },
      { new: true },
    );

    if (!updatedItem) {
      return new Response(JSON.stringify({ error: "Item not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedItem), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
