import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaTrashAlt, FaPlus, FaUpload } from "react-icons/fa";

const AdminCategory = () => {
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categoryDetail, setCategoryDetail] = useState(null);

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      // Create form data to handle file upload
      const formData = new FormData();
      formData.append("name", category);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await axios.post(
        "http://localhost:3000/api/category",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message);
      setShowModal(false);
      setCategory("");
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Failed to add category");
    }
  }

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get("http://localhost:3000/api/category");
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchCategories();
  }, [categories]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete (
        `http://localhost:3000/api/category/${id}`)
        toast.success("Category deleted successfully!")
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete category");
    }
  }
  const getCategoryById = async(id) => {
    setEditModal(true);
    try {
      const response = await axios.get (
        `http://localhost:3000/api/category/${id}`)
        setCategoryDetail(response.data);
        console.log(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to get category");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold text-center text-[#ED4A43] mb-6">
        Manage Categories
      </h2>

      {/* Add Category Button */}
      <div className="mb-6 text-right">
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#ED4A43] text-white px-5 py-2 rounded-md hover:bg-[#D43C35] transition-colors flex items-center justify-center space-x-2 ml-auto"
        >
          <FaPlus size={14} />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Category List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat._id} className="bg-white rounded-md shadow-md overflow-hidden">
            {/* Image Container */}
            <div className="h-40 bg-gray-200 overflow-hidden">
              {cat.image ? (
                <img 
                  src={`http://localhost:3000/${cat.image}`} 
                  alt={cat.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            
            {/* Category Info */}
            <div className="p-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">
                {cat.name}
              </h3>
              <button 
              onClick={() => handleDelete(cat._id)}
                className="text-[#ED4A43] hover:bg-[#ED4A43] hover:text-white p-2 rounded-md transition-colors"
              >
                <FaTrashAlt size={16} />
              </button>
              <button 
              onClick={() => getCategoryById(cat._id)}
                className="text-[#ED4A43] hover:bg-[#ED4A43] hover:text-white p-2 rounded-md transition-colors"
              >
                <FaTrashAlt size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Modal for Adding Category */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full mx-4">
            <div className="border-b border-gray-200 pb-4 mb-5">
              <h3 className="text-2xl font-semibold text-[#ED4A43]">
                Add New Category
              </h3>
              <p className="text-gray-500 text-sm mt-1">Create a new category for your products</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Category Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED4A43] focus:border-[#ED4A43] transition-all"
                    placeholder="Enter category name"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-1">Choose a short, descriptive name</p>
              </div>
              
              {/* Image Upload Section */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Category Image
                </label>
                
                {/* Image Preview */}
                {imagePreview ? (
                  <div className="mb-3">
                    <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
                      <img 
                        src={imagePreview}
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                        }}
                        className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
                      >
                        <FaTrashAlt size={14} className="text-[#ED4A43]" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-3">
                    <label className="cursor-pointer block w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-[#ED4A43] transition-colors">
                      <FaUpload size={24} className="text-gray-400 mb-2" />
                      <span className="text-gray-500">Click to upload image</span>
                      <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                )}
              </div>
              
              <div className="pt-2">
                <div className="bg-gray-50 -mx-6 px-6 py-4 mt-6 flex justify-end space-x-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#ED4A43] text-white rounded-md hover:bg-[#D43C35] font-medium shadow-sm"
                  >
                    Add Category
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full mx-4">
            <div className="border-b border-gray-200 pb-4 mb-5">
              <h3 className="text-2xl font-semibold text-[#ED4A43]">
                Edit Category
              </h3>
            </div>
            
            <form className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Category Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED4A43] focus:border-[#ED4A43] transition-all"
                    placeholder="Enter category name"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-1">Choose a short, descriptive name</p>
              </div>
              
              {/* Image Upload Section */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Category Image
                </label>
                
                {/* Image Preview */}
                {imagePreview ? (
                  <div className="mb-3">
                    <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
                      <img 
                        src={imagePreview}
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                        }}
                        className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
                      >
                        <FaTrashAlt size={14} className="text-[#ED4A43]" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-3">
                    <label className="cursor-pointer block w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-[#ED4A43] transition-colors">
                      <FaUpload size={24} className="text-gray-400 mb-2" />
                      <span className="text-gray-500">Click to upload image</span>
                      <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                )}
              </div>
              
              <div className="pt-2">
                <div className="bg-gray-50 -mx-6 px-6 py-4 mt-6 flex justify-end space-x-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#ED4A43] text-white rounded-md hover:bg-[#D43C35] font-medium shadow-sm"
                  >
                    Add Category
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategory;