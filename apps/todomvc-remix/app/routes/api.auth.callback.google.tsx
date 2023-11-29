import { LoaderFunction, redirect } from "@remix-run/node";
import { keelAccessCookie, keelRefreshCookie } from "~/cookies.server";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!clientId) {
  throw new Error("Missing GOOGLE_CLIENT_ID");
}

if (!clientSecret) {
  throw new Error("Missing GOOGLE_CLIENT_SECRET");
}

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());

  if (!process.env.SIGNING_SECRET) {
    throw new Error("No signing secret provided.");
  }

  const {
    default: { verify },
  } = await import("jsonwebtoken");

  const antiCsrfToken =
    new URLSearchParams(params.state).get("security_token") ?? "";

  verify(antiCsrfToken, process.env.SIGNING_SECRET);

  const data = await getIdTokenWithCode(params.code);
  const tokens = await exchangeGoogleIdTokenForKeelTokens(data.id_token);

  const headers = new Headers([
    ["Cache-Control", "must-revalidate, no-store, no-cache"],
    ["Set-Cookie", await keelRefreshCookie.serialize(tokens.refresh_token)],
    ["Set-Cookie", await keelAccessCookie.serialize(tokens.access_token)],
  ]);

  return redirect("/", { headers });
};

const getIdTokenWithCode = async (code: string) => {
  const response = await fetch(`https://oauth2.googleapis.com/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      clientId,
      clientSecret,
      redirectUri: "http://localhost:3000/api/auth/callback/google",
      grant_type: "authorization_code",
    }).toString(),
  });
  return response.json();
};

const exchangeGoogleIdTokenForKeelTokens = async (idToken: string) => {
  const body = {
    subject_token: idToken,
    grant_type: "token_exchange",
  };
  const response = await fetch(process.env.KEEL_API_ROOT + "/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body).toString(),
  });
  return response.json();
};

export default function Google() {
  return null;
}
