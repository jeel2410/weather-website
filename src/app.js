const path = require("path");
const express = require("express");
const hbs = require("hbs");
const { query } = require("express");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
const port=process.env.PORT || 3000

//define path for express config
const publicDirectorypath = path.join(__dirname, "../public");
const viewspath = path.join(__dirname, "../templets/views");
const partialspath = path.join(__dirname, "../templets/partials");

//ser handlerbars engine and view location
app.set("view engine", "hbs");
app.set("views", viewspath);
hbs.registerPartials(partialspath);

//set static directory to serve
app.use(express.static(publicDirectorypath));

app.get("", (req, res) => {
  res.render("index", {
    title: "weather",
    name: "jeel",
  });
});
app.get("/about", (req, res) => {
  res.render("about", {
    title: "about page",
    name: "jeel",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "help page",
    name: "jeel",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "you must provide address",
    });
  }
  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastdata) => {
        if (error) {
          return res.send({
            error,
          });
        }
        res.send({
          location: location,
          forecast: forecastdata,
          address: req.query.address,
        });
      });
    }
  );
});
app.get("/help/*", (req, res) => {
  res.render("404page", {
    title: "404 page",
    name: " jeel",
    errormessage: "Help article not found",
  });
});
app.get("/product", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search area",
    });
  }
  res.send({
    product: [],
  });
});
app.get("*", (req, res) => {
  res.render("404page", {
    title: "404 page",
    name: " jeel",
    errormessage: "page not found",
  });
});
app.listen(port, () => {
  console.log("server is up on port "+ port);
});
