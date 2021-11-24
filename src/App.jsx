import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { combineReducers } from "redux";

const initialState = {
  entities: [],
  filter: "all", // complete
};

export const filterReducer = (state = "all", action) => {
  switch (action.type) {
    case "filter/set":
      return action.payload;
    default:
      return state;
  }
};
export const todoReducer = (state = [], action) => {
  switch (action.type) {
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

/* export const reducer = (state = initialState, action) => {
  return {
    entities: todoReducer(state.entities, action),
    filter: filterReducer(state.filter, action),
  };
}; */


export const reducer = combineReducers({
  entities: todoReducer,
  filter: filterReducer,
});

/* export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "todo/add": {
      return {
        ...state,
        entities: state.entities.concat({ ...action.payload }),
      };
    }
    case "todo/complete": {
      const newTodos = state.entities.map((todo) => {
        if (todo.id === action.payload.id) {
          return {
            ...todo,
            complete: !todo.complete,
          };
        }
        return todo;
      });
      return {
        ...state,
        entities: newTodos,
      };
    }
    case "filter/set": {
      return {
        ...state,
        filter: action.payload,
      };
    }
  }
  return state;
}; */

/* funcion */
const selectTodo = (state) => {
  const { entities, filter } = state;
  if (filter === "complete") {
    return entities.filter((todo) => todo.complete);
  }
  if (filter === "incomplete") {
    return entities.filter((todo) => !todo.complete);
  }
  return entities;
};

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
      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
};

export default App;
