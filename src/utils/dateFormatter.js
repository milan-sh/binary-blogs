export const formateDate = (date)=>{
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const newDate = new Date(date)
    return `${newDate.getDate()} ${months[newDate.getMonth()]}, ${newDate.getFullYear()}`
}