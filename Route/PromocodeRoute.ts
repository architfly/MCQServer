import {Router} from "express";
import { HandlePromocodeCreate, HandlePromoCodeDelete, HandlePromoCodeEdit, HandlePromocodeGet } from "../Controller/Promocode_Controller/Promocode_Controller";


const router=Router();

router.post("/create",HandlePromocodeCreate)

router.get("/getAll",HandlePromocodeGet)

router.put("/update/:promoId",HandlePromoCodeEdit);

router.delete("/delete/:promoId",HandlePromoCodeDelete);

// router.post("/validate", HandlePromocodeValidate);



export default router;
