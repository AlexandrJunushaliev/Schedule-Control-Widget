export const get1cData = () => {
  return {
    users:
      [
        {
          email: "first",
          periods:
            [
              {
                from: "01.05",
                to: "02.05",
                plan: "2h"
              },
              {
                from: "03.05",
                to: "04.05",
                plan: "1h"
              }
            ]
        },
        {
          email: "second",
          periods:
            [
              {
                from: "04.05",
                to: "02.05",
                plan: "4h"
              }
            ]
        }
      ]
  }
}
