const PouchDB = require("pouchdb");
const MyPouchDB = PouchDB.defaults({ prefix: "./db/" });

const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const morgan = require("morgan");

const productsDB = new MyPouchDB("products");
const contentsDB = new MyPouchDB("contents");
const docsDB = new MyPouchDB("docs");
const contactDB = new MyPouchDB("contact");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.static("public"));
app.use("/", require("express-pouchdb")(MyPouchDB));
app.use(bodyparser.json());

app.listen(8000, () => console.log("Catalog listen on 8000"));
