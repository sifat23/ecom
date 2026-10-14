import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomerLayout from './layouts/CustomerLayout';
import VendorLayout from './layouts/VendorLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public & Customer Routes */}
                <Route element={<CustomerLayout />}>
                    <Route path="/" element={<div className="text-2xl font-bold">Home Page (Public Storefront)</div>} />
                    <Route path="/login" element={<div>Login Page</div>} />
                    <Route path="/register" element={<div>Register Page</div>} />
                </Route>

                {/* Vendor Dashboard Routes */}
                <Route element={<ProtectedRoute allowedRole="vendor" requiredActor="user" />}>
                    <Route element={<VendorLayout />}>
                        <Route path="/vendor/dashboard" element={<div>Vendor Dashboard</div>} />
                    </Route>
                </Route>

                {/* Admin Dashboard Routes */}
                <Route element={<ProtectedRoute requiredActor="admin" />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
                    </Route>
                </Route>

                {/* Fallbacks */}
                <Route path="*" element={<div className="p-8 text-center text-xl">404 Not Found</div>} />
            </Routes>
        </BrowserRouter>
    );
}