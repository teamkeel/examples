import { SerializeFrom } from "@remix-run/node";
import { useSubmit } from "@remix-run/react";
import { Todo } from "keelClient";

type Props = {
  todos: SerializeFrom<Todo[]>;
};

export const Todos = ({ todos }: Props) => {
  const submit = useSubmit();

  return (
    <ul>
      {todos.map((t) => (
        <li className="grid" key={t.id}>
          <label>
            <input
              type="checkbox"
              onClick={() =>
                submit(
                  new URLSearchParams({
                    action: "update",
                    checked: String(!t.completed),
                    id: t.id,
                  }),
                  { method: "POST" }
                )
              }
              defaultChecked={t.completed}
            />
            <span>{t.title}</span>
          </label>
          <form
            onSubmit={(e) => {
              if (!confirm("Are you sure you want to delete this todo?")) {
                e.preventDefault();
              }
            }}
            style={{ marginLeft: "auto" }}
            method="POST"
            action="/?index"
          >
            <input type="hidden" name="action" value="delete" />
            <input type="hidden" name="id" value={t.id} />
            <button style={{ all: "unset" }}>❌</button>
          </form>
        </li>
      ))}
    </ul>
  );
};
