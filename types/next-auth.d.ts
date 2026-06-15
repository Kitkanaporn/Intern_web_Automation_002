import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

// "next-auth/jwt" re-exports JWT from "@auth/core/jwt" via `export *`, so the
// callback signatures inside @auth/core resolve to that module's JWT type.
// Augmenting it directly here is required for `token.id` to be typed `string`.
declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
  }
}
