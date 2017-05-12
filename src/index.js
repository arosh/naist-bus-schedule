// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import ons from 'onsenui';
import * as Ons from 'react-onsenui';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.min.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      direction: 'to',
      text: '',
      checked: false,
    };
  }
  editSelects = (event) => {
    this.setState({ modifier: event.target.value });
  }
  render = () => (
    <Ons.Page>
      <h1>NAIST Bus Schedule</h1>
      <Ons.Row>
        <Ons.Col width="50%" style={{textAlign: 'right'}}>
          進行方向
        </Ons.Col>
        <Ons.Col width="50%">
          <Ons.Select value={this.state.direction} onChange={e => {
            this.setState({direction: event.target.value});
          }}>
            <option value="to">to NAIST</option>
            <option value="from">from NAIST</option>
          </Ons.Select>
        </Ons.Col>
      </Ons.Row>
      <Ons.Row>
        <Ons.Col width="30%">

        </Ons.Col>
      </Ons.Row>
      <Ons.Row>
        <Ons.Col width="30%">

        </Ons.Col>
      </Ons.Row>
      <Ons.Input
        value={this.state.text}
        onChange={event => {
          this.setState({ text: event.target.value });
        }}
        float
        placeholder="Username"
      />
      <Ons.Input
        type="checkbox"
        checked={this.state.checked}
        onChange={() => {
          this.setState({ checked: !this.state.checked })
        }}
      />
    </Ons.Page>
  );
}

ReactDOM.render(<App />, document.getElementById('react-root'));
