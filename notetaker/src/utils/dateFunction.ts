export function formatToETA(date) {
  // Get date components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  
  // Get time components
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  // Get timezone offset in minutes
  const timezoneOffset = -date.getTimezoneOffset();
  const offsetHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0');
  const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0');
  const sign = timezoneOffset >= 0 ? '+' : '-';

  // Build the final ETA string
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetMinutes}`;
}

export function formatETA(eta: any) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
    timeZoneName: 'short'
  };

  return eta.toLocaleString('en-US', options);
}

export function formatDate(eta: string) {
  const etaString= eta?.slice(0, -3)
  const etaDate = new Date(etaString); 
  return etaDate
}




export const isDateInFuture = (eta:string) => {
  const currentDate = new Date(); 
  const etaString= eta?.slice(0, -3)
  const etaDate = new Date(etaString); 

  // console.log(new Date(etaString),{currentDate});
  

  return etaDate>currentDate
};



  