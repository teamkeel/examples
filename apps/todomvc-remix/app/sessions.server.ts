import { createCookieSessionStorage } from "@remix-run/node";

if (!process.env.SIGNING_SECRET) {
    throw new Error("SIGNING_SECRET is not set");
}

export const { getSession, commitSession, destroySession } =
    createCookieSessionStorage({
        cookie: {
            name: "__session",
            secrets: [process.env.SIGNING_SECRET],
            sameSite: "lax",
        },
    });