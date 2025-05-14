import React, { useState } from "react";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import notify from "../../../Utils/notify";
import { useNavigate } from "react-router-dom";
import { SeatToolkit } from "@mezh-hq/react-seat-toolkit";

const CreateTheater = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    rows: "",
    columns: "",
  });

  const [layout, setLayout] = useState([]);
  const [disabledSeats, setDisabledSeats] = useState(new Set());
  const [modelCreated, setModelCreated] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // Step 1: generate the seat matrix
  const createModel = () => {
    const r = parseInt(formData.rows, 10);
    const c = parseInt(formData.columns, 10);
    if (
      !formData.name.trim() ||
      isNaN(r) ||
      isNaN(c) ||
      r < 1 ||
      c < 1
    ) {
      return notify("لطفاً نام و تعداد ردیف/ستون معتبر وارد کنید", "error");
    }
    const newLayout = [];
    for (let i = 0; i < r; i++) {
      const rowLabel = String.fromCharCode(65 + i);
      const row = [];
      for (let j = 1; j <= c; j++) {
        row.push({ id: `${rowLabel}${j}` });
      }
      newLayout.push(row);
    }
    setLayout(newLayout);
    setDisabledSeats(new Set());
    setModelCreated(true);
  };

  // Toggle seat disabled
  const toggleSeat = (id) => {
    const s = new Set(disabledSeats);
    s.has(id) ? s.delete(id) : s.add(id);
    setDisabledSeats(s);
  };

  // Step 2: submit the final theater
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!modelCreated) {
      return notify("ابتدا مدل سالن را ایجاد کنید", "error");
    }

    setSubmitting(true);
    const finalLayout = layout.map((row) =>
      row.map((seat) => ({
        ...seat,
        disabled: disabledSeats.has(seat.id),
      }))
    );

    const payload = {
      name: formData.name.trim(),
      layout: finalLayout,
    };

    const res = await fetchData("theater", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setSubmitting(false);
    if (res.success) {
      notify("سالن با موفقیت ایجاد شد", "success");
      navigate("/theater");
    } else {
      notify(res.message || "خطا در ایجاد سالن", "error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg" dir="rtl">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        ایجاد سالن جدید
      </h1>

      {/* Form */}
      <form className="grid grid-cols-1 gap-4 mb-6">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="نام سالن"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="rows"
            value={formData.rows}
            onChange={handleChange}
            placeholder="تعداد ردیف‌ها"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200"
            min={1}
          />
          <input
            type="number"
            name="columns"
            value={formData.columns}
            onChange={handleChange}
            placeholder="تعداد ستون‌ها"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200"
            min={1}
          />
        </div>
        <button
          type="button"
          onClick={createModel}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg shadow-md transition"
        >
          ایجاد مدل سالن
        </button>
      </form>

      {/* Seat selection UI */}
      {modelCreated && (
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-4">انتخاب صندلی‌های ناموجود</h2>
          <div className="p-4 bg-gray-50 rounded-xl shadow-inner">
            {/* manual seat toggles */}
            <div className="flex flex-col items-center space-y-2">
              {layout.map((row, i) => (
                <div key={i} className="flex space-x-2">
                  {row.map((seat) => (
                    <div
                      key={seat.id}
                      onClick={() => toggleSeat(seat.id)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer select-none 
                        ${
                          disabledSeats.has(seat.id)
                            ? "bg-red-400 text-white"
                            : "bg-green-400 text-white"
                        }`}
                    >
                      {seat.id}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-xl font-medium mt-6 mb-4">پیش‌نمایش سالن</h2>
          <div className="border border-gray-200 rounded-xl p-4 shadow-sm">
            <SeatToolkit
              layout={layout.map((row) =>
                row.map((seat) => ({
                  ...seat,
                  disabled: disabledSeats.has(seat.id),
                }))
              )}
              seatSize={28}
              spacing={6}
              className="mx-auto"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg shadow-md transition disabled:opacity-50"
          >
            {submitting ? "در حال ایجاد..." : "ایجاد سالن"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateTheater;
