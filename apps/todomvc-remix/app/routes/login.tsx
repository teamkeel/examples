import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/Layout";
import { LoginButton } from "~/components/LoginButton";
import { createClient } from "~/util/createClient";

export default function Login() {
  const { antiCsrfToken, clientId } = useLoaderData<{
    antiCsrfToken: string;
    clientId: string;
  }>();
  return (
    <Layout>
      <LoginButton antiCsrfToken={antiCsrfToken} clientId={clientId} />
    </Layout>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const keel = await createClient(request.headers.get("Cookie") ?? "");
  if (keel.ctx.isAuthenticated) {
    return redirect("/");
  }
  if (!process.env.SIGNING_SECRET) {
    throw new Error("No signing secret provided.");
  }

  const {
    default: { sign },
  } = await import("jsonwebtoken");
  const antiCsrfToken = sign("csrf", process.env.SIGNING_SECRET);
  const clientId = process.env.GOOGLE_CLIENT_ID;
  return { antiCsrfToken, clientId };
};
