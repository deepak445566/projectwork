import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import LoginPage from "./Components/Login/LoginPage";
import UsersPage from "./Components/user/UsersPage";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  return (
  
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />
      </Routes>
  
  );
};

export default App;
