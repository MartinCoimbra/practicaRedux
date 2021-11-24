import { combineReducers } from "redux";
import { makeFetchingReducer, makeSetReducer } from "./utils.js";
export const setPending = () => {
  return {
    type: "todos/pending",
  };
};
/*dispatch({ type: "todo/pending" });*/

export const setFulfilled = (payload) => ({ type: "todos/fulfilled", payload });
/* dispatch({ type: "todos/fulfilled", payload: todos }); */
export const setError = (e) => ({ type: "todos/error", error: e.message });
export const setComplete = (payload) => ({ type: "todo/complete", payload });
export const setFilter = (payload) => ({ type: "filter/set", payload });

export const fetchThunk = () => async (dispatch) => {
  dispatch(setPending());
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await response.json();
    const todos = data.slice(0, 10);
    dispatch(setFulfilled(todos));
  } catch (e) {
    dispatch(setError());
  }
};

export const filterReducer = makeSetReducer(["filter/set"]);

export const fetchingReducer = makeFetchingReducer([
  "todos/pending",
  "todos/fulfilled",
  "todos/rejected",
]);

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

/* SELECTORES */
/* funcion */
export const selectTodo = (state) => {
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
export const selectStatus = (state) => state.todos.status;
