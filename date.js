function tomorrow () {
    //return Date.now() + 60000;
    let now = new Date();
    let tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 0, 0, 0);
    if (now.getUTCHours() >= 15) {
        tomorrow.setDate(tomorrow.getDate() + 1);
    }
    return tomorrow;
}
console.log(tomorrow());