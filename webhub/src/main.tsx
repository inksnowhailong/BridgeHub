import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import AppLayout from "./layout/AppLayout.tsx";
import "./index.less";
import "virtual:uno.css";
import Publisher from "./Publisher/Publisher.tsx";
import Subscribers from "./Subscribers/Subscribers.tsx";
import Home from "./Home.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="Publisher" element={<Publisher />} />
          <Route path="Subscribers" element={<Subscribers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
