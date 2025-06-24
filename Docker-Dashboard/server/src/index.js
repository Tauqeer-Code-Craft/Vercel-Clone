import express, { json } from "express"
import cors from "cors"
import router from "./routes/container.routes.js"

const app = express();
const PORT = process.env.PORT || 8000

app.use(cors());
app.use(express.json());

app.use('/container',router)

app.listen(PORT,() => {
    console.log(`server started : http://localhost:8000/`)
})