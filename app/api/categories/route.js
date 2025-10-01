import connectDb from "@/lib/mongodb";
import Category from "@/models/Category";

// export async function GET() {
//   await connectDb();
//   try {
//     const categories = await Category.find().sort({ createdAt: -1 });
//     return new Response(JSON.stringify(categories), { status: 200 });
//   } catch (err) {
//     return new Response(JSON.stringify({ error: err.message }), {
//       status: 500,
//     });
//   }
// }

// export async function POST(req) {
//   await connectDb();
//   try {
//     const body = await req.json();
//     const { name, description } = body;

//     if (!name) {
//       return new Response(
//         JSON.stringify({ error: "Category name is required" }),
//         { status: 400 },
//       );
//     }

//     const category = await Category.create({ name, description });
//     return new Response(JSON.stringify(category), { status: 201 });
//   } catch (err) {
//     return new Response(JSON.stringify({ error: err.message }), {
//       status: 500,
//     });
//   }
// }

export async function GET(req) {
  try {
    await connectDb();
    const {
      search,
      page = 1,
      limit = 10,
    } = Object.fromEntries(new URL(req.url).searchParams);

    const query = search ? { name: { $regex: search, $options: "i" } } : {};
    const total = await Category.countDocuments(query);
    const categories = await Category.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    return new Response(JSON.stringify({ categories, total }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    await connectDb();
    const body = await req.json();
    const category = new Category(body);
    await category.save();
    return new Response(JSON.stringify(category), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
