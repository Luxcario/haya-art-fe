import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import CatalogDetail from './pages/CatalogDetail';
import Booking from './pages/Booking';
import AdminDashboard from './pages/admin/AdminDashboard';
import MyOrders from './pages/MyOrders';
import AdminCatalog from './pages/admin/AdminCatalog';
import AdminCategory from './pages/admin/AdminCategory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/theme/:id" element={<CatalogDetail />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/admin-catalog" element={<AdminCatalog />} />
        <Route path="/admin-category" element={<AdminCategory />} />
      </Routes>
    </Router>
  );
}

export default App;