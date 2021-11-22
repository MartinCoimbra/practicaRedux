import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const initialState = {
  entities: [],
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "todo/add": {
      return {
        ...state,
        entities: state.entities.concat({ ...action.payload }),
      };
    }
  }
  return state;
};

const TodoItem = ({ todo }) => {
  return <li>{todo.title}</li>;
};

const App = () => {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const state = useSelector((x) => x);

  console.log({ state });

  const submit = (e) => {
    e.preventDefault();
    if (!value.trim()) {
      return;
    }
    const id = Math.random().toString(36);
    const todo = { title: value, completed: false, id };
    dispatch({ type: "todo/add", payload: todo });
    setValue("");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <input value={value} onChange={(e) => setValue(e.target.value)} />
      </form>
      <button onClick={() => dispatch({ type: "todo/add" })}>
        Mostrar todos
      </button>
      <button>Completados</button>
      <button>Incompletados</button>
      <ul>
        {state.entities.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
};

export default App;
