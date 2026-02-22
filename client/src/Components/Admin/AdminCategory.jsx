import api from "../../api/api";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaTrashAlt, FaPlus, FaUpload, FaEdit } from "react-icons/fa";

const AdminCategory = () => {
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categoryDetail, setCategoryDetail] = useState({});
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", category);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      const response = await api.post("/api/category", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(response.data.message);
      setShowModal(false);
      setCategory("");
      setImageFile(null);
      setImagePreview(null);
      setUpdateTrigger((prev) => !prev);
    } catch (error) {
      toast.error("Failed to add category");
    }
  }

  const handleImageChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setImageFile(file);
      if (isEdit) {
        setEditImagePreview(fileURL);
      } else {
        setImagePreview(fileURL);
      }
    }
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await api.get("/api/category");
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchCategories();
  }, [updateTrigger]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/category/${id}`);
      toast.success("Category deleted successfully!");
      setUpdateTrigger((prev) => !prev);
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const getCategoryById = async (id) => {
    setEditModal(true);
    try {
      const response = await api.get(`/api/category/${id}`);
      setCategoryDetail(response.data.data);
      setEditImagePreview(response.data.data.image ? `${api.defaults.baseURL}/${response.data.data.image}` : null);
    } catch (error) {
      toast.error("Failed to get category");
    }
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    if (!categoryDetail.name) {
      toast.error("Category name is required.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", categoryDetail.name);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      const response = await api.patch(`/api/category/${categoryDetail._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(response.data.message);
      setEditModal(false);
      setCategoryDetail({});
      setImageFile(null);
      setEditImagePreview(null);
      setUpdateTrigger((prev) => !prev);
    } catch (error) {
      toast.error("Failed to edit category");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold text-center text-[#ED4A43] mb-6">Manage Categories</h2>
      <div className="mb-6 text-right">
        <button onClick={() => setShowModal(true)} className="bg-[#ED4A43] text-white px-5 py-2 rounded-md hover:bg-[#D43C35] flex items-center justify-center space-x-2 ml-auto">
          <FaPlus size={14} /> <span>Add New Category</span>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="h-56 bg-gray-100 overflow-hidden">
              {cat.image ? (
                <img src={`${api.defaults.baseURL}/${cat.image}`} alt={cat.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50"><span className="text-gray-400">No image</span></div>
              )}
            </div>
            <div className="p-5 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">{cat.name}</h3>
              <div className="flex space-x-2">
                <button onClick={() => getCategoryById(cat._id)} className="p-2 text-[#ED4A43] hover:bg-gray-100 rounded-lg"><FaEdit size={16} /></button>
                <button onClick={() => handleDelete(cat._id)} className="p-2 text-red-600 hover:bg-gray-100 rounded-lg"><FaTrashAlt size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-2xl font-semibold text-[#ED4A43] mb-4">Add New Category</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded" placeholder="Category Name" required />
              <input type="file" onChange={(e) => handleImageChange(e)} className="w-full p-2" />
              {imagePreview && <img src={imagePreview} className="h-32 w-full object-cover rounded" alt="Preview" />}
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#ED4A43] text-white rounded">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {editModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-2xl font-semibold text-[#ED4A43] mb-4">Edit Category</h3>
            <form onSubmit={handleEditCategory} className="space-y-4">
              <input type="text" value={categoryDetail.name || ""} onChange={(e) => setCategoryDetail(p => ({ ...p, name: e.target.value }))} className="w-full p-2 border rounded" required />
              <input type="file" onChange={(e) => handleImageChange(e, true)} className="w-full p-2" />
              {editImagePreview && <img src={editImagePreview} className="h-32 w-full object-cover rounded" alt="Preview" />}
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setEditModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#ED4A43] text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategory;