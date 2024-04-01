const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3500;

//custom middleware for logger
app.use((req, res, next) => {
  console.log(req.method + " " + req.url);
  next();
});

//Cross origin resource sharing
const whitelist = [
  "https://www.yoursite.com",
  "http://127.0.0.1:3000",
  "http://localhost:3000",
];
const corsOptions = {
  origin: (origin, callback) => {
    //for development only we use !origin
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

//built in middleware to handle urlencoded data
//in other words, form data;
//'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

//build-in middleware for json
app.use(express.json());

//serve static files
// app.use(express.static(path.join(__dirname, "/public")));

//routes
app.use("/", require("./routes/root"));
app.use("/subdir", require("./routes/subdir"));
app.use("/redirect", require("./routes/redirect"));
app.use("/employees", require("./routes/api/employees"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 page not found" });
  } else {
    res.type("txt").send("404 page not found");
  }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
