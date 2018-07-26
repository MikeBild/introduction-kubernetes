import React from "react";
import { connect } from "refunk";
import { compose } from "recompose";

import {
  Header,
  Footer,
  Nav,
  Layout,
  ContactForm,
  Login,
  withLoading
} from "../components";

const setLoading = value => state => ({ loading: value });

const Page = ({ update, loading = false }) => (
  <Layout>
    <h1>Component Demos</h1>

    <button onClick={e => update(setLoading(true))}>Enable Loading</button>
    <button onClick={e => update(setLoading(false))}>Disable Loading</button>
  </Layout>
);

// connect(withLoading(Page))
export default compose(
  connect,
  withLoading
)(Page);
