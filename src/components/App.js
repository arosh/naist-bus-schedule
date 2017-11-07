// @flow
import React from 'react';
import Form from './Form';
import List from './List';
import Footer from './Footer';
import Share from './Share';
import Next from './Next';

export default () => (
  <div className="container">
    <div className="row">
      <div className="col-md-offset-2 col-md-8">
        <h1>{document.title}</h1>
        <Share />
        <Form />
        <Next />
        <List />
        <Footer />
      </div>
    </div>
  </div>
);
