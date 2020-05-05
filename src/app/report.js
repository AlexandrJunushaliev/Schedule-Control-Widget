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


export default class Report extends Component {
    static propTypes = {
        reportData: PropTypes.array
    };

    constructor(props) {
        super(props);
    }

    render() {
        const reportData = this.props.reportData;
        return (<TableContainer component={Paper}>
            <Table size="small" aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>{"Email"}</TableCell>
                        {reportData[0].periods.map(period => <TableCell>{`${period.from} - ${period.to}`}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reportData.map(user => {
                        return <TableRow>
                            <TableCell>{user.email}</TableCell>
                            {user.periods.map(period =>
                                <TableCell>
                                    <TableRow>
                                        <TableCell>{"Факт"}</TableCell><TableCell>{"План"}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>{Math.round(period.fact)}</TableCell>
                                        <TableCell>{period.plan}</TableCell>
                                    </TableRow>
                                </TableCell>)}
                        </TableRow>
                    })}

                </TableBody>
            </Table>
        </TableContainer>)
        //SimpleTable();

    }
}
