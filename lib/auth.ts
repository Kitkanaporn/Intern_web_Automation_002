import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// REVIEW NEEDED: prisma/schema.prisma (CLAUDE.md Section 6, fixed schema) has
// no User model, so authentication uses a fixed in-memory demo user list as a
// Phase 1 stopgap. These ids/names mirror prisma/seed.ts: "user-kanya" is the
// request creator/submitter, "user-somchai" is a distinct approver — kept
// separate to demonstrate Rule 2 (no self-approval) in the approval flow.
interface DemoUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

const DEMO_USERS: DemoUser[] = [
  {
    id: "user-kanya",
    name: "Kanya N.",
    email: "kanya@tsd.set.or.th",
    password: "password123",
  },
  {
    id: "user-somchai",
    name: "Somchai P.",
    email: "somchai@tsd.set.or.th",
    password: "password123",
  },
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const matchedUser = DEMO_USERS.find(
          (demoUser) => demoUser.email === email && demoUser.password === password
        );

        if (!matchedUser) {
          return null;
        }

        return {
          id: matchedUser.id,
          name: matchedUser.name,
          email: matchedUser.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
});
