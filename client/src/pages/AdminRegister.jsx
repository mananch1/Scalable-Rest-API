
import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminRegister = () => {
    const { register: registerUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        // Role is hardcoded to 'admin' here
        const result = await registerUser(data.name, data.email, data.password, 'admin');
        if (result.success) {
            toast.success('Admin Account created successfully!');
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
                <div className="admin-header-strip"></div>

                <div className="mb-6 text-center">
                    <h1 className="admin-portal-title">Join as Admin</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Create an administrative account</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="admin-label">Full Name</label>
                        <input
                            {...register("name", { required: "Name is required" })}
                            type="text"
                            className="input admin-input"
                            placeholder="Admin Name"
                        />
                        <div className="input-error-message-container">
                            {errors.name && <span className="input-error-message">{errors.name.message}</span>}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="admin-label">Email</label>
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
                            {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 chars" } })}
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
                        {loading ? 'Creating Admin...' : 'Register Admin'}
                    </button>
                </form>

                <div className="text-center auth-footer">
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Already have an account? <Link to="/admin/login" style={{ color: '#f59e0b' }}>Admin Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminRegister;
