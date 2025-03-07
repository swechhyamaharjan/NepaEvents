import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaTrashAlt } from "react-icons/fa";

const AdminCategory = () => {
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]); 

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/category", {
        name: category,
      });

      // Add new category to local state
      setCategories([...categories, { id: categories.length + 1, name: category }]);

      toast.success(response.data.message);
      setShowModal(false);
      setCategory("");
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Failed to add category");
    }
  }

  // Handle category deletion
  const handleDeleteCategory = (categoryId) => {
    setCategories(categories.filter((cat) => cat.id !== categoryId));
    toast.success("Category deleted successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-4xl font-bold text-center text-[#ED4A43] mb-8">
        Manage Categories
      </h2>

      {/* Add Category Button */}
      <div className="mb-8 text-right">
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#ED4A43] text-white px-6 py-2 rounded-lg hover:bg-[#D43C35]"
        >
          Add New Category
        </button>
      </div>

      {/* Category List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow relative">
            <h3 className="text-xl font-semibold text-gray-800 mb-1">
              {cat.name}
            </h3>

            {/* Delete Button */}
            <div className="absolute top-4 right-4 flex space-x-4">
              <button
                onClick={() => handleDeleteCategory(cat.id)}
                className="bg-[#ED4A43] text-white p-2 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
              >
                <FaTrashAlt size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Adding Category */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h3 className="text-3xl font-semibold text-center text-[#ED4A43] mb-4">
              Add New Category
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">
                  Category Name
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#ED4A43] text-white rounded-md"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategory;
