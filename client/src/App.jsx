import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./screens/Home.jsx";
import NodeSelector from "./screens/NodeSelector.jsx";
import Loading from "./screens/Loading.jsx";
import Exercise from "./screens/Exercise.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/select" element={<NodeSelector />} />
        <Route path="/loading/:sessionId" element={<Loading />} />
        <Route path="/session/:sessionId" element={<Exercise />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
