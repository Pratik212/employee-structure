"use client";

import { useState, useEffect } from "react";

export default function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formActive, setFormActive] = useState(false);

  // New employee form state
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    position: "",
    departmentId: "",
    locationId: "",
    managerId: "",
    hireDate: new Date().toISOString().split('T')[0],
    salary: "",
    isActive: true
  });

  // Fetch employees, departments, locations and managers
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch employees
        const empResponse = await fetch("/api/employee");
        if (!empResponse.ok) throw new Error(`Error fetching employees: ${empResponse.status}`);
        const empData = await empResponse.json();
        setEmployees(empData);

        // Fetch departments
        const deptResponse = await fetch("/api/departments");
        if (!deptResponse.ok) throw new Error(`Error fetching departments: ${deptResponse.status}`);
        const deptData = await deptResponse.json();
        setDepartments(deptData);

        // Fetch locations
        const locResponse = await fetch("/api/locations");
        if (!locResponse.ok) throw new Error(`Error fetching locations: ${locResponse.status}`);
        const locData = await locResponse.json();
        setLocations(locData);

        // Set managers (existing employees who can be managers)
        setManagers(empData.filter(emp => emp.isActive));

      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployee({
      ...employee,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employee),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add employee");
      }

      const newEmployee = await response.json();

      // Update employees list and managers list
      setEmployees([...employees, newEmployee]);
      if (newEmployee.isActive) {
        setManagers([...managers, newEmployee]);
      }

      // Reset form
      setEmployee({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        position: "",
        departmentId: "",
        locationId: "",
        managerId: "",
        hireDate: new Date().toISOString().split('T')[0],
        salary: "",
        isActive: true
      });

      // Close form
      setFormActive(false);

    } catch (error) {
      console.error("Error adding employee:", error);
      alert(`Error adding employee: ${error.message}`);
    }
  };

  // Toggle add employee form
  const toggleForm = () => {
    setFormActive(!formActive);
  };

  return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>
          <button
              onClick={toggleForm}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            {formActive ? (
                <>Cancel</>
            ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Employee
                </>
            )}
          </button>
        </div>

        {/* Add Employee Form */}
        {formActive && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-teal-700">Add New Employee</h2>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Personal Information */}
                  <div>
                    <label className="block text-gray-700 mb-1">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={employee.firstName}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={employee.lastName}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={employee.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={employee.password}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                    />
                  </div>

                  {/* Job Information */}
                  <div>
                    <label className="block text-gray-700 mb-1">Position</label>
                    <input
                        type="text"
                        name="position"
                        value={employee.position}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Department</label>
                    <select
                        name="departmentId"
                        value={employee.departmentId}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Location</label>
                    <select
                        name="locationId"
                        value={employee.locationId}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                    >
                      <option value="">Select Location</option>
                      {locations.map(loc => (
                          <option key={loc.id} value={loc.id}>{loc.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Manager</label>
                    <select
                        name="managerId"
                        value={employee.managerId}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">No Manager</option>
                      {managers.map(mgr => (
                          <option key={mgr.id} value={mgr.id}>{mgr.firstName} {mgr.lastName}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Hire Date</label>
                    <input
                        type="date"
                        name="hireDate"
                        value={employee.hireDate}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Salary</label>
                    <input
                        type="number"
                        name="salary"
                        value={employee.salary}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                        step="0.01"
                        min="0"
                        required
                    />
                  </div>

                  <div className="flex items-center mt-4">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={employee.isActive}
                        onChange={handleChange}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-gray-700">Active Employee</label>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                      type="button"
                      onClick={toggleForm}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2"
                  >
                    Cancel
                  </button>
                  <button
                      type="submit"
                      className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md"
                  >
                    Add Employee
                  </button>
                </div>
              </form>
            </div>
        )}

        {/* Employees List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-teal-600 text-white">
            <h2 className="text-xl font-semibold">Employees List</h2>
          </div>

          {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading employees data...</p>
              </div>
          ) : error ? (
              <div className="p-6 text-center text-red-600">
                <p>{error}</p>
              </div>
          ) : employees.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>No employees found. Add your first employee using the button above.</p>
              </div>
          ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((emp) => {
                    const department = departments.find(d => d.id === emp.departmentId)?.name || "N/A";
                    const location = locations.find(l => l.id === emp.locationId)?.name || "N/A";

                    return (
                        <tr key={emp.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
                            <span className="text-teal-700 font-medium">
                              {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                            </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{emp.firstName} {emp.lastName}</div>
                                <div className="text-sm text-gray-500">{emp.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.position}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{department}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${emp.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {emp.isActive ? 'Active' : 'Inactive'}
                        </span>
                          </td>
                        </tr>
                    );
                  })}
                  </tbody>
                </table>
              </div>
          )}
        </div>
      </div>
  );
}