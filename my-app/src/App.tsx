import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GamePage from './pages/gamePage';

const MyRoutes = () => {
  return <Routes>
        <Route index path="/play" element={<GamePage></GamePage>} />
        <Route path="/" element={<Navigate to="/play" replace />} />
      </Routes>
}

function App() {
  return (
    <BrowserRouter>
        <MyRoutes />
    </BrowserRouter>
  );
}

export default App;
