import React, { Component, Fragment as F } from "react";
import { Loading } from "./";

export default WrappedComponent => {
  return class extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      return (
        <F>
          {this.props && this.props.loading && <Loading>Loading...</Loading>}
          <WrappedComponent {...this.props} />
        </F>
      );
    }
  };
};
