import { Outlet, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import { logout } from "../Store/Slices/AuthSlice";
import { logout } from "../../Store/Slices/AuthSlice";
import { useState } from "react";
import {
  FiHome,
  FiList,
  FiServer,
  FiUser,
  FiMap,
  FiBox,
  FiCodepen,
  FiCodesandbox,
  FiPercent,
  FiMessageSquare,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
} from "react-icons/fi";

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-row-reverse" dir="rtl">
      {/* سایدبار */}
      <aside
        className={`${
          isCollapsed ? "w-16" : "w-64"
        } bg-white shadow-lg p-4 transition-all duration-200 flex flex-col`}
      >
        <div className="flex-1">
          {/* دکمه باز/بستن سایدبار */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full mb-6 p-2 hover:bg-gray-100 rounded-lg flex items-center justify-center"
          >
            {isCollapsed ? <FiChevronLeft size={24} /> : <FiChevronRight size={24} />}
          </button>

          {/* عنوان */}
          <div
            className={`text-2xl font-bold text-gray-800 mb-8 ${
              isCollapsed ? "text-center" : "px-2"
            }`}
          >
            {isCollapsed ? "⚡" : "پنل ادمین"}
          </div>

          {/* منوها */}
          <nav>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <FiHome size={20} />
                  <span
                    className={`mr-3 ${isCollapsed ? "opacity-0 w-0 absolute" : "opacity-100"}`}
                  >
                    داشبورد
                  </span>
                </Link>
              </li>

              <li>
                <Link to="/category" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <FiList size={20} />
                  <span className={`mr-3 ${isCollapsed ? "opacity-0 w-0 absolute" : "opacity-100"}`}>
                    دسته‌بندی‌ها
                  </span>
                </Link>
              </li>

              <li>
                <Link to="/brand" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <FiServer size={20} />
                  <span className={`mr-3 ${isCollapsed ? "opacity-0 w-0 absolute" : "opacity-100"}`}>
                    برندها
                  </span>
                </Link>
              </li>

              <li>
                <Link to="/user" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <FiUser size={20} />
                  <span className={`mr-3 ${isCollapsed ? "opacity-0 w-0 absolute" : "opacity-100"}`}>
                    کاربران
                  </span>
                </Link>
              </li>

              <li>
                <Link to="/address" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <FiMap size={20} />
                  <span className={`mr-3 ${isCollapsed ? "opacity-0 w-0 absolute" : "opacity-100"}`}>
                    آدرس‌ها
                  </span>
                </Link>
              </li>

              <li>
                <Link to="/product" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <FiBox size={20} />
                  <span className={`mr-3 ${isCollapsed ? "opacity-0 w-0 absolute" : "opacity-100"}`}>
                    محصولات
                  </span>
                </Link>
              </li>

              <li>
                <Link to="/variant" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <FiCodepen size={20} />
                  <span className={`mr-3 ${isCollapsed ? "opacity-0 w-0 absolute" : "opacity-100"}`}>
                    ویژگی‌ها
                  </span>
                </Link>
              </li>

              <li>
                <Link to="/product-variant" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <FiCodesandbox size={20} />
                  <span className={`mr-3 ${isCollapsed ? "opacity-0 w-0 absolute" : "opacity-100"}`}>
                    ویژگی محصول
                  </span>
                </Link>
              </li>

              <li>
                <Link to="/discount-code" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <FiPercent size={20} />
                  <span className={`mr-3 ${isCollapsed ? "opacity-0 w-0 absolute" : "opacity-100"}`}>
                    کد تخفیف
                  </span>
                </Link>
              </li>

              <li>
                <Link to="/comments" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <FiMessageSquare size={20} />
                  <span className={`mr-3 ${isCollapsed ? "opacity-0 w-0 absolute" : "opacity-100"}`}>
                    نظرات
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* دکمه خروج */}
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <FiLogOut size={20} />
          <span className={`mr-3 ${isCollapsed ? "opacity-0 w-0 absolute" : "opacity-100"}`}>
            خروج
          </span>
        </button>
      </aside>

      {/* محتوای اصلی */}
      <main className="flex-1 p-8">
        <header className="bg-white shadow-sm p-4 mb-8 rounded-lg flex items-center justify-between">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {isCollapsed ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
          </button>
          <h1 className="text-xl font-semibold text-gray-800">خوش آمدید ادمین</h1>
        </header>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
