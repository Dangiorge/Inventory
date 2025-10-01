import connectDb from "@/lib/mongodb";
import Item from "@/models/Item";

export async function PUT(req, { params }) {
  await connectDb();
  try {
    const { id } = params;
    const body = await req.json();
    const { name, category, description, brand, sku, unit } = body;

    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { name, category, description, brand, sku, unit },
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

export async function DELETE(req, { params }) {
  await connectDb();
  try {
    const { id } = params;
    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      return new Response(JSON.stringify({ error: "Item not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Item deleted successfully" }),
      { status: 200 },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
