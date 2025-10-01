// import connectDb from "@/lib/connectDb";
import connectDb from "@/lib/mongodb";

import User from "@/models/User";
import { hash, compare } from "bcryptjs";

export async function POST(req) {
  try {
    const { email, oldPassword, newPassword } = await req.json();

    // await connectDb();
    await connectDb();

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // check old password
    const isValid = await compare(oldPassword, user.password);
    if (!isValid) {
      return new Response(
        JSON.stringify({ error: "Old password is incorrect" }),
        { status: 400 },
      );
    }

    // hash new password
    const hashedPassword = await hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    return new Response(
      JSON.stringify({ message: "Password updated successfully" }),
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
