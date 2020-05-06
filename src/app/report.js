import PropTypes from "prop-types";
import React, {Component} from "react";
import Table from "@material-ui/core/Table";
import Selection from "@jetbrains/ring-ui/components/table/selection";
import Link from "@jetbrains/ring-ui/components/link/link";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import TableBody from "@material-ui/core/TableBody";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Text from "@jetbrains/ring-ui/components/text/text";
import {getRegisterWidgetApiMock} from "@jetbrains/hub-widget-ui/src/test-mocks/test-mocks";
import {default as ReactDOM, render} from "react-dom";
import Widget from "./app";


export default class Report extends Component {
    static propTypes = {
        registerWidgetApi: PropTypes.func,
        reportData: PropTypes.array,
        dashboardApi: PropTypes.object,
        refreshReport: PropTypes.func
    };


    constructor(props) {
        super(props);
        this.state = {isRefreshing: false, reportData: this.props.reportData};
        this.props.registerWidgetApi({
            onRefresh: () => {
                this.setState({isRefreshing: true});
                this.props.refreshReport().then(reportData => {
                    this.setState({reportData});
                    this.setState({isRefreshing: false})
                }).catch(err => this.setState({isRefreshing: false}))
            }
        })
    }

    componentWillUnmount() {
        const props = this.props;
        props.registerWidgetApi({
            onRefresh: () => {
                ReactDOM.unmountComponentAtNode(document.getElementById('app-container'));
                render(
                    <Widget
                        dashboardApi={props.dashboardApi}
                        registerWidgetApi={props.registerWidgetApi}
                    />,
                    document.getElementById('app-container')
                );
            }
        })
    }

    render() {
        const reportData = this.state.reportData;
        return (<TableContainer component={Paper}>
            <Table size="small" aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>{"Email"}</TableCell>
                        {reportData[0].periods.map(period => <TableCell
                            key={`${period.from} - ${period.to}`}>{`${period.from} - ${period.to}`}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reportData.map(user => {
                        return <TableRow key={user.email}>
                            <TableCell>{user.email}</TableCell>
                            {user.periods.map(period =>
                                <TableCell key={`${period.from} - ${period.to}`}>
                                    <TableRow>
                                        <TableCell>{"Факт"}</TableCell><TableCell>{"План"}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><Text
                                            style={{color: period.fact < period.plan || !period.fact ? "red" : "green"}}>{period.fact ? Math.round(period.fact) : 0}</Text></TableCell>
                                        <TableCell>{period.plan ?? 0}</TableCell>
                                    </TableRow>
                                </TableCell>)}
                        </TableRow>
                    })}

                </TableBody>
            </Table>
        </TableContainer>)
    }
}
