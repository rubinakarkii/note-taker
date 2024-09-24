export function formatToISO8601(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const offset = "+00:00"; // Adjust this for your specific timezone

  return `${year}-${month}-${day}T${hours}:${minutes}:00${offset}`;
}

export function formatETA(eta: any) {
  const date = new Date(eta);
  // Format to: "Wednesday, September 4, 2024, 03:45 PM"
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleString("en-US", options);
}

export const isDateInFuture = (eta) => {
    const currentDate = new Date();
    const etaDate = new Date(eta);
    return etaDate > currentDate; // Returns true if etaDate is in the future
  };