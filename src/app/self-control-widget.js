import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button} from "@jetbrains/ring-ui";
import * as ReactDOM from "react-dom";


export default class SelfControlWidget extends Component {
  static propTypes = {
    dashboardApi: PropTypes.object,
    registerWidgetApi: PropTypes.func
  };
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
          <span >давай работяга давай графики заполняй</span>

      </div>
    );
  }
}
