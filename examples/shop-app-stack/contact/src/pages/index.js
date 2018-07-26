import React, { Fragment as F, createRef } from "react";
import fetch from "node-fetch";
import { Layout, Notification } from "components-library";
import { connect } from "refunk";

const onError = state => {
  return state;
};

export default connect(({ update, error, message }) => {
  const nameInput = createRef();
  const emailInput = createRef();
  const messageInput = createRef();

  const onSubmit = async e => {
    e.preventDefault();
    const response = await fetch("http://localhost:7000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: nameInput.current.value,
        email: emailInput.current.value,
        message: messageInput.current.value
      })
    });

    if (response.status !== 201)
      return update(() =>
        onError({ error: "Ein Fehler ist aufgetreten.", message: "" })
      );

    update(() => onError({ error: "", message: "Vielen Dank!" }));

    const data = await response.json();
  };

  return (
    <Layout title="Contact - App">
      <form onSubmit={onSubmit}>
        <label>Name</label>
        <br />
        <input ref={nameInput} />
        <br />
        <label>E-Mail</label>
        <br />
        <input type="email" ref={emailInput} />
        <br />
        <label>Message</label>
        <br />
        <textarea ref={messageInput} />
        <br />
        <br />
        <button type="submit">Absenden</button>
        <Notification error={error}>{error || message}</Notification>
      </form>
    </Layout>
  );
});
