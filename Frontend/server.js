const express = require("express");
const path = require("path");
const app = express();

const PORT = 3000;

// Serve static files from the 'public' directory where your HTML file is located
app.use(express.static(path.join(__dirname)));
app.use("/artifacts", express.static(path.join(__dirname, "../artifacts")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
