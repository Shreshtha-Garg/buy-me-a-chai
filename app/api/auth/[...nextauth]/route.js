// next_auth/route.js
import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '@/db/connectDb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDB();
    
        const user = await User.findOne({ email: credentials.email });
        // console.log(User);
        // console.log("credentials (next_auth_route.js): ", credentials);
        // console.log("user: ", user);
        if (!user) {
          throw new Error('No user found with the email');
        }
    
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }
    
        return user;
      }
    })    
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account.provider === 'github') {
        try {
          await connectDB();

          const userEmail = email || profile.email || user.email;
          if (!userEmail) {
            throw new Error('No email found for user');
          }

          const existingUser = await User.findOne({ email: userEmail });
          if (!existingUser) {
            const newUser = User({
              email: userEmail,
              username: userEmail.split('@')[0],
              name: user.name,
              profilePic: user.image || "/fan-avatar-2.gif",
              coverPic: "/chai-cover-pic.jpg",
            });
            await newUser.save();
          }
          return true;
        } catch (error) {
          console.error('Error during sign-in:', error);
          return false;
        }
      }
      return true;
    },
    async session({ session, user, token }) {
      try {
        await connectDB();
        const dbUser = await User.findOne({ email: session.user.email });
        if (dbUser) {
          session.user.username = dbUser.username;
          session.user.name = dbUser.name;
          session.user.profilePic = dbUser.profilePic;
        }
        return session;
      } catch (error) {
        console.error('Error during session callback:', error);
        return session;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
      }
      // console.log("token (next_auth_route.js): ", token);
      // console.log("token username: ", token.username);
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token', // Set a specific name for the session token cookie
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
});

export { handler as GET, handler as POST };
