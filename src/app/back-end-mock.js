function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

export const get1cData = (emails, periods) => {
    const res = emails.map(email => {
        const newPeriods = periods.map(period => {
                return {
                    from: period.from.toISOString(),
                    to: period.to.toISOString(),
                    plan: randomInteger(1, 10)
                }
            }
        );
        return {email: email, periods: newPeriods}
    });
    const response = {users: res};
    response.users
        .forEach(user => user.periods
            .forEach(period => period.label = periods
                .filter(reqPeriod => reqPeriod.from.toISOString() === period.from && reqPeriod.to.toISOString() === period.to)[0].label))
    return response;
};
