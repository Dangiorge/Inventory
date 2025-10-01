import connectDb from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET() {
  await connectDb();
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(categories), { status: 200 });
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
    const { name, description } = body;

    if (!name) {
      return new Response(
        JSON.stringify({ error: "Category name is required" }),
        { status: 400 },
      );
    }

    const category = await Category.create({ name, description });
    return new Response(JSON.stringify(category), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
