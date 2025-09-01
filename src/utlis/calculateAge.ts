export function calculateAge(dob:string) {
  const today = new Date();
  const birthDate = new Date(dob);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // adjust if birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export function formatDateWithAge(dob: string): string {
  const birthDate = new Date(dob);
  const today = new Date();

  // Format date (e.g., "May 10, 1996")
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = birthDate.toLocaleDateString("en-US", options);

  // Calculate age
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return `${formattedDate} (${age} y)`;
}

export function formatReadableDate(dateStr: string): string {
  const date = new Date(dateStr);

  const options: Intl.DateTimeFormatOptions = { 
    year: "numeric", 
    month: "short", 
    day: "2-digit" 
  };

  return date.toLocaleDateString("en-US", options);
}

export function formatReadableDateWithoutDate(dateStr: string): string {
  const date = new Date(dateStr);

  const options: Intl.DateTimeFormatOptions = { 
    year: "numeric", 
    month: "short", 
  };

  return date.toLocaleDateString("en-US", options);
}
