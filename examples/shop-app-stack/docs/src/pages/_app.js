import React from "react";
import { Layout, SubNav } from "components-library";
import { Link } from "react-router-dom";

export default ({ render, routes }) => {
  return (
    <Layout
      title="Docs - App"
      subnav={() => (
        <SubNav>
          {routes.filter(x => x.props.data && x.props.data.section).map(x => (
            <span key={x.key}>
              <Link to={x.href}>
                {x.props.data.section} - {x.props.data.title}
              </Link>{" "}
            </span>
          ))}
        </SubNav>
      )}
    >
      {render()}
    </Layout>
  );
};
