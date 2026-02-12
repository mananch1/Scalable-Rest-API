
import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLogin = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        const result = await login(data.email, data.password);
        if (result.success) {
            if (result.user?.role !== 'admin') {
                toast.error('Access Denied: You are not an admin.');
                // Optionally logout immediately if you want to enforce strict role separation
                return;
            }
            toast.success('Admin access granted.');
            navigate('/dashboard');
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="auth-wrapper admin-theme">
            <ToastContainer theme="dark" position="top-right" />
            <div className="card auth-card">
                {/* Admin Specific Header Color */}
                <div className="admin-header-strip"></div>

                <div className="mb-6 text-center">
                    <div className="admin-restricted-access-badge">RESTRICTED ACCESS</div>
                    <h1 className="admin-portal-title">Admin Portal</h1>
                    <p className="text-secondary">Secure System Login</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="admin-label">Admin Email</label>
                        <input
                            {...register("email", { required: "Email is required" })}
                            type="email"
                            className="input admin-input"
                            placeholder="admin@primetrade.ai"
                        />
                        <div className="input-error-message-container">
                            {errors.email && <span className="input-error-message">{errors.email.message}</span>}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="admin-label">Password</label>
                        <input
                            {...register("password", { required: "Password is required" })}
                            type="password"
                            className="input admin-input"
                            placeholder="••••••••"
                        />
                        <div className="input-error-message-container">
                            {errors.password && <span className="input-error-message">{errors.password.message}</span>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full admin-button"
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : 'Enter Admin Console'}
                    </button>
                </form>

                <div className="text-center auth-footer">
                    <p className="text-secondary">
                        <Link to="/login">Return to User Login</Link>
                    </p>
                    <p className="text-secondary mt-4 opacity-50">
                        <Link to="/admin/register">Register New Admin</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
