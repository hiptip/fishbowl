import './App.css';
import { useRoutes } from "hookrouter";
import routes from "./router";

function App() {
  const routeResult = useRoutes(routes);
  return routeResult;
}

export default App;
