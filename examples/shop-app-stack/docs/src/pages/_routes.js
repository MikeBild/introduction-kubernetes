import fetch from "node-fetch";
import Doc from "../components/Doc";

export default async () => {
  const response = await fetch(
    `http://localhost:7000/api/docs/_all_docs?include_docs=true`
  );
  const data = await response.json();
  const contents = data.rows.map(row => row.doc);
  return contents.map(x => ({
    key: x.name,
    exact: true,
    href: `/${x.name}`,
    name: x.name,
    path: `/${x.name}`,
    props: { data: x },
    module: Doc,
    Component: Doc
  }));
};
