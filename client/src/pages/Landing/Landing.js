import React from 'react';
import "./Landing.css"
import Layout from "../Layout";

class Landing extends React.Component {
  render() {
    return (
        <Layout auth={false}>
        <div class="content">
          <div class="hero-image">
            <div class="hero-text">
              <h1 class="welcome">Welcome to RapidSign</h1>
              <p>Signing documents has never been faster.</p>
            </div>
          </div>
          <div class="information">
            <h1>RapidSign!</h1>
            <h3>RapidSign allows you to quickly upload a pdf document, share it, and have it signed.</h3>
            <p>Upload your document</p>
            <p>Share the provided link</p>
            <p>The recipient opens the link and signs</p>
            <p><i>It's that simple</i></p>

          </div>
        </div>
      </Layout>
    )
  }
}

export default Landing;