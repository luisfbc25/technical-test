import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Load main page
app.get("/", async (req, res) => {
  const history = await getSearchHistory();
  res.render("index.ejs", { history });
});

// get input from search bar and search it in torre
app.post("/search", async (req, res) => {
  const nameInput = req.body.nameInput;
  if (nameInput) {
    await addToSearchHistory(nameInput);
  }
  res.redirect(`https://torre.ai/search/people-name?q=name%3A${nameInput}`);
});

// get local search history file
async function getSearchHistory() {
  const historyFile = path.join(__dirname, "history.json");
  try {
    const data = await fs.readFile(historyFile, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// add element searched to search history
async function addToSearchHistory(nameInput) {
  const searchHistory = await getSearchHistory();
  searchHistory.push({ name: capitalizeWords(nameInput) });

  // limit the search history to 10 elements
  if (searchHistory.length > 10) {
    searchHistory.shift();
  }

  await fs.writeFile(
    path.join(__dirname, "history.json"),
    JSON.stringify(searchHistory)
  );
}

// capitalize each word of the element
function capitalizeWords(text) {
  return text.replace(/\w+/g, function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
}

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
