
import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        // Introduce a small artificial delay to preventing jerky loaders if response is instant
        // await new Promise(r => setTimeout(r, 500)); 

        const result = await login(data.email, data.password);
        if (result.success) {
            toast.success('Logged in successfully!');
            navigate('/dashboard');
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="auth-wrapper">
            <ToastContainer theme="dark" position="top-right" />
            <div className="card auth-card">
                {/* Decorative header */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }}></div>

                <div className="mb-6 text-center">
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>PrimeTrade</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Sign in to your dashboard</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="mb-2" style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email Address</label>
                        <input
                            {...register("email", { required: "Email is required" })}
                            type="email"
                            className="input"
                            placeholder="name@company.com"
                            autoComplete="email"
                        />
                        {/* Reserve space for error to prevent layout shift */}
                        <div style={{ minHeight: '1.25rem', marginTop: '0.25rem' }}>
                            {errors.email && <span style={{ color: 'var(--error)', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>{errors.email.message}</span>}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="mb-2" style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Password</label>
                        <input
                            {...register("password", { required: "Password is required" })}
                            type="password"
                            className="input"
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                        <div style={{ minHeight: '1.25rem', marginTop: '0.25rem' }}>
                            {errors.password && <span style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{errors.password.message}</span>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={loading}
                        style={{ marginTop: '0.5rem' }}
                    >
                        {loading ? (
                            <span className="d-flex justify-center gap-2">
                                <span style={{ width: '16px', height: '16px', border: '2px solid white', borderBottomColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }}></span>
                                Signing In...
                            </span>
                        ) : 'Sign In'}
                    </button>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </form>

                <div className="text-center" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--surface-border)' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Don't have an account? <Link to="/register" style={{ fontWeight: '600' }}>Sign up</Link>
                    </p>
                    <p style={{ fontSize: '0.8rem', marginTop: '1rem', opacity: 0.7 }}>
                        <Link to="/admin/login">Login as Admin</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
