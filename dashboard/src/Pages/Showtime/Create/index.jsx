import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import notify from "../../../Utils/notify";
import { useNavigate } from "react-router-dom";

const CreateShowtime = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    movie: "",
    dateTime: "",
    theater: "",
    price: "",
    seatCount: "",
  });

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      const res = await fetchData("movies", {
        headers: { authorization: `Bearer ${token}` },
      });
      if (res.success) setMovies(res.data?.data);
    };
    fetchMovies();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const count = parseInt(formData.seatCount);
    if (isNaN(count) || count <= 0) {
      notify("تعداد صندلی معتبر نیست", "error");
      return;
    }

    const payload = {
      movie: formData.movie,
      dateTime: new Date(formData.dateTime).toISOString(),
      theater: formData.theater,
      seatCount: count,
      price: Number(formData.price),
    };

    setLoading(true);

    const response = await fetchData("showtime", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.success) {
      notify("سانس با موفقیت ایجاد شد", "success");
      navigate("/showtime");
    } else {
      notify(response.message || "خطا در ایجاد سانس", "error");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-md shadow" dir="rtl">
      <h2 className="text-2xl font-bold text-center mb-4">ایجاد سانس جدید</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div>
          <label className="text-sm font-medium">سالن *</label>
          <input
            name="theater"
            value={formData.theater}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="مثلاً: سالن 1"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">قیمت بلیط *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="مثلاً: 120000"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">تعداد صندلی *</label>
          <input
            type="number"
            name="seatCount"
            value={formData.seatCount}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="مثلاً: 20"
            required
            min={1}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "در حال ارسال..." : "ایجاد سانس"}
        </button>
      </form>
    </div>
  );
};

export default CreateShowtime;
