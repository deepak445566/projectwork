import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
        setUsers(response.data.data);
        setFilteredUsers(response.data.data); // Initialize filtered users
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [page]);

  const handleEdit = (user) => {
    setEditingUser({ ...user });
  };

  const handleSave = () => {
    setUsers(
      users.map((user) => (user.id === editingUser.id ? editingUser : user))
    );
    setEditingUser(null);
  };

  const handleDelete = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers); // Update filtered users after deletion
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = users.filter(
      (user) =>
        user.first_name.toLowerCase().includes(query.toLowerCase()) ||
        user.last_name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <div className="w-full max-w-4xl flex justify-between items-center mt-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded-md"
        >
          Logout
        </button>
      </div>

      <div className="w-full max-w-4xl mt-6">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full py-2 px-4 border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex gap-x-10 flex-wrap my-10 mx-40">
        {filteredUsers.map((user) => (
          <div key={user.id} className="w-50 h-60 p-4 bg-white rounded-md shadow mb-4">
            <img
              src={user.avatar}
              alt={`${user.first_name} ${user.last_name}`}
              className="w-20 h-20 rounded-full flex justify-center"
            />
            {editingUser?.id === user.id ? (
              <div className="flex flex-col flex-grow mt-6">
                <input
                  type="text"
                  value={editingUser.first_name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, first_name: e.target.value })
                  }
                />
                <input
                  type="text"
                  value={editingUser.last_name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, last_name: e.target.value })
                  }
                />
                <div className="flex space-x-2 mt-7">
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white py-1 px-3 rounded-md"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingUser(null)}
                    className="bg-gray-400 text-white py-1 px-3 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-grow">
                <h2 className="font-bold mt-4">{`${user.first_name} ${user.last_name}`}</h2>
                <p className="text-sm mt-1 text-gray-500">{user.email}</p>
                <div className="mt-8 flex space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-blue-500 text-white py-1 px-3 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between w-full max-w-4xl mt-4">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="bg-blue-500 text-white py-2 px-4 rounded-md disabled:bg-gray-300"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="bg-blue-500 text-white py-2 px-4 rounded-md disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersPage;
