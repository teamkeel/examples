import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div>
      <header>
        <h1>
          Keel Logo x <span>TodoMVC</span>
        </h1>
      </header>
      <main>
        <form>
          <label>
            <input type="text" placeholder="What needs to be done?" />
          </label>
          <button>Add</button>
        </form>
        <div>
          <ul>
            <li>
              <label>
                <input type="checkbox" />
                <span>Buy milk</span>
              </label>
              <button>Remove</button>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                <span>Buy eggs</span>
              </label>
              <button>Remove</button>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                <span>Buy bread</span>
              </label>
              <button>Remove</button>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
