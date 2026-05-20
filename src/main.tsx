
  import { createRoot } from "react-dom/client";
  import App from "./app/App";
  import "./styles/index.css";
  import {BrowserRouter} from "react-router";
  import {ScrollToTop} from "./app/components/ScrollToTop";

  console.log("Hello World!");

  createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <ScrollToTop/>
      <App />
    </BrowserRouter>
  );
  