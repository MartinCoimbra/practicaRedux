import { combineReducers } from "redux";
import {
  makeFetchingReducer,
  makeSetReducer,
  reduceReducers,
  makeCrudReducer,
  mac,
} from "./utils.js";
export const setPending = mac("todos/pending");
/*dispatch({ type: "todo/pending" });*/
export const setFulfilled = mac("todos/fulfilled", "payload");
/* dispatch({ type: "todos/fulfilled", payload: todos }); */
export const setError = mac("todos/error", "error");
export const setComplete = mac("todo/complete", "payload");
export const setFilter = mac("filter/set", "payload");
export const fetchThunk = () => async (dispatch) => {
  dispatch(setPending());
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await response.json();
    const todos = data.slice(0, 10);
    dispatch(setFulfilled(todos));
  } catch (e) {
    dispatch(setError(e.message));
  }
};

export const filterReducer = makeSetReducer(["filter/set"]);

export const fetchingReducer = makeFetchingReducer([
  "todos/pending",
  "todos/fulfilled",
  "todos/rejected",
]);

const fulfilledReducer = makeSetReducer(["todos/fulfilled"]);

const crudReducer = makeCrudReducer(["todo/add", "todo/complete"]);

export const todoReducer = reduceReducers(crudReducer, fulfilledReducer);

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
