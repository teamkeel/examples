import { MyAction, permissions } from "@teamkeel/sdk";

export default MyAction(async (ctx, inputs) => {
  permissions.allow();

  const res = await fetch(ctx.env.MY_API_URL);
  const body = await res.json();
  return body;
});
