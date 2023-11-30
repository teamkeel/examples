import {
  redirect,
  type ActionFunction,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Todo } from "keelClient";
import { CreateTodoForm } from "~/components/CreateTodoForm";
import { Layout } from "~/components/Layout";
import { Todos } from "~/components/Todos";
import { getSession } from "~/sessions.server";
import { createClient } from "~/util/createClient";

type LoaderData = { todos: Todo[] };

export default function Index() {
  const { todos } = useLoaderData<LoaderData>(); // See the `loader` function below.

  return (
    <Layout>
      <CreateTodoForm />
      <div>
        <Todos todos={todos} />
      </div>
    </Layout>
  );
}

/**
 * Loaders are how we get data for the initial UI in Remix.
 */
export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("keel_access_token")) {
    return redirect("/login");
  }
  const keel = await createClient(request.headers.get("Cookie") ?? "");
  const todoRes = await keel.api.queries.listTodos({});
  const todos = todoRes?.data?.results ?? [];
  return { todos };
};

/**
 * Actions are how we handle POST requests in Remix to perform mutations.
 */
export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData(); // Get the form data

  // Create the Keel client with the user's access token
  const keelClient = await createClient(request.headers.get("Cookie") ?? "");

  // Find out what we want to do
  const action = body.get("action");

  switch (action) {
    case "create":
      const title = body.get("todo");
      if (typeof title !== "string") throw new Error("Invalid todo");
      await keelClient.api.mutations.createTodo({
        title,
      });
      break;
    case "delete":
      await keelClient.api.mutations.deleteTodo({
        id: String(body.get("id")),
      });
      break;
    case "update":
      await keelClient.api.mutations.updateTodo({
        where: { id: String(body.get("id")) },
        values: {
          completed: JSON.parse(String(body.get("checked")) ?? "false"),
        },
      });
      break;
  }
  return null;
};

export const meta: MetaFunction = () => {
  return [
    { title: "My Todo List" },
    { name: "description", content: "A list of things to do." },
  ];
};
