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
            if (currentHour < hour) {
                now.setHours(hour,0,0,0);
                break;
            }
            if (hour != refreshHours[5]) continue
            now.setDate(now.getDate() + 1);
            now.setHours(1,0,0,0);
        }
        
        return now.getTime() / 1000;
    },
};