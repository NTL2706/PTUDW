import { Router } from "express";
import { viewReport } from "../../controllers/reportController.js";

const route = Router();

route.get("/view", viewReport);
route.get("/form", )
// route.get("/delete", deletePlace);

// route.post("/edit", editPlace);

export default route;