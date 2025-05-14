import React from "react";
import { createBrowserRouter, redirect } from "react-router-dom";
import Movies from "../Pages/Movies";
import GetAllMovies from "../Pages/Movies/GetAll";
import CreateMovies from "../Pages/Movies/Create";
import UpdateMovies from "../Pages/Movies/Update";
import Reservation from "../Pages/Reservation";
import GetAllReservation from "../Pages/Reservation/GetAll";
import CreateReservation from "../Pages/Reservation/Create";
import Showtime from "../Pages/Showtime";
import GetAllShowtime from "../Pages/Showtime/GetAll";
import CreateShowtime from "../Pages/Showtime/Create";
import UpdateShowtime from "../Pages/Showtime/Update";
import User from "../Pages/User";
import GetAllUsers from "../Pages/User/GetAll";
import UpdateUser from "../Pages/User/Update";
import Login from "../Pages/Login";
import Layout from "../Components/Layout";
import Home from "../Pages/Home";
import store from "../Store";
import Theater from "../Pages/Theater";
import GetAllTheaters from "../Pages/Theater/GetAll";
import CreateTheater from "../Pages/Theater/Create";

const checkAuth = () => {
  const state = store.getState();
  const token = state?.auth?.token;

  if (!token) {
    return redirect("/login");
  }
  return null;
};
const checkLogin = () => {
  const state = store.getState();
  const token = state?.auth?.token;

  if (token) {
    return redirect("/");
  }
  return null;
};

const router = createBrowserRouter([
  {
    path: "/login",
    loader: checkLogin,
    element: <Login />,
  },
  {
    path: "/",
    loader: checkAuth,
    element: <Layout />,
    children: [
      {
        index:true,
        element: <Home />,
      },
      {
        path: "/movies",
        element: <Movies />,
        children: [
          { 
            index:true, 
            element: <GetAllMovies /> 
          },
          {
            path: "create",
            element: <CreateMovies />,
          },
          {
            path: "update/:id",
            element: <UpdateMovies />,
          },
        ],
      },
      {
        path: "/reservation",
        element: <Reservation />,
        children: [
          { 
            index:true, 
            element: <GetAllReservation /> 
          },
          {
            path: "create",
            element: <CreateReservation />,
          },
        ],
      },{
        path: "/theater",
        element: <Theater />,
        children: [
          { 
            index:true, 
            element: <GetAllTheaters /> 
          },
          {
            path: "create",
            element: <CreateTheater />,
          },
        ],
      },
      {
        path: "/showtime",
        element: <Showtime />,
        children: [
          { 
            index:true, 
            element: <GetAllShowtime /> 
          },
          {
            path: "create",
            element: <CreateShowtime />,
          },
          {
            path: "update/:id",
            element: <UpdateShowtime />,
          },
        ],
      },
      {
        path: "/user",
        element: <User/>,
        children: [
          { 
            index:true, 
            element: <GetAllUsers /> 
          },
          {
            path: "update/:id",
            element: <UpdateUser />,
          },
        ],
      },
    ],
  },
]);
export default router;
