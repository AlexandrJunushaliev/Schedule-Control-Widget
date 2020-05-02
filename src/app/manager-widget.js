import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, ButtonGroup, Checkbox, DatePicker, Grid, Panel, Text} from "@jetbrains/ring-ui";
import Select from '@jetbrains/ring-ui/components/select/select';
import Report from "./report";
import Island, {Header, Content} from "@jetbrains/ring-ui/components/island/island";
import Row from "@jetbrains/ring-ui/components/grid/row";
import Col from "@jetbrains/ring-ui/components/grid/col";
import trashIcon from '@jetbrains/icons/trash.svg';
import Icon from "@jetbrains/ring-ui/components/icon";
import {getReportData} from "./api-interaction";
import {getFromToDateObj, periodsData} from "./date-helper";

export default class ManagerWidget extends Component {
  static propTypes = {
    dashboardApi: PropTypes.object,
    registerWidgetApi: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      isReportReady: false,
      chosenEmployees: [],
      selectedEmployee: null,
      availableEmployees: null,
      reportData: [],
      projects: [],
      selectedProject: null,
      selectedProjects: [],
      selectedPeriod: null,
      selectedPeriods: [],
      from: null,
      to: null
    }
  };


  async componentDidMount() {
    //TODO: add catch()
    this.props.dashboardApi.fetchHub("rest/users")
      .then(usersPage => {
        let emails = usersPage.users
          .filter(user => user.profile.hasOwnProperty('email'))
          .map(user => {
            return {userEmail: user.profile.email.email, userLogin: user.login}
          }).map(user => {
            return {label: user.userEmail, key: user}
          });
        this.setState({availableEmployees: emails})
      }).then(
      this.props.dashboardApi.fetchHub("rest/projects").then(projectsPage => {
        let projects = projectsPage.projects.filter(project => project.name !== "Global").map(project => {
          return {label: project.name, key: project.id}
        });
        this.setState({projects: projects})
      }));
  }


  check = () => {
    //TODO:loading alert
    getReportData(this.props.dashboardApi, this.state.chosenEmployees)
      .then(reportData => {
          this.setState({
            reportData,
            isReportReady: true
          })
        }
      );
  };
  closeReport = () => this.setState({isReportReady: false});
  selectPeriod = selectedPeriod => {
    this.setState({selectedPeriod});
    this.addPeriod(selectedPeriod);
  };
  addPeriod = period => {
    const {selectedPeriods} = this.state;
    if (!period) {
      return
    }
    if (!selectedPeriods.filter(selectedPeriod => selectedPeriod.label === period.label)[0]) {
      selectedPeriods.push(period);
      this.setState(selectedPeriods);
    } else {

    }
  };
  setRange = ({from, to}) => {
    this.setState({from, to});
    if (from && to) {
      let fromDate = new Date(from);
      let toDate = new Date(to);
      this.setState({from: null, to: null});
      this.addPeriod({
        label: `${fromDate.toLocaleDateString()}-${toDate.toLocaleDateString()}`,
        getPeriod: () => getFromToDateObj(fromDate, toDate)
      })
    }

  };
  deletePeriod = (period) => this.setState({selectedPeriods: this.state.selectedPeriods.filter(selectedPeriod => selectedPeriod.label !== period.label)});

  selectProject = selectedProject => {
    this.setState(selectedProject);
    const {selectedProjects} = this.state;
    if (!selectedProject) {
      return
    }
    if (!selectedProjects.filter(project => project.key === selectedProject.key)[0]) {
      selectedProjects.push(selectedProject);
      this.setState(selectedProject);
    } else {

    }
  };
  deleteProject = (project) => this.setState({selectedProjects: this.state.selectedProjects.filter(selectedProject => selectedProject.key !== project.key)});
  selectEmployee = selectedEmployee => this.setState({selectedEmployee});
  addEmployee = (employee) => {
    const {chosenEmployees} = this.state;
    if (!employee) {
      //TODO:error component
      return;
    }
    if (!chosenEmployees.filter(chosenEmployee => chosenEmployee.label === employee.label)[0]) {
      chosenEmployees.push(employee);
      this.setState(chosenEmployees);
    } else {
      //TODO:error component
    }
  };
  unChoseEmployee = (label) => {
    const newChosen = this.state.chosenEmployees.filter(x => x.label !== label);
    this.setState({chosenEmployees: newChosen});
  };

  render() {
    const {isReportReady, chosenEmployees, selectedEmployee, availableEmployees, reportData, projects, selectedProject, selectedProjects, selectedPeriod, selectedPeriods, from, to} = this.state;
    return (
      <div>
        <span>Менеджер шоли ну проходи</span>
        {!isReportReady
          ?
          <div>
            <Island>
              <Header border>{"Панель настроек"}</Header>
              <Content>
                <div>
                  <Select
                    filter
                    label={"Выберите проект"}
                    onChange={this.selectProject}
                    selected={selectedProject}
                    data={projects}
                  />
                </div>
                <br/>
                <div>
                  {
                    selectedProjects == false ? "или Issue из всех проектов будут рассмотрены"
                      : <ButtonGroup>
                        {
                          selectedProjects.map(project =>
                            <Button onClick={() => this.deleteProject(project)}>
                              {project.label + " "}<Icon
                              glyph={trashIcon}
                              className="ring-icon"
                              color={Icon.Color.RED}
                            />
                            </Button>)
                        }
                      </ButtonGroup>
                  }
                </div>
              </Content>
              <Content>
                <div>
                  <Select
                    data={periodsData}
                    label={"Периоды"}
                    selected={selectedPeriod}
                    onChange={this.selectPeriod}
                  />

                  <div>
                    <Text>{"Или "}</Text>
                    <DatePicker
                      rangePlaceholder={"Фиксированный период"} from={from} to={to}
                      onChange={this.setRange}
                      range
                    />
                  </div>

                </div>
                <br/>
                <div>
                  {
                    selectedPeriods == false ? "Выберите периоды"
                      : <ButtonGroup>
                        {
                          selectedPeriods.map(period =>
                            <Button onClick={() => this.deletePeriod(period)}>
                              {period.label + " "}<Icon
                              glyph={trashIcon}
                              className="ring-icon"
                              color={Icon.Color.RED}
                            />
                            </Button>
                          )
                        }
                      </ButtonGroup>
                  }
                </div>
              </Content>
            </Island>
            <br/>
            {
              chosenEmployees == false
                ? <Island>
                  <Header>{"Сотрудники не выбраны"}</Header>
                </Island>
                : <Island>
                  <Header border>{"Выбранные сотрудники:"}</Header>
                  <Content>
                    <Grid>
                      {
                        chosenEmployees.map(employee =>
                          <div key={employee.label}>
                            <Row>
                              <Col xs={4} sm={4} md={6} lg={3}>
                                <div className="cell">{employee.label}</div>
                              </Col>
                              <Col xs={4} sm={8} md={6} lg={3}>
                                <div className="cell">
                                  <Button
                                    onClick={() => this.unChoseEmployee(employee.label)}><Icon
                                    glyph={trashIcon}
                                    className="ring-icon"
                                    color={Icon.Color.RED}
                                  />
                                  </Button>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        )}
                    </Grid>
                  </Content>
                </Island>
            }
            <br/>
            <Island>
              <Header border>{"Добавить сотрудника"}</Header>
              <Content>
                <div>
                  <Select
                    filter
                    label={"Выберите сотрудника"}
                    data={availableEmployees}
                    selected={selectedEmployee}
                    onChange={this.selectEmployee}
                  />
                </div>
                <br/>
                <div>
                  <Button onClick={() => this.addEmployee(selectedEmployee)}>Добавить сотрудника</Button>
                </div>
              </Content>
            </Island>
            <Panel>
              <Button onClick={this.check}>Создать отчет</Button>
            </Panel>
          </div>
          :
          <div>
            <Button onClick={this.closeReport}>Закрыть отчет</Button>
            <Report reportData={reportData}/>
          </div>}
      </div>
    );
  }
}
