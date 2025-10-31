const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json()); // JSON body read karne ke liye

app.get("/", (req, res) => {
  res.send("Hello Priyanka! Backend is running 🎉");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
