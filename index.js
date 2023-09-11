import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs");
  });

app.post("/search", (req, res) => {
    let nameInput = req.body["nameInput"]; 
    console.log(nameInput);
    res.redirect(`https://torre.ai/search/people-name?q=name%3A${nameInput}`);
  });

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });