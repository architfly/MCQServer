"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Promocode_Controller_1 = require("../Controller/Promocode_Controller/Promocode_Controller");
const router = (0, express_1.Router)();
router.post("/create", Promocode_Controller_1.HandlePromocodeCreate);
router.get("/getAll", Promocode_Controller_1.HandlePromocodeGet);
router.put("/update/:promoId", Promocode_Controller_1.HandlePromoCodeEdit);
router.delete("/delete/:promoId", Promocode_Controller_1.HandlePromoCodeDelete);
// router.post("/validate", HandlePromocodeValidate);
exports.default = router;
//# sourceMappingURL=PromocodeRoute.js.map