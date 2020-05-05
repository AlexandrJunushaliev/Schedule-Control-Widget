import {getUtc} from "./date-helper";
import {get1cData} from "./back-end-mock";

export const getReportData = async (dashboardApi, widgetState) => {
    const {serviceId, chosenEmployees, issueFilter, workTypes, selectedWorkTypes, projects, selectedProjects, selectedPeriods} = widgetState;
    let workItems = [];
    let promises = [];
    const filterWorkTypes = selectedWorkTypes.length === 0 ? workTypes : selectedWorkTypes;
    const projectsToRequest = selectedProjects.length === 0 ? projects : selectedProjects;
    let fromToPeriods = selectedPeriods.map(period => period.getPeriod());
    for (const project of projectsToRequest) {
        await dashboardApi.fetch(serviceId, `rest/issue/byproject/${project.key}?${issueFilter ? `filter=${encodeURIComponent(issueFilter)}` : ""}&with=id&max=30000`).then(issues => {
            issues.forEach(issue =>
                promises = promises.concat(dashboardApi.fetch(serviceId, `rest/issue/${issue.id}/timetracking/workitem`)
                    .then(returnedWorkItems => {
                        workItems = workItems.concat(returnedWorkItems.filter(workItem => {
                            return !workItem.worktype && filterWorkTypes === workTypes ||
                                filterWorkTypes.filter(fwt => fwt.label === workItem.worktype?.name)[0];
                        }).map(workItem => {
                            const date = getUtc(new Date(workItem.date));
                            const inPeriods = fromToPeriods.filter(period => period.from <= date && period.to >= date);
                            const author = chosenEmployees.filter(emp => emp.key.userLogin === workItem.author.login)[0];
                            if (!author) {
                                return;
                            }
                            return {
                                email: chosenEmployees.filter(emp => {
                                    return emp.key.userLogin === workItem.author.login
                                })[0].label,
                                date: date,
                                inPeriods: inPeriods,
                                duration: workItem.duration / 60
                            }
                        })
                            .filter(workItem => workItem && workItem.inPeriods.length !== 0));
                    })));
        });
    }
    await Promise.all(promises);
    const plan = get1cData(chosenEmployees.map(emp => emp.label), fromToPeriods);
    console.log(plan);
    workItems.forEach(workItem => {
        //console.log(workItem);
        const user = plan.users.filter(user => user.email === workItem.email)[0];
        const periods = user.periods.filter(period => workItem.inPeriods.filter(WIPeriod => WIPeriod.from.toLocaleDateString() === period.from && WIPeriod.to.toLocaleDateString() === period.to)[0]);
        periods.forEach(period => {
            period.hasOwnProperty("fact") ? period.fact += workItem.duration : period.fact = workItem.duration
        });
    });
    return plan.users;
    //TODO:Call to backend!
};
