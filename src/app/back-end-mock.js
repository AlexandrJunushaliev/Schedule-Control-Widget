function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

export const get1cData = async (emails, periods, userId) => {
    let response = await postData("https://localhost:5001/api/post", {
        emails, periods: periods.map(period => {
            return {from: period.from.toISOString(), to: period.to.toISOString()}
        }), userId
    });
    response.users
        .forEach(user => user.periods
            .forEach(period => period.label = periods
                .filter(reqPeriod => reqPeriod.from.toISOString() === period.from && reqPeriod.to.toISOString() === period.to)[0].label));
    return response;
};

async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}
