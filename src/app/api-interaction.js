import {getUtc} from "./date-helper";

export const getReportData = async (dashboardApi, chosenEmployees) => {
  let workItems = [];
  let serviceId = "";
  let promises = [];
  await dashboardApi.fetchHub("rest/services").then(servicesPage => {
    serviceId = servicesPage.services.filter(service => service.name === "YouTrack")[0].id;
  });
  await dashboardApi.fetch(serviceId, "rest/issue?with=id&max=30000").then(issues => {
    issues.issue.forEach(issue =>
      promises = promises.concat(dashboardApi.fetch(serviceId, `rest/issue/${issue.id}/timetracking/workitem`)
        .then(returnedWorkItems => {
          workItems = workItems.concat(returnedWorkItems.map(workItem => {
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
  await Promise.all(promises);
  return workItems;
  //TODO:Call to backend!
};
