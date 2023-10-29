// it would be great to take time zones in account
const refreshHours = [1, 5, 9, 13, 17, 21];

module.exports = {
    nextHour : () => {
        const now = new Date()
        const currentHour = now.getHours();

        for (const hour of refreshHours) {
            if (currentHour < hour || hour == refreshHours[5]) {
                return hour;
            }
        }
    },
    nextTimestamp : () => {

        const now = new Date()
        const currentHour = now.getHours();

        for (const hour of refreshHours) {
            if (currentHour < hour || hour == refreshHours[5]) {
                now.setHours(hour,0,0,0);
                if (hour == refreshHours[5]) {
                    now.setDate(now.getDate() + 1);
                    now.setHours(1,0,0,0);
                }
                return now.getTime() / 1000;
            }
        }

        for (const hour of timesToTrack) {
        timestamps.push(getNextTimestamp(hour));
        }
    },
};