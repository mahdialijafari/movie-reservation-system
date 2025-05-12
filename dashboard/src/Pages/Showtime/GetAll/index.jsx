import React, { useEffect, useState } from "react";
import fetchData from "../../../Utils/fetchData";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const GetAllShowtime = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShowtimes = async () => {
      setLoading(true);
      const res = await fetchData("showtime", {
        headers: { authorization: `Bearer ${token}` },
      });

      if (res.success) {
        const data = res.data?.data || [];

        const formatted = data.map((s) => ({
          ...s,
          reservedSeats: s.isReserved?.filter((r) => r)?.length || 0,
        }));

        setShowtimes(formatted);
        setError(null);
      } else {
        setError(res.message || "خطا در دریافت اطلاعات");
      }

      setLoading(false);
    };

    if (token) {
      fetchShowtimes();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md mx-4 my-2">
        خطا: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">لیست سانس‌ها</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {showtimes.length === 0 ? (
          <p className="text-center py-6">سانسی یافت نشد.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-right">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">فیلم</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">تاریخ و زمان</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">سالن</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">قیمت</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">تعداد کل</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">رزرو شده</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {showtimes.map((s) => (
                  <tr
                    onClick={() => navigate(`update/${s._id}`)}
                    key={s._id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-semibold">{s.movie?.title || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(s.dateTime).toLocaleString("fa-IR")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{s.theater}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{s.price?.toLocaleString()} تومان</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{s.seats}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{s.reservedSeats} نفر</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetAllShowtime;
