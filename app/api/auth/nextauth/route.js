import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const admins = [
  { email: "YOUR_ADMIN_EMAILS" }
];

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;


        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        const inputPassword = password;
        const storedUserPassword = process.env.AUTH_PASSWORD;
        const storedAdminPassword = process.env.ADMIN_AUTH_PASSWORD;


        let isMatch = false;
        let title = "user";

        const is_admin = admins.some((obj) => obj.email === email);

        if (is_admin) {

          isMatch = await bcrypt.compare(inputPassword, storedAdminPassword);
          title = "admin";
        } else {

          isMatch = await bcrypt.compare(inputPassword, storedUserPassword);
        }


        if (isMatch) {
          return { email, title };
        }

        throw new Error("Invalid password");
      }
    }),
  ],
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 20 * 60,
    updateAge: 2 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.email;
        token.title = user.title;
        token.lastActivity = Date.now();
      } else {
        const timeSinceLastActivity = (Date.now() - (token.lastActivity || 0)) / 1000;
        if (timeSinceLastActivity > authOptions.session.maxAge) {
          throw new Error("Session expired");
        }
        token.lastActivity = Date.now();
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.id,
          title: token.title,
        };
        session.expires = new Date(token.lastActivity + (authOptions.session.maxAge * 1000)).toISOString();
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };