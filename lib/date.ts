export function calculateDate(date = 0){
    let today = new Date()
  let newDate = new Date(today.setDate(today.getDate() + date));
  return newDate.toISOString().split("T")[0];
}