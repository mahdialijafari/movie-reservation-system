import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import notify from "../../../Utils/notify";

const UpdateMovies = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    duration: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      const response = await fetchData(`movies/${id}`);
      if (response.success) {
        const movie = response.data;
        setFormData({
          title: movie.title,
          description: movie.description,
          genre: movie.genre.join(", "),
          duration: movie.duration,
        });
        setImage(movie.posterImage);
      } else {
        notify(response.message || "خطا در دریافت اطلاعات فیلم", "error");
        navigate("/movies");
      }
    };

    fetchMovie();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append("file", file);

    const response = await fetchData("upload", {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: form,
    });

    if (response.success) {
      setImage(response.file.filename);
      notify("تصویر با موفقیت آپلود شد", "success");
    } else {
      notify("آپلود تصویر با خطا مواجه شد", "error");
    }

    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return notify("لطفاً تصویر پوستر را آپلود کنید", "error");

    const payload = {
      ...formData,
      duration: Number(formData.duration),
      genre: formData.genre.split(",").map((g) => g.trim()),
      posterImage: image,
    };

    setLoading(true);
    const response = await fetchData(`movies/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.success) {
      notify("فیلم با موفقیت به‌روزرسانی شد", "success");
      navigate("/movies");
    } else {
      notify(response.message || "خطا در به‌روزرسانی فیلم", "error");
    }

    setLoading(false);
  };

  const confirmDelete = () => {
    setShowConfirmModal(true);
  };

  const handleDeleteConfirmed = async () => {
    setShowConfirmModal(false);
    setDeleting(true);

    const response = await fetchData(`movies/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (response?.success) {
      notify("فیلم با موفقیت حذف شد", "success");
      navigate("/movies");
    } else {
      notify(response.message || "خطا در حذف فیلم", "error");
    }

    setDeleting(false);
  };

  return (
    <div
      className="max-w-xl mx-auto bg-white p-6 rounded-md shadow-md"
      dir="rtl"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        ویرایش فیلم
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            عنوان فیلم *
          </label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md border-gray-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            توضیحات *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md border-gray-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ژانرها (با ویرگول جدا کنید) *
          </label>
          <input
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md border-gray-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            مدت زمان (دقیقه) *
          </label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md border-gray-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            تصویر پوستر *
          </label>
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

        <div className="flex justify-between gap-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "در حال به‌روزرسانی..." : "به‌روزرسانی فیلم"}
          </button>

          <button
            type="button"
            onClick={confirmDelete}
            disabled={deleting}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-red-300"
          >
            {deleting ? "در حال حذف..." : "حذف فیلم"}
          </button>
        </div>
      </form>
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">تأیید حذف</h2>
            <p className="mb-6 text-gray-700">
              آیا از حذف این فیلم مطمئن هستید؟
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                onClick={() => setShowConfirmModal(false)}
                disabled={deleting}
              >
                انصراف
              </button>

              <button
                type="button"
                onClick={handleDeleteConfirmed}
                disabled={deleting}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-red-300"
              >
                {deleting ? "در حال حذف..." : "تأیید حذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateMovies;
