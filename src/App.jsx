import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { combineReducers } from "redux";

export const asyncMiddleware = (store) => (next) => (action) => {
  if (typeof action === "function") {
    return action(store.dispatch, store.getState);
  }
  return next(action);
};
export const fetchThunk = () => async (dispatch) => {
  dispatch({ type: "todo/pending" });
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await response.json();
    const todos = data.slice(0, 10);
    console.log(todos);
    dispatch({ type: "todos/fulfilled", payload: todos });
  } catch (e) {
    dispatch({ type: "todos/error", error: e.message });
  }
};
export const filterReducer = (state = "all", action) => {
  switch (action.type) {
    case "filter/set":
      return action.payload;
    default:
      return state;
  }
};
const initialFetching = { loading: "idle", error: null };
export const fetchingReducer = (state = initialFetching, action) => {
  switch (action.type) {
    case "todos/pending":
      return { ...state, loading: "pending" };
    case "todos/fullfilled":
      return { ...state, loading: "succeded" };
    case "todos/error":
      return { error: action.error, loading: "rejected" };
    default: {
      return state;
    }
  }
};
export const todoReducer = (state = [], action) => {
  switch (action.type) {
    case "todos/fulfilled": {
      return action.payload;
    }
    case "todo/add": {
      return state.concat({ ...action.payload });
    }
    case "todo/complete": {
      const newTodos = state.map((todo) => {
        if (todo.id === action.payload.id) {
          return {
            ...todo,
            complete: !todo.complete,
          };
        }
        return todo;
      });
      return newTodos;
    }
    default:
      return state;
  }
};
export const reducer = combineReducers({
  todos: combineReducers({
    entities: todoReducer,
    status: fetchingReducer,
  }),
  filter: filterReducer,
});

/* funcion */
const selectTodo = (state) => {
  const {
    todos: { entities },
    filter,
  } = state;
  if (filter === "complete") {
    return entities.filter((todo) => todo.complete);
  }
  if (filter === "incomplete") {
    return entities.filter((todo) => !todo.complete);
  }
  return entities;
};

/* Una forma de seleccionar la data en una funcion mas rapido */
const selectStatus = (state) => state.todos.status;

/* componente */
const TodoItem = ({ todo }) => {
  const dispatch = useDispatch();

  return (
    <li
      style={{ textDecoration: todo.complete ? "line-through" : "none" }}
      onClick={() => dispatch({ type: "todo/complete", payload: todo })}
    >
      {todo.title}
    </li>
  );
};

const App = () => {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const todos = useSelector(selectTodo);
  const status = useSelector(selectStatus);

  const submit = (e) => {
    e.preventDefault();
    if (!value.trim()) {
      return;
    }
    const id = Math.random().toString(36);
    const todo = { title: value, complete: false, id };
    dispatch({ type: "todo/add", payload: todo });
    setValue("");
  };

  if (status.loading === "pending") {
    return <div>Cargando...</div>;
  }
  if (status.loading === "refected") {
    return <div>{status.error}</div>;
  }

  return (
    <div>
      <form onSubmit={submit}>
        <input value={value} onChange={(e) => setValue(e.target.value)} />
      </form>
      <button onClick={() => dispatch({ type: "filter/set", payload: "all" })}>
        Mostrar todos
      </button>
      <button
        onClick={() => dispatch({ type: "filter/set", payload: "complete" })}
      >
        Completados
      </button>
      <button
        onClick={() => dispatch({ type: "filter/set", payload: "incomplete" })}
      >
        Incompletados
      </button>
      <button onClick={() => dispatch(fetchThunk())}>Fetch</button>
      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
};

export default App;
