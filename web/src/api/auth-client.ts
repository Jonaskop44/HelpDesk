import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  basePath: "/api/v1/auth",
  disableDefaultFetchPlugins: true,
  plugins: [adminClient()],
});
