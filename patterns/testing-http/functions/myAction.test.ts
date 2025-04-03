import { beforeEach, expect, test, afterEach } from "vitest";
import { actions } from "@teamkeel/testing";
import { createServer, Server } from "node:http";

let server: Server;

beforeEach(() => {
  server = createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.write(
      JSON.stringify({
        hello: "world",
      })
    );
    res.end();
  });
  server.listen(8123);
});

afterEach(() => {
  server.close();
});

test("myAction", async () => {
  const res = await actions.myAction();
  expect(res.hello).toBe("world");
});
