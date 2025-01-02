function calcAge(birthday, at) {
    at = at || new Date();
    const b = {
        year: birthday.getFullYear(),
        month: birthday.getMonth(),
        day: birthday.getDate()
    };
    const a = {
        year: at.getFullYear(),
        month: at.getMonth(),
        day: at.getDate()
    };
    if (a.year <= b.year) {
        return 0;
    }
    else {
        if (a.month > b.month) {
            return a.year - b.year;
        }
        else if (a.month < b.month) {
            return a.year - b.year - 1;
        }
        else { // same month
            if (a.day >= b.day) {
                return a.year - b.year;
            }
            else {
                return a.year - b.year - 1;
            }
        }
    }
}
export { calcAge };
