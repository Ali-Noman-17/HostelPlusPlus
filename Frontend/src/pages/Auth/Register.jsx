import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', password: '', user_type: 'student' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold">Register</h2>
        {error && <div className="text-red-500">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="First Name" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} required className="w-full p-2 border rounded" />
          <input type="text" placeholder="Last Name" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} className="w-full p-2 border rounded" />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="w-full p-2 border rounded" />
          <input type="tel" placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required className="w-full p-2 border rounded" />
          <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required className="w-full p-2 border rounded" />
          <select value={form.user_type} onChange={e => setForm({...form, user_type: e.target.value})} className="w-full p-2 border rounded">
            <option value="student">Student</option>
            <option value="professional">Professional</option>
            <option value="owner">Owner</option>
          </select>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Register</button>
        </form>
        <p className="text-center">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
      </div>
    </div>
  );
}