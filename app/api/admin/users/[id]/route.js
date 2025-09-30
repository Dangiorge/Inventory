// import connectDB from "@/lib/connectDb";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// UPDATE user role or name
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const { name, role } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, role },
      { new: true },
    ).select("-password");

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update user" }), {
      status: 500,
    });
  }
}

// DELETE user
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "User deleted" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete user" }), {
      status: 500,
    });
  }
}
