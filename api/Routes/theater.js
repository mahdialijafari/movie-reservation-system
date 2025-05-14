import express from "express";
import { isAdmin } from "../Middlewares/isAdmin.js";
import { isLogin } from "../Middlewares/isLogin.js";
import {
  create,
  getAll,
  remove,
} from "../Controllers/theaterCn.js";

const theaterRouter = express.Router();

theaterRouter
  .route("/")
  .post(isAdmin, create)
  .get(isLogin, getAll);

  theaterRouter.route("/:id").delete(isAdmin, remove);

export default theaterRouter;
