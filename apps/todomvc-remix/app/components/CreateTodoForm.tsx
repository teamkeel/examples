export const CreateTodoForm = () => (
  <form action="/?index" className="grid" method="post">
    <input type="hidden" name="action" value="create" />
    <label>
      <input type="text" name="todo" placeholder="What needs to be done?" />
    </label>
    <button>Add</button>
  </form>
);
