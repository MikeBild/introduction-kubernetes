const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const proxy = require("http-proxy-middleware");

const app = express();

app.use(cors());
app.use(morgan("tiny"));
app.use(
  proxy("/home", {
    target: "http://localhost:7010",
    changeOrigin: true,
    ws: true
  })
);
app.use(
  proxy("/docs", {
    target: "http://localhost:7020",
    changeOrigin: true,
    ws: true
  })
);
app.use(
  proxy("/products", {
    target: "http://localhost:7030",
    changeOrigin: true,
    ws: true
  })
);
app.use(
  proxy("/contact", {
    target: "http://localhost:7040",
    changeOrigin: true,
    ws: true
  })
);
app.use(
  proxy("/graphql", {
    target: "http://localhost:9000",
    changeOrigin: true,
    ws: true
  })
);
app.use(
  /^\/api/,
  proxy({
    target: "http://localhost:8000/",
    changeOrigin: true,
    ws: true,
    pathRewrite: {
      "^/api": "/"
    }
  })
);
app.use(
  proxy("/", {
    target: "http://localhost:7010/home",
    changeOrigin: true,
    ws: true
  })
);

const server = app.listen(7000, () =>
  console.log(`Gateway listen on ${server.address().port}`)
);
