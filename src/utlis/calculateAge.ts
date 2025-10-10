export function calculateAge(dob: string) {
  const today = new Date();
  const birthDate = new Date(dob);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // adjust if birthday hasn't occurred yet this year
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

// export function formatDateWithAge(dob: string): string {
//   const birthDate = new Date(dob);
//   const today = new Date();

//   // Format date (e.g., "May 10, 1996")
//   const options: Intl.DateTimeFormatOptions = {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   };
//   const formattedDate = birthDate.toLocaleDateString("en-US", options);

//   // Calculate age
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const monthDiff = today.getMonth() - birthDate.getMonth();
//   if (
//     monthDiff < 0 ||
//     (monthDiff === 0 && today.getDate() < birthDate.getDate())
//   ) {
//     age--;
//   }

//   return `${formattedDate} (${age} y)`;
// }

export function formatDateWithAge(dob: string): string {
  // Parse DOB
  const [birthYearStr, birthMonthStr, birthDayStr] = dob.split("-");
  const birthYear = parseInt(birthYearStr, 10);
  const birthMonth = parseInt(birthMonthStr, 10);
  const birthDay = parseInt(birthDayStr, 10);

  // Get system date as reference
  const today = new Date();
  const refYear = today.getFullYear();
  const refMonth = today.getMonth() + 1; // getMonth() is 0-based
  const refDay = today.getDate();

  const formattedDate = formatReadableDate(dob);

  // Calculate age manually
  let age = refYear - birthYear;
  if (refMonth < birthMonth || (refMonth === birthMonth && refDay < birthDay)) {
    age--;
  }

  return `${formattedDate} (${age} y)`;
}



export function formatReadableDate(input: string): string {
  if (input) {
    const [year, month, day] = input.split("-");

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthName = months[parseInt(month, 10) - 1];
    return `${monthName} ${day}, ${year}`;
  } else {
    return ``;
  }
}

export function formatReadableDateWithDefault(dateStr: string): string {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

export function formatReadableDateWithoutDate(dateStr: string): string {
  const [year, month] = dateStr.split("-"); // expects "YYYY-MM" or "YYYY-MM-DD"

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthName = months[parseInt(month, 10) - 1];
  return `${monthName}, ${year}`;
}
