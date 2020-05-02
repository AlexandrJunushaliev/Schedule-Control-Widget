import PropTypes from "prop-types";
import React, {Component} from "react";

export default class SelfControlWidget extends Component {
  static propTypes = {
    reportData: PropTypes.array
  };

  constructor(props) {
    super(props);
  }

  render() {
    const reportData = this.props.reportData;
    return (
      <div>
        {reportData.map(reportLine => {
            console.log(reportLine);
        })}
        <span>репорт получай</span>
      </div>
    );
  }
}
