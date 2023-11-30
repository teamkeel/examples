import { APIClient } from "keelClient"
import { getSession } from "~/sessions.server";

export const createClient = async (cookies: string) => {
    if (!process.env.KEEL_API_ROOT) {
        throw new Error("KEEL_API_ROOT is not defined")
    }
    const keel = new APIClient({ baseUrl: process.env.KEEL_API_ROOT + "/api" });
    const session = await getSession(cookies);
    const accessToken = session.get("keel_access_token");

    if (accessToken) {
        keel.client.setToken(accessToken)
    }

    return keel;
}