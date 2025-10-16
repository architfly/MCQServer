import {Router} from "express";
import { HandlePromocodeCreate, HandlePromoCodeDelete, HandlePromoCodeEdit, HandlePromocodeGet } from "../Controller/Promocode_Controller/Promocde_Controller";


const router=Router();

router.post("/create",HandlePromocodeCreate)

router.get("/getAll",HandlePromocodeGet)

router.put("/update/:promoId",HandlePromoCodeEdit);

router.delete("/update/:promoId",HandlePromoCodeDelete);


export default router;
