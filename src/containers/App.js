import React from 'react';
import Footer from '../components/Footer';
import Share from '../components/Share';
import Form from './Form';
import List from './List';
import Next from './Next';

const styles = {
  footer: {
    margin: '28px 0 40px',
  },
  title: {
    textAlign: 'center',
  },
};

export default () => (
  <div className="container">
    <div className="row">
      <div className="col-md-offset-2 col-md-8">
        <h1 style={styles.title}>{document.title}</h1>
        <Share />
        <Form />
        <Next />
        <List />
        <div style={styles.footer}>
          <Footer />
        </div>
      </div>
    </div>
  </div>
);
