// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import fetchData from "../../Utils/fetchData";
// import notify from "../../Utils/notify";
// import useFormFields from "../../Utils/useFormFields";
// import { useEffect, useState } from "react";
// import { login } from "../../Store/Slices/AuthSlice";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [fields, handleChange] = useFormFields();
//   const [errors, setErrors] = useState({});
//   const { token } = useSelector((state) => state.auth);

//   const validate = () => {
//     const newErrors = {};
//     if (!/^(\+\d{1,3})?\d{10,14}$/.test(fields.phoneNumber || "")) {
//       newErrors.phoneNumber = "شماره تلفن معتبر نیست (مثلاً +989123456789)";
//     }
//     if (!/^.{6,}$/.test(fields.password || "")) {
//       newErrors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (token) {
//       navigate("/");
//     }
//   }, [token, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validate()) {
//       const res = await fetchData("auth/admin", {
//         method: "POST",
//         headers: {
//           "content-Type": "application/json",
//         },
//         body: JSON.stringify(fields),
//       });
//       if (res.success) {
//         notify(res.message, "success");
//         dispatch(login({ user: res.data.user, token: res.data.token }));
//         navigate("/");
//       } else {
//         notify(res.message, "error");
//       }
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-900">
//       <div className="w-[500px] bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700">
//         <h2 className="text-white text-2xl font-semibold text-center mb-6">
//           ورود به حساب کاربری
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="block text-gray-300 mb-1">شماره تلفن</label>
//             <input
//               type="text"
//               name="phoneNumber"
//               value={fields.phoneNumber || ""}
//               onChange={handleChange}
//               placeholder="مثلاً +989123456789"
//               className={`w-full p-3 rounded-lg bg-gray-700 text-white border-2 placeholder:text-sm ${
//                 errors.phoneNumber ? "border-red-500" : "border-gray-600"
//               } focus:outline-none focus:border-blue-500`}
//             />
//             {errors.phoneNumber && (
//               <p className="text-red-400 text-sm mt-1">{errors.phoneNumber}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-gray-300 mb-1">رمز عبور</label>
//             <input
//               type="password"
//               name="password"
//               value={fields.password || ""}
//               onChange={handleChange}
//               placeholder="رمز عبور خود را وارد کنید"
//               className={`w-full p-3 rounded-lg bg-gray-700 text-white border-2 placeholder:text-sm ${
//                 errors.password ? "border-red-500" : "border-gray-600"
//               } focus:outline-none focus:border-blue-500`}
//             />
//             {errors.password && (
//               <p className="text-red-400 text-sm mt-1">{errors.password}</p>
//             )}
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-semibold transition-all duration-300"
//           >
//             ورود
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import fetchData from "../../Utils/fetchData";
import notify from "../../Utils/notify";
import useFormFields from "../../Utils/useFormFields";
import { login } from "../../Store/Slices/AuthSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [fields, handleChange] = useFormFields();
  const [errors, setErrors] = useState({});
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!fields.username || fields.username.trim().length < 3) {
      newErrors.username = "نام کاربری باید حداقل ۳ کاراکتر باشد";
    }
    if (!fields.password || fields.password.length < 6) {
      newErrors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const res = await fetchData("auth/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });

      if (res.success) {
        notify(res.message, "success");
        dispatch(login({ user: res.data.user, token: res.data.token }));
        navigate("/");
      } else {
        notify(res.message, "error");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
        <h2 className="text-2xl text-center font-bold text-white mb-6">ورود مدیر</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 mb-1">نام کاربری</label>
            <input
              type="text"
              name="username"
              value={fields.username || ""}
              onChange={handleChange}
              placeholder="نام کاربری"
              className={`w-full p-3 rounded-lg bg-gray-700 text-white border-2 placeholder:text-sm ${
                errors.username ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:border-blue-500`}
            />
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-1">رمز عبور</label>
            <input
              type="password"
              name="password"
              value={fields.password || ""}
              onChange={handleChange}
              placeholder="رمز عبور"
              className={`w-full p-3 rounded-lg bg-gray-700 text-white border-2 placeholder:text-sm ${
                errors.password ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:border-blue-500`}
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-semibold transition-all duration-300"
          >
            ورود به پنل
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
