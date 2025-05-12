import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import useFormFields from "../../../Utils/useFormFields";
import notify from "../../../Utils/notify";

const UpdateUser = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [fields, handleChange] = useFormFields();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const response = await fetchData(`users/${id}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (response.success) {
          setInitialData(response.data);
        } else {
          notify("کاربر پیدا نشد!", "error");
          navigate("/users");
        }
      } catch (err) {
        setError(err.response?.message || "خطا در دریافت اطلاعات کاربر");
      }
    })();
  }, [id, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...initialData,
        ...fields,
      };
      const response = await fetchData(`users/${id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.success) {
        notify(response.message, "success");
        navigate("/user");
      } else {
        notify(response.message, "error");
      }
    } catch (err) {
      setError(err.response?.message || "خطا در بروزرسانی اطلاعات کاربر");
    } finally {
      setLoading(false);
    }
  };

  const getFieldValue = (name) => {
    if (fields[name] !== undefined) return fields[name];
    if (initialData && initialData[name] !== undefined) return initialData[name];
    return "";
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">ویرایش کاربر</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            نام کامل
          </label>
          <input
            name="fullname"
            value={getFieldValue("fullname")}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="نام کامل را وارد کنید"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            نام کاربری
          </label>
          <input
            name="username"
            value={getFieldValue("username")}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="نام کاربری را وارد کنید"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            شماره تلفن *
          </label>
          <input
            name="phoneNumber"
            value={getFieldValue("phoneNumber")}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="شماره تلفن را وارد کنید"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            نقش
          </label>
          <select
            name="role"
            value={getFieldValue("role")}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="user">کاربر</option>
            <option value="admin">مدیر</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isComplete"
            checked={!!getFieldValue("isComplete")}
            onChange={(e) =>
              handleChange({
                target: { name: "isComplete", value: e.target.checked },
              })
            }
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">پروفایل تکمیل شده</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          {loading ? "در حال بروزرسانی..." : "ذخیره تغییرات"}
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;
