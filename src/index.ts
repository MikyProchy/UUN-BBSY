import express from "express";
import listRouter from "./routes/list/index";

const app = express();

app.use(express.json());
app.use("/lists", listRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
