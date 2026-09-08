import { useQuery } from 'react-query';
import { CLASSES } from '../Api/Api';
import { Axios } from '../Api/axios';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import CalendarLayout from '../layout/Calendar';
import { useContext, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { parse } from 'date-fns';
import { adjustStartTimeWithOffset } from '../helpers/TransformDate';
import { UserContext } from '../Context/loggedInUser';

const Calendar = () => {
  const [month, setMonth] = useState<number>();
  const [year, setYear] = useState();

  const { data: classes, isLoading } = useQuery({
    queryFn: () =>
      Axios.get(
        `${CLASSES}/month-year?month=${month}&year=${year}&status=scheduled`,
      ),
    queryKey: ['classesCalander', month, year],
  });

  const { loggedInUser } = useContext(UserContext);

  const events = classes?.data?.data?.map((item: any) => {
    // Parse the date string into a Date object
    const parsedDate = parse(
      adjustStartTimeWithOffset(
        item?.start_time,
        item?.start_date,
        loggedInUser?.timezone,
      )?.adjustedDate,
      'dd/MM/yyyy',
      new Date(),
    );

    // Parse the time string into a Date object
    const parsedTime = parse(
      adjustStartTimeWithOffset(
        item?.start_time,
        item?.start_date,
        loggedInUser?.timezone,
      )?.adjustedTime,
      'h:mm a',
      new Date(),
    );

    // Combine the date and time into a single Date object
    const combinedDateTime = new Date(
      parsedDate.getFullYear(),
      parsedDate.getMonth(),
      parsedDate.getDate(),
      parsedTime.getHours(),
      parsedTime.getMinutes(),
    );
    return {
      title: item.name,
      start: combinedDateTime,
    };
  });

  const handleDatesSet = (dateInfo: any) => {
    const currentMonth = dateInfo.view.currentStart.getMonth() + 1;
    const currentYear = dateInfo.view.currentStart.getFullYear();
    setMonth(currentMonth);
    setYear(currentYear);
  };

  function renderEventContent(eventInfo: any) {
    console.log(eventInfo);
    return (
      <div className="event mb-1 text-primary text-opacity-80 rounded-sm border-l-[3px] border-primary bg-gray px-3 py-1 text-left  group-hover:visible group-hover:opacity-100 dark:bg-primary dark:text-white dark:text-opacity-70 w-full text-wrap	">
        <h5>
          {eventInfo.timeText}
          <span className="font-bold"> {eventInfo.event.title}</span>
        </h5>
      </div>
    );
  }

  return (
    <CalendarLayout>
      <Breadcrumb pageName="Calendar" />
      <FullCalendar
        plugins={[dayGridPlugin]}
        dayMaxEvents={3}
        initialView="dayGridMonth"
        events={events}
        eventContent={renderEventContent}
        datesSet={handleDatesSet}
        viewClassNames={'w-full'}
        dayCellClassNames={'bg-white dark:bg-boxdark '}
        dayHeaderClassNames={
          'bg-primary text-white text-center !py-4 items-center'
        }
        eventBackgroundColor="bg-primary"
      />
    </CalendarLayout>
  );
};

export default Calendar;
