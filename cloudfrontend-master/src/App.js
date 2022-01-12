import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";
import AdminHome from "./pages/AdminHome";
import AdminLogin from "./pages/AdminLogin";
import ClientHome from "./pages/ClientHome";
import Home from "./pages/Home";
import ListProvider from "./pages/ListProvider";
import Login from "./pages/Login";
import ProviderDetails from "./pages/ProviderDetails";
import ProviderHome from "./pages/ProviderHome";
import Services from "./pages/Services";
import Signup from "./pages/Signup";

function App() {
  return (
    <div>
      <Router>
      <Header />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin_login" element={<AdminLogin />} />
          <Route path="/admin_home" element={<AdminHome />} />
          <Route path="/services" element={<Services />} />
          <Route path="/provider_home" element={<ProviderHome />} />
          <Route path="/list_provider/:id" element={<ListProvider />} />
          <Route path="/client_home" element={<ClientHome />} />
          <Route path="/view_provider/:id" element={<ProviderDetails />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
