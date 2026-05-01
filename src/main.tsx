
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import "./styles/grid-layout.css";

  console.log("Hello World!");

  createRoot(document.getElementById("root")!).render(<App />);
  