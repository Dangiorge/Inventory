import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { hash } from "bcryptjs";

// GET all users
export async function GET() {
  await connectDB();
  const users = await User.find({}, "-password"); // exclude password
  return new Response(JSON.stringify(users), { status: 200 });
}

// CREATE new user
export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password, role } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 400,
      });
    }

    const hashedPassword = await hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create user" }), {
      status: 500,
    });
  }
}
