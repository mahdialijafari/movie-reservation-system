import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../Store/Slices/AuthSlice";
import {
  FiHome,
  FiUser,
  FiVideo,
  FiClipboard,
  FiGrid,
  FiClock,
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
      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full z-50 bg-white shadow-lg p-4 transition-all duration-200 flex flex-col
        ${isCollapsed ? "w-16" : "w-64"}`}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full mb-6 p-2 hover:bg-gray-100 rounded-lg flex items-center justify-center"
          >
            {isCollapsed ? <FiChevronLeft size={24} /> : <FiChevronRight size={24} />}
          </button>

          {/* Title */}
          <div
            className={`text-2xl font-bold text-gray-800 mb-8 ${
              isCollapsed ? "text-center" : "px-2"
            }`}
          >
            {isCollapsed ? "🎬" : "پنل مدیریت سینما"}
          </div>

          {/* Menu */}
          <nav>
            <ul className="space-y-2">
              {[
                { to: "/", label: "خانه", icon: <FiHome /> },
                { to: "/movies", label: "فیلم‌ها", icon: <FiVideo /> },
                { to: "/reservation", label: "رزروها", icon: <FiClipboard /> },
                { to: "/seats", label: "صندلی‌ها", icon: <FiGrid /> },
                { to: "/showtime", label: "سانس ها", icon: <FiClock /> },
                { to: "/user", label: "کاربران", icon: <FiUser /> },
              ].map(({ to, label, icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    {icon}
                    <span
                      className={`mr-3 ${
                        isCollapsed ? "opacity-0 w-0 absolute" : "opacity-100"
                      }`}
                    >
                      {label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Logout Button */}
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

      {/* Main Content */}
      <main
        className={`flex-1 p-8 transition-all duration-300 ${
          isCollapsed ? "pr-20" : "pr-72"
        }`}
      >
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
