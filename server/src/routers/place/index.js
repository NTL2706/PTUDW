import { Router } from "express";
import { viewPlace, formPlace, editPlace, deletePlace } from "../../controllers/placeController.js";

const route = Router();

route.get("/view", viewPlace);
route.get("/form", formPlace)
route.get("/delete", deletePlace);

route.post("/edit", editPlace);

export default route;