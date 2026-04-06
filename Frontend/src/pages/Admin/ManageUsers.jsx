import { useEffect, useState } from 'react';
import { getUsers, changeUserRole, deleteUser, adminCreateUser } from '../../api/admin';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(20);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    user_type: 'student',
    institution_id: ''
  });

  const fetchUsers = async (currentPage) => {
    setLoading(true);
    try {
      const res = await getUsers(currentPage, limit);
      setUsers(res.data.data);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleRoleChange = async (userId, role) => {
    await changeUserRole(userId, role);
    fetchUsers(page);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Delete user?')) {
      await deleteUser(userId);
      fetchUsers(page);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await adminCreateUser(formData);
      setShowModal(false);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        user_type: 'student',
        institution_id: ''
      });
      fetchUsers(page);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to create user');
    }
  };

  if (loading) return <div className="p-6">Loading users...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create New User
        </button>
      </div>

      {/* Create User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New User</h2>
            <form onSubmit={handleCreateUser}>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="First Name *"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  className="w-full border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full border p-2 rounded"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone *"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full border p-2 rounded"
                  required
                />
                <input
                  type="password"
                  placeholder="Password *"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full border p-2 rounded"
                  required
                />
                <select
                  value={formData.user_type}
                  onChange={(e) => setFormData({...formData, user_type: e.target.value})}
                  className="w-full border p-2 rounded"
                >
                  <option value="student">Student</option>
                  <option value="professional">Professional</option>
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                </select>
                {formData.user_type === 'student' && (
                  <input
                    type="number"
                    placeholder="Institution ID"
                    value={formData.institution_id}
                    onChange={(e) => setFormData({...formData, institution_id: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                )}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto border rounded">
        <table className="min-w-full bg-white">
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              <th className="p-3 text-left">Id</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.user_id} className="border-b hover:bg-gray-50">
                <td className="p-3">{u.user_id}</td>
                <td className="p-3">{u.first_name} {u.last_name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <select
                    value={u.user_type}
                    onChange={e => handleRoleChange(u.user_id, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="student">student</option>
                    <option value="professional">professional</option>
                    <option value="owner">owner</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="p-3">
                  <button onClick={() => handleDelete(u.user_id)} className="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
          <span className="px-3 py-1">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}