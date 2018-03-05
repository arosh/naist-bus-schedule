// @flow
import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import '../assets/css/bootstrap.min.css';

import Footer from '../components/Footer';
import Share from '../components/Share';

storiesOf('Footer', module).add('default', () => <Footer />);

storiesOf('Share', module).add('default', () => <Share />);
