import React, { Fragment as F } from "react";
const ReactMarkdown = require("react-markdown");

export default ({ data: { content, title, section } }) => (
  <F>
    <h1>{section}</h1>
    <content>
      <ReactMarkdown source={content} />
    </content>
  </F>
);
