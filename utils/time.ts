export function convertMonthToName(monthNumber: number) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[monthNumber];
}

export function convertDayToName(dayNumber: number) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayNumber];
}

export function getDateString(date: Date, format: string) {
    const time = date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric"
    });

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    switch (format) {
        case "t":
            return time;
        case "T":
            return date.toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                second: "numeric"
            });
        case "d":
            return `${month}/${day}/${year}`;
        case "D":
            return `${day} ${convertMonthToName(month)} ${year}`;
        case "F":
            return `${convertDayToName(date.getDay())}${day} ${convertMonthToName(month)} ${year} ${time}`;
        case "R":
            return getTimeAgo(date);
    }

    return `${day} ${convertMonthToName(month)} ${year} ${time}`;
}

export function getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
        return seconds === 1 ? "a second ago" : `${seconds} seconds ago`;
    } else if (minutes < 60) {
        return minutes === 1 ? "a minute ago" : `${minutes} minutes ago`;
    } else if (hours < 24) {
        return hours === 1 ? "an hour ago" : `${hours} hours ago`;
    } else if (days < 30) {
        return days === 1 ? "a day ago" : `${days} days ago`;
    } else if (months < 12) {
        return months === 1 ? "a month ago" : `${months} months ago`;
    } else {
        return years === 1 ? "a year ago" : `${years} years ago`;
    }
}