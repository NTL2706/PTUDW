import { Router } from "express";
import { viewReport, formReport, editReport } from "../../controllers/reportController.js";

const route = Router();

route.get("/view", viewReport);
route.get("/form", formReport)

route.post("/edit", editReport);

export default route;