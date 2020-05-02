import {getUtc} from "./date-helper";

export const getReportData = async (dashboardApi, widgetState) => {
    console.log(widgetState);
    const {serviceId, chosenEmployees, issueFilter, workTypes, selectedWorkTypes, projects, selectedProjects, selectedPeriods} = widgetState;
    let workItems = [];
    let promises = [];
    const filterWorkTypes = selectedWorkTypes.length === 0 ? workTypes : selectedWorkTypes;
    const projectsToRequest = selectedProjects.length === 0 ? projects : selectedProjects;
    let fromToPeriods = selectedPeriods.map(period => period.getPeriod());
    console.log(fromToPeriods);
    for (const project of projectsToRequest) {
        await dashboardApi.fetch(serviceId, `rest/issue/byproject/${project.key}?${issueFilter ? `filter=${issueFilter}` : ""}&with=id&max=30000`).then(issues => {
            issues.forEach(issue =>
                promises = promises.concat(dashboardApi.fetch(serviceId, `rest/issue/${issue.id}/timetracking/workitem`)
                    .then(returnedWorkItems => {
                        workItems = workItems.concat(returnedWorkItems.filter(workItem => {
                            return !workItem.worktype && filterWorkTypes === workTypes ||
                                filterWorkTypes.filter(fwt => fwt.label === workItem.worktype?.name)[0];
                        }).map(workItem => {
                            const date = new Date(workItem.date);
                            const author = chosenEmployees.filter(emp => emp.key.userLogin === workItem.author.login)[0];
                            if (!author) {
                                return;
                            }
                            return {
                                email: chosenEmployees.filter(emp => {
                                    return emp.key.userLogin === workItem.author.login
                                })[0].label,
                                date: getUtc(date)
                            }
                        }));
                    })));
        });
    }
    ;

    await Promise.all(promises);
    return workItems;
    //TODO:Call to backend!
};
