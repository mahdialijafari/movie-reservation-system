import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import notify from "../../../Utils/notify";

const UpdateShowtime = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    movie: "",
    dateTime: "",
    theater: "",
    price: "",
    seats: "", // Number of seats as string for input control
  });

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      const [showtimeRes, moviesRes] = await Promise.all([
        fetchData(`showtime/${id}`, {
          headers: { authorization: `Bearer ${token}` },
        }),
        fetchData("movies", {
          headers: { authorization: `Bearer ${token}` },
        }),
      ]);

      if (showtimeRes.success) {
        const { movie, dateTime, theater, price, seats } = showtimeRes.data;

        setFormData({
          movie: movie?._id || "",
          dateTime: dateTime?.slice(0, 16),
          theater,
          price: price.toString(),
          seats: seats?.toString() || "0", // Just a number like in Create page
        });
      } else {
        notify("خطا در دریافت اطلاعات سانس", "error");
        navigate("/showtime");
      }

      if (moviesRes.success) {
        setMovies(moviesRes.data?.data);
      } else {
        notify("خطا در دریافت لیست فیلم‌ها", "error");
      }
    };

    fetchInitialData();
  }, [id, navigate, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      price: Number(formData.price),
      seats: Number(formData.seats),
    };

    const response = await fetchData(`showtime/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.success) {
      notify("سانس با موفقیت به‌روزرسانی شد", "success");
      navigate("/showtime");
    } else {
      notify(response.message || "خطا در به‌روزرسانی سانس", "error");
    }

    setLoading(false);
  };

  const confirmDelete = () => setShowConfirmModal(true);

  const handleDeleteConfirmed = async () => {
    setShowConfirmModal(false);
    setDeleting(true);

    const response = await fetchData(`showtime/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (response?.success) {
      notify("سانس با موفقیت حذف شد", "success");
      navigate("/showtime");
    } else {
      notify(response.message || "خطا در حذف سانس", "error");
    }

    setDeleting(false);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-md shadow-md" dir="rtl">
      <h2 className="text-2xl font-bold mb-6 text-center">ویرایش سانس</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Movie */}
        <div>
          <label className="text-sm font-medium">فیلم *</label>
          <select
            name="movie"
            value={formData.movie}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">انتخاب فیلم</option>
            {movies.map((m) => (
              <option key={m._id} value={m._id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>

        {/* DateTime */}
        <div>
          <label className="text-sm font-medium">تاریخ و زمان *</label>
          <input
            type="datetime-local"
            name="dateTime"
            value={formData.dateTime}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Theater */}
        <div>
          <label className="text-sm font-medium">سالن *</label>
          <input
            name="theater"
            value={formData.theater}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Seats */}
        <div>
          <label className="text-sm font-medium">تعداد صندلی‌ها *</label>
          <input
            type="number"
            name="seats"
            value={formData.seats}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            min="1"
          />
        </div>

        {/* Price */}
        <div>
          <label className="text-sm font-medium">قیمت بلیت *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            min="0"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "در حال به‌روزرسانی..." : "به‌روزرسانی"}
          </button>

          <button
            type="button"
            onClick={confirmDelete}
            disabled={deleting}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            {deleting ? "در حال حذف..." : "حذف سانس"}
          </button>
        </div>
      </form>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">تأیید حذف</h3>
            <p className="text-gray-700 mb-6">آیا از حذف این سانس مطمئن هستید؟</p>
            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                onClick={() => setShowConfirmModal(false)}
              >
                انصراف
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleDeleteConfirmed}
              >
                تأیید حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateShowtime;
