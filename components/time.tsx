export function formatDate(dateString: string, userLanguage: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const options: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "numeric"
    };

    const dateFormatter = new Intl.DateTimeFormat(userLanguage, options);

    if (date.toDateString() === today.toDateString()) {
        return `Today at ${dateFormatter.format(date)}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday at ${dateFormatter.format(date)}`;
    }
    return date.toLocaleDateString(userLanguage);

}