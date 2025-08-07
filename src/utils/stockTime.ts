// it would be great to take time zones in account
const refreshHours: number[] = [0, 4, 8, 12, 16, 18];

// todo merge this and getCurrentStock
export default {
    nextHour : (): number => {
        const now = new Date()
        const currentHour = now.getHours();

        for (const hour of refreshHours) {
            if (currentHour < hour) return hour;
            if (hour == refreshHours[5]) return refreshHours[0] || 0;
        }

        throw new Error("No next hour found in refresh hours");
    },
    nextTimestamp : (): number => {

        const now = new Date()
        const currentHour = now.getHours();

        for (const hour of refreshHours) {
            if (currentHour < hour) {
                now.setHours(hour,0,0,0);
                break;
            }
            if (hour != refreshHours[5]) continue;
            now.setDate(now.getDate() + 1);
            now.setHours(refreshHours[0] || 0,0,0,0);
        }
        
        return now.getTime() / 1000;
    },
};