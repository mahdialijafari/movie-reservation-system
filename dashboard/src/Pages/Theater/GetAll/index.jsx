import React, { useEffect, useState } from "react";
import fetchData from "../../../Utils/fetchData";
import { useSelector } from "react-redux";
import notify from "../../../Utils/notify";

const GetAllTheater = () => {
  const { token } = useSelector((state) => state.auth);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null); // For modal
  const [deleting, setDeleting] = useState(false);

  const fetchTheaters = async () => {
    setLoading(true);
    const res = await fetchData("theater", {
      headers: { authorization: `Bearer ${token}` },
    });
    if (res.success) {
      setTheaters(res.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTheaters();
  }, [token]);

  const handleDelete = async () => {
    if (!confirmId) return;

    setDeleting(true);

    const res = await fetchData(`theater/${confirmId}`, {
      method: "DELETE",
      headers: { authorization: `Bearer ${token}` },
    });

    if (res.success) {
      notify("سالن با موفقیت حذف شد", "success");
      setTheaters((prev) => prev.filter((t) => t._id !== confirmId));
    } else {
      notify(res.message || "خطا در حذف سالن", "error");
    }

    setConfirmId(null);
    setDeleting(false);
  };

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">لیست سالن‌ها</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <p className="text-center py-6">در حال بارگذاری...</p>
        ) : theaters.length === 0 ? (
          <p className="text-center py-6">سالن‌ای یافت نشد.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-right">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">نام سالن</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">ردیف‌ها</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">ستون‌ها</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">تعداد صندلی</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">عملیات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {theaters.map((t) => (
                  <tr key={t._id}>
                    <td className="px-6 py-4 font-semibold">{t.name}</td>
                    <td className="px-6 py-4">{t.rows}</td>
                    <td className="px-6 py-4">{t.columns}</td>
                    <td className="px-6 py-4">{t.seatCount}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setConfirmId(t._id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm Delete Modal */}
      {confirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-center text-red-600">آیا مطمئن هستید؟</h2>
            <p className="mb-4 text-center">آیا می‌خواهید این سالن را حذف کنید؟ این عملیات غیرقابل بازگشت است.</p>
            <div className="flex justify-around gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                disabled={deleting}
              >
                {deleting ? "در حال حذف..." : "بله، حذف شود"}
              </button>
              <button
                onClick={() => setConfirmId(null)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllTheater;
