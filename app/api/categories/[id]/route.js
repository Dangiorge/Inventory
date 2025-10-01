import connectDb from "@/lib/mongodb";
import Category from "@/models/Category";

export async function PUT(req, { params }) {
  try {
    await connectDb();
    const body = await req.json();
    const category = await Category.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    return new Response(JSON.stringify(category), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDb();
    await Category.findByIdAndDelete(params.id);
    return new Response(JSON.stringify({ message: "Category deleted" }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
