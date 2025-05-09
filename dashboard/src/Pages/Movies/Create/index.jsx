import React, { useState } from "react";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import notify from "../../../Utils/notify";
import { useNavigate } from "react-router-dom";

const CreateMovie = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    duration: "",
  });

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetchData("upload", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    });
console.log(token)
    if (!response.success) {
      notify("آپلود تصویر با خطا مواجه شد!", "error");
    } else {
      setImage(response.file.filename);
      notify("تصویر با موفقیت آپلود شد", "success");
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return notify("لطفاً تصویر پوستر را آپلود کنید", "error");

    try {
      setLoading(true);
      const payload = {
        ...formData,
        duration: Number(formData.duration),
        genre: formData.genre.split(",").map((g) => g.trim()),
        posterImage: image,
      };

      const response = await fetchData("movies", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.success) {
        notify("فیلم با موفقیت ایجاد شد", "success");
        navigate("/movies");
      } else {
        notify(response.message || "خطا در ایجاد فیلم", "error");
      }
    } catch (err) {
      notify("خطا در برقراری ارتباط با سرور", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-md shadow-md" dir="rtl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">ایجاد فیلم جدید</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">عنوان فیلم *</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md border-gray-300"
            placeholder="مثلاً: جوکر"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md border-gray-300"
            placeholder="خلاصه‌ای از داستان فیلم..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ژانرها (با ویرگول جدا کنید) *</label>
          <input
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md border-gray-300"
            placeholder="اکشن، درام، معمایی"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">مدت زمان (دقیقه) *</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md border-gray-300"
            placeholder="مثلاً: 120"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تصویر پوستر *</label>
          <input
            type="file"
            onChange={handleImageUpload}
            disabled={uploading}
            className="w-full border px-3 py-2 rounded-md border-gray-300"
          />
          {image && (
            <div className="mt-2">
              <img
                src={import.meta.env.VITE_BASE_FILE + image}
                alt="پوستر"
                className="w-24 h-24 object-cover rounded"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? "در حال ارسال..." : "ایجاد فیلم"}
        </button>
      </form>
    </div>
  );
};

export default CreateMovie;
