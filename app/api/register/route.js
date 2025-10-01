import connectDb from "@/lib/mongodb";
import User from "@/models/User";
import { hash } from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400 },
      );
    }

    await connectDb();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 400,
      });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name: name || "",
      email,
      password: hashedPassword,
      role: "user",
    });

    return new Response(
      JSON.stringify({
        message: "User created successfully",
        userId: newUser._id,
      }),
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
