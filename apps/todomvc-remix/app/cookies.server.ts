import { createCookie } from "@remix-run/node"; // or cloudflare/deno

export const keelRefreshCookie = createCookie("keel-refresh", {
    maxAge: 604_800, // one week,
    secrets: ["lol"],
    secure: true,
    httpOnly: true,
    sameSite: "strict"
});

export const keelAccessCookie = createCookie("keel-access", {
    maxAge: 86400, // one day
    secrets: ["lol"],
    secure: true,
    httpOnly: true,
    sameSite: "strict"
});