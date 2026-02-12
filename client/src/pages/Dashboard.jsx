
import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import {
    LayoutDashboard,
    CheckSquare,
    Settings,
    LogOut,
    Plus,
    Search,
    Bell,
    MoreVertical,
    Clock,
    Briefcase,
    Calendar,
    ChevronRight,
    User,
    Trash2
} from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { register, handleSubmit, reset } = useForm();

    const [userFilter, setUserFilter] = useState('all');

    const fetchTasks = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/tasks');
            setTasks(data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load tasks');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const onCreateTask = async (data) => {
        try {
            await axios.post('http://localhost:5000/api/tasks', data);
            toast.success('Task created successfully');
            reset();
            setIsFormOpen(false);
            fetchTasks();
        } catch (error) {
            toast.error('Failed to create task');
        }
    };

    const onDeleteTask = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm('Delete this task?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${id}`);
            toast.success('Task deleted');
            setTasks(tasks.filter(t => t._id !== id));
        } catch (error) {
            toast.error('Failed to delete task');
        }
    };

    const onToggleStatus = async (task, e) => {
        if (e) e.stopPropagation();

        if (user?.role === 'admin') {
            toast.error("Admins cannot change task status.");
            return;
        }

        try {
            const newStatus = task.status === 'completed' ? 'pending' : 'completed';
            setTasks(tasks.map(t => t._id === task._id ? { ...t, status: newStatus } : t));
            await axios.put(`http://localhost:5000/api/tasks/${task._id}`, { status: newStatus });
        } catch (error) {
            toast.error('Failed to update task');
            fetchTasks();
        }
    };

    // Extract unique users for filter (only for admins)
    const uniqueUsers = user?.role === 'admin'
        ? [...new Set(tasks.map(t => t.user?.name).filter(Boolean))]
        : [];

    const filteredTasks = tasks.filter(task => {
        const matchesFilter = filter === 'all' || task.status === filter;
        const matchesUser = userFilter === 'all' || task.user?.name === userFilter;
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesFilter && matchesSearch && matchesUser;
    });

    // Calculate Stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <div className="app-layout">
            <ToastContainer theme="dark" position="bottom-right" />

            {/* Sidebar Navigation */}
            <aside className="sidebar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
                        P
                    </div>
                    <span className="logo-text" style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'var(--font-heading)', color: 'white' }}>PrimeTrade</span>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <NavItem icon={LayoutDashboard} label="Dashboard" active />
                </nav>

                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--surface-border)', paddingTop: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                            <User size={20} />
                        </div>
                        <div className="logo-text">
                            <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>{user?.name}</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user?.email}</p>
                        </div>
                    </div>
                    <button onClick={logout} className="btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '0.5rem' }}>
                        <LogOut size={18} style={{ marginRight: '0.75rem' }} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">

                {/* Top Header */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>Welcome back, {user?.name.split(' ')[0]}</h1>
                        <p style={{ margin: '0.5rem 0 0', color: 'var(--text-secondary)' }}>Here's what's happening today.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                className="input-premium"
                                style={{ paddingLeft: '2.5rem', width: '250px' }}
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="btn-ghost" style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Bell size={20} />
                        </button>
                        <button
                            onClick={() => setIsFormOpen(!isFormOpen)}
                            className="btn-premium"
                        >
                            <Plus size={18} style={{ marginRight: '0.5rem' }} /> New Task
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                    <StatCard title="Total Tasks" value={totalTasks} icon={Briefcase} color="var(--primary)" delay={0} />
                    <StatCard title="Pending" value={pendingTasks} icon={Clock} color="var(--warning)" delay={100} />
                    <StatCard title="Completed" value={completedTasks} icon={CheckSquare} color="var(--success)" delay={200} />
                    <div className="glass-card animate-fade-in delay-300" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2))' }}>
                        <span style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>{completionRate}%</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Completion Rate</span>
                    </div>
                </div>

                {/* Filter Navigation */}
                <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid var(--surface-border)', marginBottom: '2rem', paddingBottom: '0.5rem', alignItems: 'center' }}>
                    <FilterTab label="All Tasks" active={filter === 'all'} onClick={() => setFilter('all')} />
                    <FilterTab label="Pending" active={filter === 'pending'} onClick={() => setFilter('pending')} />
                    <FilterTab label="Completed" active={filter === 'completed'} onClick={() => setFilter('completed')} />

                    {/* Admin User Filter */}
                    {user?.role === 'admin' && (
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Filter by User:</span>
                            <select
                                value={userFilter}
                                onChange={(e) => setUserFilter(e.target.value)}
                                className="input-premium"
                                style={{ width: 'auto', padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}
                            >
                                <option value="all">All Users</option>
                                {uniqueUsers.map(u => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>

                    {/* Task List */}
                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {loading ? (
                            <p style={{ color: 'var(--text-secondary)' }}>Loading your workspace...</p>
                        ) : filteredTasks.length === 0 ? (
                            <div style={{ padding: '4rem', textAlign: 'center', background: 'var(--surface-light)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--surface-border)' }}>
                                <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                    <Briefcase size={24} color="var(--text-secondary)" />
                                </div>
                                <h3>No tasks found</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Create a new task to get started.</p>
                            </div>
                        ) : (
                            filteredTasks.map((task, index) => (
                                <div key={task._id} className="glass-card animate-fade-in" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animationDelay: `${index * 50}ms` }} onClick={() => onToggleStatus(task)}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <button
                                            className={`btn-ghost ${task.status === 'completed' ? 'text-success' : 'text-secondary'}`}
                                            style={{
                                                padding: 0,
                                                borderRadius: '50%',
                                                cursor: user?.role === 'admin' ? 'not-allowed' : 'pointer',
                                                opacity: user?.role === 'admin' ? 0.5 : 1
                                            }}
                                        >
                                            {task.status === 'completed' ? <CheckSquare size={24} color="var(--success)" /> : <div style={{ width: '22px', height: '22px', border: '2px solid var(--text-secondary)', borderRadius: '6px' }}></div>}
                                        </button>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', textDecoration: task.status === 'completed' ? 'line-through' : 'none', color: task.status === 'completed' ? 'var(--text-secondary)' : 'var(--text)', transition: 'all 0.2s' }}>{task.title}</h4>
                                            {task.description && <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{task.description}</p>}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span className={`badge ${task.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                                            {task.status === 'pending' ? 'In Progress' : 'Done'}
                                        </span>
                                        {user?.role === 'admin' && (
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{task.user?.name || 'User'}</span>
                                        )}
                                        <button
                                            onClick={(e) => onDeleteTask(task._id, e)}
                                            className="btn-ghost"
                                            style={{ color: 'var(--error)', opacity: 0.6 }}
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Right Panel - Add Task Form (Conditional) */}
                    <div className={`animate-fade-in ${isFormOpen ? 'd-block' : 'd-none'}`} style={{ animationDelay: '0.2s' }}>
                        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', position: 'sticky', top: '2rem' }}>
                            <h3 style={{ margin: '0 0 1.5rem' }}>Create New Task</h3>
                            <form onSubmit={handleSubmit(onCreateTask)}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Title</label>
                                    <input {...register("title", { required: true })} className="input-premium" autoFocus />
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Description</label>
                                    <textarea {...register("description")} className="input-premium" rows="4" style={{ resize: 'none' }}></textarea>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button type="button" onClick={() => setIsFormOpen(false)} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
                                    <button type="submit" className="btn-premium" style={{ flex: 1 }}>Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// Helper Components
const NavItem = ({ icon: Icon, label, active }) => (
    <button className="btn-ghost" style={{
        width: '100%',
        justifyContent: 'flex-start',
        padding: '0.85rem 1rem',
        borderRadius: 'var(--radius-md)',
        background: active ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.1), transparent)' : 'transparent',
        color: active ? 'var(--primary)' : 'var(--text-secondary)',
        borderLeft: active ? '3px solid var(--primary)' : '3px solid transparent'
    }}>
        <Icon size={20} style={{ marginRight: '0.75rem' }} /> {label}
    </button>
);

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
    <div className="glass-card animate-fade-in" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', animationDelay: `${delay}ms` }}>
        <div style={{ padding: '0.6rem', borderRadius: '12px', background: `rgba(255,255,255,0.05)`, color: color }}>
            <Icon size={20} />
        </div>
        <div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{title}</p>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>{value}</h2>
        </div>
    </div>
);

const FilterTab = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        style={{
            background: 'none',
            border: 'none',
            padding: '0.5rem 0',
            color: active ? 'var(--text)' : 'var(--text-secondary)',
            borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent',
            cursor: 'pointer',
            fontWeight: active ? '600' : '400',
            transition: 'all 0.2s'
        }}
    >
        {label}
    </button>
);

export default Dashboard;
