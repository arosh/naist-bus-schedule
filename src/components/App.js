// @flow
import React from 'react';
import Form from './Form';
import List from './List';
import Footer from './Footer';
import Share from './Share';

// const Text = ({children}) => <span style={{display: 'inline-block'}}>{children}</span>;

export default () =>
  <div className="container">
    <div className="row">
      <div className="col-xs-12 col-md-offset-2 col-md-8">
        <h1>
          {document.title}
        </h1>
        <Share />
        <Form />
        <List />
        <Footer />
      </div>
    </div>
  </div>;
