exports.timeLeftToDue = (dueTime) => {
    return dueTime - (new Date()).getTime();
}