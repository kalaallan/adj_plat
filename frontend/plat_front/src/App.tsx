import {} from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Examen from './pages/Examen';
import Workspace from './pages/Workspace';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/Examen" element={
          <ProtectedRoute>
            <Examen />
          </ProtectedRoute>
        } />

        <Route path="/Workspace" element={
        <ProtectedRoute>
          <Workspace />
        </ProtectedRoute>
        } />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;