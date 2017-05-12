// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import ons from 'onsenui';
import {
  Page,
  Toolbar,
  BackButton,
  ToolbarButton,
  Icon,
  Input,
} from 'react-onsenui';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.min.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      text: '',
      checked: false,
    };
  }
  onChange = () => {
    this.setState({
      checked: !this.state.checked,
    });
  };
  render() {
    return (
      <Page
        renderToolbar={() => (
          <Toolbar>
            <div className="left">
              <BackButton>Back</BackButton>
            </div>
            <div className="center">Title</div>
            <div className="right">
              <ToolbarButton>
                <Icon icon="md-menu" />
              </ToolbarButton>
            </div>
          </Toolbar>
        )}
      >
        <Input
          value={this.state.text}
          float
          onChange={event => {
            this.setState({ text: event.target.value });
          }}
          modifier="material"
          placeholder="Username"
        />
        <Input
          type="checkbox"
          checked={this.state.checked}
          onChange={this.onChange}
        />
      </Page>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('react-root'));
