import { SerializeFrom } from "@remix-run/node";
import { Todo } from "keelClient";

type Props = {
  todos: SerializeFrom<Todo[]>;
};
export const Todos = ({ todos }: Props) => {
  const checkTodo = (id: string, checked: "true" | "false") => {
    fetch("/?index", {
      method: "POST",
      body: new URLSearchParams({
        action: "update",
        checked,
        id,
      }),
    });
  };
  // @todo error handling

  return (
    <ul>
      {todos.map((t) => (
        <li key={t.id}>
          <label>
            <input
              type="checkbox"
              onClick={() =>
                checkTodo(t.id, String(!t.completed) as "true" | "false")
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
