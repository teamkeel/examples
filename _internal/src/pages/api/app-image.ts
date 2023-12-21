import { readFile } from "fs/promises";
import type { NextApiRequest, NextApiResponse } from "next";
import { join } from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const appSlug = req.query.s;
  const screenshot = join(
    process.cwd(),
    "..",
    "apps",
    appSlug as string,
    "screenshot.jpg"
  );
  const image = await readFile(screenshot);
  res.setHeader("Content-Type", "image/png");
  res.end(image);
}
