import { LoaderFunction, redirect } from "@remix-run/node";
import { commitSession, getSession } from "~/sessions.server";

export const loader: LoaderFunction = async ({ request }) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId) {
    throw new Error("Missing GOOGLE_CLIENT_ID");
  }

  if (!clientSecret) {
    throw new Error("Missing GOOGLE_CLIENT_SECRET");
  }

  const session = await getSession(request.headers.get("Cookie"));
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

  const data = await getIdTokenWithCode(params.code, clientId, clientSecret);
  const tokens = await exchangeGoogleIdTokenForKeelTokens(data.id_token);
  session.set("keel_access_token", tokens.access_token);
  session.set("keel_refresh_token", tokens.refresh_token);

  return redirect("/", {
    headers: new Headers({
      "Set-Cookie": await commitSession(session),
    }),
  });
};

const getIdTokenWithCode = async (
  code: string,
  clientId: string,
  clientSecret: string
) => {
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
