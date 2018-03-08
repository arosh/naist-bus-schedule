// @flow
import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import '../assets/css/bootstrap.min.css';

import Footer from '../components/Footer';
import Share from '../components/Share';
import Next from '../components/Next';

storiesOf('Footer', module).add('default', () => <Footer />);

storiesOf('Next', module).add('default', () => (
  <Next exist hours={12} minutes={34} seconds={56} />
));

storiesOf('Share', module).add('default', () => <Share />);
