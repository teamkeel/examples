import { APIClient } from "keelClient"
import { keelAccessCookie } from "~/cookies.server";

export const createClient = async (cookies: string) => {
    if (!process.env.KEEL_API_ROOT) {
        throw new Error("KEEL_API_ROOT is not defined")
    }
    const keel = new APIClient({ baseUrl: process.env.KEEL_API_ROOT + "/api" });
    const accessToken = await keelAccessCookie.parse(
        cookies
    );

    if (accessToken) {
        keel.client.setToken(accessToken)
    }

    return keel;
}