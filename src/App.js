import './App.css';
import Header from "./components/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignupSignin from "./pages/signup";
import Dashboard from "./pages/dashboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
    <ToastContainer /> 
    <Router>
      <Routes>
        <Route path="/" element={<SignupSignin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
