import DashboardAddons from 'hub-dashboard-addons';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {default as ReactDOM, render} from 'react-dom';

import './app.css';
import ManagerWidget from "./manager-widget";
import SelfControlWidget from "./self-control-widget";
import {Text} from "@jetbrains/ring-ui";
import permissions from "@jetbrains/hub-widget-ui/src/permissions/permissions";

const jetbrainsReadUserPermissionKey = "jetbrains.jetpass.user-read";

class Widget extends Component {
  static propTypes = {
    dashboardApi: PropTypes.object,
    registerWidgetApi: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {isManager: false};
  }

  async componentDidMount() {
    const {dashboardApi} = this.props;
    let myRoles = [];
    let roles = [];
    await dashboardApi.fetchHub("rest/users/me")
      .then(user =>
        myRoles = [...new Set([].concat(user.projectRoles, user.transitiveProjectRoles, user.sourcedProjectRoles).map(role => role.role.key))])
      .catch(err => {
        //TODO: обработать ошибку через компонент
      });
    await dashboardApi.fetchHub("rest/roles")
      .then(rolesPage => roles = rolesPage.roles
        .map(role => {
          return {key: role.key, permissions: role.permissions.map(permission => permission.key)}
        })
        .filter(role => role.permissions.includes(jetbrainsReadUserPermissionKey))
        .map(role => role.key))
      .catch(err => {
        //TODO: обработать ошибку через компонент
      });
    this.setState({isManager: myRoles.some(role => roles.includes(role))})
  }

  render() {
    const {isManager} = this.state;

    if (isManager) {
      return <div className="widget">
        <ManagerWidget
          dashboardApi={this.props.dashboardApi}
          registerWidgetApi={this.props.registerWidgetApi}
        />
      </div>
    }
    return (
      <div className="widget">
        <SelfControlWidget
          dashboardApi={this.props.dashboardApi}
          registerWidgetApi={this.props.registerWidgetApi}
        />
      </div>
    );
  }
}

DashboardAddons.registerWidget((dashboardApi, registerWidgetApi) => {
    registerWidgetApi({
      onRefresh: () => {
        ReactDOM.unmountComponentAtNode(document.getElementById('app-container'));
        render(
          <Widget
            dashboardApi={dashboardApi}
            registerWidgetApi={registerWidgetApi}
          />,
          document.getElementById('app-container')
        );
      }
    });
    render(
      <Widget
        dashboardApi={dashboardApi}
        registerWidgetApi={registerWidgetApi}
      />,
      document.getElementById('app-container')
    );
  }
);
