
import connectDB from '@/db/connectDb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import generateJWTToken from '@/generateJWTToken';

export async function POST(req) {
  try {
    const { email, username, password } = await req.json();

    if (!email || !username || !password) {
      return new Response(JSON.stringify({ error: 'Please provide all required fields' }), { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      profilePic: "/fan-avatar-2.gif",
      coverPic: "/User_profile_bg.jpg",
    });

    await newUser.save();

    const token = generateJWTToken(newUser);
    // console.log("token: ", token);
    return new Response(JSON.stringify({ message: 'User created successfully', token }), { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
