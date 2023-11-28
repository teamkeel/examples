import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { LoginButton } from "~/components/LoginButton";
import { createClient } from "~/util/createClient";

export default function Login() {
  const { antiCsrfToken, clientId } = useLoaderData<{
    antiCsrfToken: string;
    clientId: string;
  }>();
  return (
    <div>
      <header>
        <h1>
          Keel Logo x <span>TodoMVC</span>
        </h1>
      </header>
      <main>
        <LoginButton antiCsrfToken={antiCsrfToken} clientId={clientId} />
      </main>
    </div>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const keel = await createClient(request.headers.get("Cookie") ?? "");
  if (keel.ctx.isAuthenticated) {
    return redirect("/");
  }
  const antiCsrfToken = Math.random().toString(36).substring(2, 15);
  const clientId = process.env.GOOGLE_CLIENT_ID;
  return { antiCsrfToken, clientId };
};
