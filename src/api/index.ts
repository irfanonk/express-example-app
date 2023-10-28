import { Router } from "express";

import todosRouter from "./todos";

const router = Router();

router.get("/", async (req, res) => {
  res.json({
    message: `${req.originalUrl} api is up and running`,
  });
});

router.use("/todos", todosRouter);

export default router;
