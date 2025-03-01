'use client'

import { useState, useMemo } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { BiSort } from "react-icons/bi";

interface User {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
}

interface SortConfig {
  key: keyof User | null;
  direction: "asc" | "desc";
}

const UserAccountTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: "asc" });

  const mockUsers: User[] = [
    { id: 1, username: "john_doe", email: "john@example.com", isAdmin: true },
    { id: 2, username: "jane_smith", email: "jane@example.com", isAdmin: false },
    { id: 3, username: "robert_johnson", email: "robert@example.com", isAdmin: true },
    { id: 4, username: "sarah_williams", email: "sarah@example.com", isAdmin: false },
    { id: 5, username: "michael_brown", email: "michael@example.com", isAdmin: true },
    { id: 6, username: "emily_davis", email: "emily@example.com", isAdmin: false },
    { id: 7, username: "david_miller", email: "david@example.com", isAdmin: true },
    { id: 8, username: "lisa_anderson", email: "lisa@example.com", isAdmin: false },
    { id: 9, username: "james_wilson", email: "james@example.com", isAdmin: true },
    { id: 10, username: "emma_taylor", email: "emma@example.com", isAdmin: false },
  ];

  const itemsPerPage = 5;

  const sortData = (data: User[], sortConfig: SortConfig): User[] => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key!] > b[sortConfig.key!]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const handleSort = (key: keyof User) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredUsers = useMemo(() => {
    return mockUsers.filter(
        (user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.isAdmin.toString().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const sortedUsers = useMemo(() => sortData(filteredUsers, sortConfig), [filteredUsers, sortConfig]);

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + itemsPerPage);

  return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">User Accounts</h2>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full table-auto">
            <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {["id", "username", "email", "isAdmin"].map((key) => (
                  <th
                      key={key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort(key as keyof User)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{key === "isAdmin" ? "Admin Status" : key}</span>
                      <BiSort className="text-gray-400" />
                    </div>
                  </th>
              ))}
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => (
                    <tr
                        key={user.id}
                        className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors duration-200 cursor-pointer`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isAdmin ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                      </td>
                    </tr>
                ))
            ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500 text-sm">
                    No users found
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedUsers.length)} of{" "}
            {sortedUsers.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors duration-200"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
            <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors duration-200"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
  );
};

export default UserAccountTable;
