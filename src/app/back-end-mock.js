function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

export const get1cData = (emails, periods) => {
    const res = emails.map(email => {
        const newPeriods = periods.map(period => {
                return {
                    from: period.from.toLocaleDateString(),
                    to: period.to.toLocaleDateString(),
                    plan: randomInteger(1, 10)
                }
            }
        );
        return {email: email, periods: newPeriods}
    });
    return {users: res};
};
