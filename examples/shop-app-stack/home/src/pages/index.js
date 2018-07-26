import React from "react";
import fetch from "node-fetch";
const ReactMarkdown = require("react-markdown");
import { Layout, Flex } from "components-library";
import styled from "styled-components";

const Box = styled.div`
  border: 1px solid gray;
  margin: 20px;
  padding: 20px;
`;

const Page = ({ data: { contents } }) => {
  return (
    <Layout title="Home-App">
      <Flex>
        {contents.map(content => (
          <Box key={content._id}>
            <h2>{content.title}</h2>
            <ReactMarkdown source={content.content} />
          </Box>
        ))}
      </Flex>
    </Layout>
  );
};

Page.getInitialProps = async () => {
  const response = await fetch(
    `http://localhost:7000/api/contents/_all_docs?include_docs=true`
  );
  const data = await response.json();
  const contents = data.rows.map(row => row.doc);
  return { data: { contents } };
};

export default Page;
