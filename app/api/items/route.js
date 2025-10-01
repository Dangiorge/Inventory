import connectDb from "@/lib/mongodb";
import Item from "@/models/Item";

export async function GET() {
  await connectDb();
  try {
    const items = await Item.find()
      .populate("category")
      .sort({ createdAt: -1 });
    return new Response(JSON.stringify(items), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  await connectDb();
  try {
    const body = await req.json();
    const { name, category, description, brand, unit, sku, createdBy } = body;

    if (!name || !category) {
      return new Response(
        JSON.stringify({ error: "Name and category are required" }),
        { status: 400 },
      );
    }

    const item = await Item.create({
      name,
      category,
      description,
      brand,
      unit,
      sku,
      createdBy,
    });

    return new Response(JSON.stringify(item), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
