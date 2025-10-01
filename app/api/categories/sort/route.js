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
