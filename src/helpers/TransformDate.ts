import moment from 'moment-timezone';

export default function TransformDate(date: any) {
  const selectedDate = new window.Date(date);
  const getFullYear = selectedDate.getFullYear();
  const getMonth = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
  const getDay = selectedDate.getDate().toString().padStart(2, '0');
  return `${getFullYear}-${getMonth}-${getDay}`;
}

export const TransformDateDD = (date: any) => {
  const selectedDate = new window.Date(date);
  const getFullYear = selectedDate.getFullYear();
  const getMonth = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
  const getDay = selectedDate.getDate().toString().padStart(2, '0');
  return `${getDay}/${getMonth}/${getFullYear}`;
};

export const TransformDateAndHour = (date: any) => {
  const selectedDate = new window.Date(date);
  const getFullYear = selectedDate.getFullYear();
  const getMonth = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
  const getDay = selectedDate.getDate().toString().padStart(2, '0');
  const getHours = selectedDate.getHours().toString().padStart(2, '0');
  const getMinutes = selectedDate.getMinutes().toString().padStart(2, '0');
  return `${getFullYear}-${getMonth}-${getDay} ${getHours}:${getMinutes}`;
};

export const TransformTime = (time: any) => {
  const [hour, minute] = time.split(':');
  let formattedHour = parseInt(hour, 10);
  let ampm = 'AM';

  if (formattedHour >= 12) {
    formattedHour -= 12;
    ampm = 'PM';
  }
  if (formattedHour === 0) {
    formattedHour = 12;
  }

  return `${formattedHour}:${minute} ${ampm}`;
};

export const adjustDateByHours = (date: any, hours: any) => {
  const adjustedDate = new Date(date);
  adjustedDate.setHours(adjustedDate.getHours() + hours);
  return adjustedDate;
};

// Transform Time
export const getTime = (dateC: Date) => {
  const date = new Date(dateC);
  const hours = date.getUTCHours() % 12 || 12; // Convert to 12-hour format
  const formattedHours = hours.toString().padStart(2, '0');
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  return `${formattedHours}:${minutes}:${seconds}`;
};

// Transform TimeZone

export const getTimezoneObject = (timezoneString: string) => {
  const tz = moment.tz(timezoneString);

  if (!tz) {
    throw new Error(`Invalid timezone string: ${timezoneString}`);
  }

  const offsetMinutes = tz.utcOffset();
  const offsetHours = offsetMinutes / 60;

  return {
    value: timezoneString,
    label: `${timezoneString} (UTC${
      offsetHours >= 0 ? '+' : ''
    }${offsetHours})`,
    offset: offsetHours,
  };
};

export const adjustStartTimeWithOffset = (
  startTime: string,
  startDate: string,
  timezoneString: string,
) => {
  // Get the timezone object
  const timezoneObj = getTimezoneObject(timezoneString);

  // Combine start time and start date into a single moment object
  const combinedDateTime = moment.tz(
    `${startDate} ${startTime}`,
    'DD/MM/YYYY h:mm A',
    'UTC',
  );

  // Adjust the date and time using the offset
  const adjustedDateTime = combinedDateTime.add(timezoneObj.offset, 'hours');

  // Format the adjusted date and time to the desired format
  const adjustedTime = adjustedDateTime.format('h:mm A');
  const adjustedDate = adjustedDateTime.format('DD/MM/YYYY');

  return {
    adjustedTime,
    adjustedDate,
  };
};

export const shouldShowZoomLink = (
  startTime: string,
  startDate: string,
  timezoneString: string,
) => {
  const combinedDateTime = moment.tz(
    `${startDate} ${startTime}`,
    'DD/MM/YYYY h:mm A',
    'utc',
  );

  const currentTime = moment().tz(timezoneString);

  const diffInMinutes = combinedDateTime.diff(currentTime, 'minutes');

  return diffInMinutes <= 30;
};
