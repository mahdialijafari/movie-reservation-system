import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import notify from "../../../Utils/notify";
import { useNavigate } from "react-router-dom";

const CreateReservation = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    showtime: "",
    seats: "",
    totalPrice: "",
  });

  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchShowtimes = async () => {
      const response = await fetchData("showtime");
      if (response.success) {
        setShowtimes(response.data?.data);
      } else {
        notify("خطا در دریافت سانس‌ها", "error");
      }
    };

    fetchShowtimes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.showtime || !formData.seats || !formData.totalPrice) {
      return notify("لطفاً تمام فیلدها را پر کنید", "error");
    }

    const payload = {
      showtime: formData.showtime,
      seats: formData.seats.split(",").map((s) => s.trim()),
      totalPrice: Number(formData.totalPrice),
    };

    try {
      setLoading(true);
      const response = await fetchData("reservations", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.success) {
        notify("رزرو با موفقیت ثبت شد", "success");
        navigate("/reservations");
      } else {
        notify(response.message || "خطا در ثبت رزرو", "error");
      }
    } catch (err) {
      notify("خطا در ارتباط با سرور", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-md shadow-md" dir="rtl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">ایجاد رزرو جدید</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">سانس *</label>
          <select
            name="showtime"
            value={formData.showtime}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md border-gray-300"
            required
          >
            <option value="">انتخاب کنید...</option>
            {showtimes.map((s) => (
              <option key={s._id} value={s._id}>
                {new Date(s.date).toLocaleString("fa-IR")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">صندلی‌ها (با ویرگول جدا شود) *</label>
          <input
            name="seats"
            value={formData.seats}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md border-gray-300"
            placeholder="مثلاً: A1, A2, B1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">قیمت کل (تومان) *</label>
          <input
            type="number"
            name="totalPrice"
            value={formData.totalPrice}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md border-gray-300"
            placeholder="مثلاً: 150000"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? "در حال ارسال..." : "ثبت رزرو"}
        </button>
      </form>
    </div>
  );
};

export default CreateReservation;
