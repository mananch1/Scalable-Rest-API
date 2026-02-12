
import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const { register: registerUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        const result = await registerUser(data.name, data.email, data.password);
        if (result.success) {
            toast.success('Account created successfully!');
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
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(90deg, var(--secondary), var(--primary))' }}></div>

                <div className="mb-6 text-center">
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'white', margin: 0 }}>Join PrimeTrade</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Create your account today</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="mb-2" style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Full Name</label>
                        <input
                            {...register("name", { required: "Name is required" })}
                            type="text"
                            className="input"
                            placeholder="John Doe"
                        />
                        <div style={{ minHeight: '1.25rem', marginTop: '0.25rem' }}>
                            {errors.name && <span style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{errors.name.message}</span>}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="mb-2" style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email</label>
                        <input
                            {...register("email", { required: "Email is required" })}
                            type="email"
                            className="input"
                            placeholder="name@company.com"
                        />
                        <div style={{ minHeight: '1.25rem', marginTop: '0.25rem' }}>
                            {errors.email && <span style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{errors.email.message}</span>}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="mb-2" style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Password</label>
                        <input
                            {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                            type="password"
                            className="input"
                            placeholder="••••••••"
                        />
                        <div style={{ minHeight: '1.25rem', marginTop: '0.25rem' }}>
                            {errors.password && <span style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{errors.password.message}</span>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        style={{ marginTop: '0.5rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="text-center" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--surface-border)' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Already have an account? <Link to="/login" style={{ fontWeight: '600' }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
