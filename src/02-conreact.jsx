import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const reducer = (state = 0, action) => {
  console.log({ action });
  switch (action.type) {
    case "incrementar": {
      return state + 1;
    }
    case "decrementar": {
      return state - 1;
    }
    case "set": {
      return action.payload;
    }
    case "sumar": {
      return (state += action.payload);
    }
    default:
      return state;
  }
};

const App = () => {
  const [valor, setValor] = useState("");
  const dispatch = useDispatch();
  /* Leemos el valor */
  const state = useSelector((state) => state);
  const set = () => {
    dispatch({ type: "set", payload: valor });
    setValor("");
  };
  const sumar = () => {
    dispatch({ type: "sumar", payload: valor });
    setValor("");
  };
  return (
    <div>
      <p>Contador: {state}</p>
      <button onClick={() => dispatch({ type: "incrementar" })}>
        Incrementar
      </button>
      <button onClick={() => dispatch({ type: "decrementar" })}>
        Decrementar
      </button>
      <button onClick={set}>Set</button>
      <button onClick={sumar}>Sumar</button>
      <input value={valor} onChange={(e) => setValor(Number(e.target.value))} />
    </div>
  );
};

export default App;
