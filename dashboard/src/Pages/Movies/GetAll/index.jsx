import React, { useEffect, useState } from "react";
import fetchData from "../../../Utils/fetchData";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const GetAllMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { token } = useSelector((state) => state.auth);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await fetchData(
        `movies?page=${currentPage}&limit=${itemsPerPage}`
      );
      if (response.success) {
        setMovies(response.data?.data || []);
        setTotalCount(response.data?.count || 0);
      } else {
        setError(response.message);
      }
      setLoading(false);
    };

    fetchMovies();
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">لیست فیلم‌ها</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-right">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">پوستر</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">عنوان</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">توضیحات</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ژانر</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">مدت زمان (دقیقه)</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">تعداد سانس</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ ایجاد</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {movies.map((movie) => (
                <tr
                  key={movie._id}
                  onClick={() => navigate(`update/${movie._id}`)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {movie.posterImage && (
                      <img
                        src={`${import.meta.env.VITE_BASE_FILE}${movie.posterImage}`}
                        alt={movie.title}
                        className="h-12 w-12 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">{movie.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{movie.description.split(' ').slice(0,4).join(' ')}...</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {movie.genre?.join("، ") || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{movie.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {movie.showtimes?.length || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(movie.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-700">
              نمایش{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              تا{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, totalCount)}
              </span>{" "}
              از <span className="font-medium">{totalCount}</span> مورد
            </p>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border rounded-md px-2 py-1 text-sm"
            >
              <option value={10}>۱۰ در هر صفحه</option>
              <option value={20}>۲۰ در هر صفحه</option>
              <option value={50}>۵۰ در هر صفحه</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              قبلی
            </button>
            <span className="px-4 py-2 text-sm text-gray-700">
              صفحه {currentPage} از {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              بعدی
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetAllMovies;
