const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const serverless = require("serverless-http");
require("dotenv").config();
//const http = require("http");
//const app = require("./app");

var cors = require("cors");
app.use(cors());

//const port = process.env.PORT || 3000;

//const server = http.createServer(app);

mongoose.connect(process.env.MONGO_CONNECTION, () => {
  console.log("connected to database");
});
//app.listen(3000, () => console.log(`Listening on: 3000`));
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "products REST API",
      description: "A REST API built with Express and MongoDB. ",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./api/routes/*.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const productRoutes = require("./api/routes/products");

const importData = require("./importData");
const shoppingCartRoutes = require("./api/routes/shoppingCartController");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    " Origin , X-Requested-With, Content-Type , Accept , Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "PUT , POST , PATCH , DELETE , GET"
    );
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productRoutes);

app.use("/api/import", importData);
app.use("/shoppingCart", shoppingCartRoutes);

app.use((req, res, next) => {
  const error = new Error("not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
module.exports.handler = serverless(app);
