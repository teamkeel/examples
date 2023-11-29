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
        <li key={t.id}>
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
          <form method="POST" action="/?index">
            <input type="hidden" name="action" value="delete" />
            <input type="hidden" name="id" value={t.id} />
            <button>Remove</button>
          </form>
        </li>
      ))}
    </ul>
  );
};
