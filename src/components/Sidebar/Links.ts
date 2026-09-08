import {
  faBook,
  faBookOpen,
  faBoxArchive,
  faCalendar,
  faCalendarDays,
  faCloudSunRain,
  faEnvelopeCircleCheck,
  faFileInvoice,
  faFileInvoiceDollar,
  faFolder,
  faHouse,
  faInbox,
  faMessage,
  faUserGraduate,
  faUserTag,
  faUsers,
  faFileAlt,
  faBuildingColumns,
} from '@fortawesome/free-solid-svg-icons';
import {
  SUPERADMIN,
  TEACHER,
  STUDENT,
  GUEST,
  ADMIN,
} from '../../pages/Authentication/UserType';

export const Links = [
  {
    title: 'Timeline',
    link: '/',
    icon: faHouse,
    roles: [STUDENT, GUEST, TEACHER, ADMIN, SUPERADMIN],
  },
  {
    title: 'Messaging',
    link: '/messaging',
    icon: faMessage,
    roles: [STUDENT, TEACHER, ADMIN, SUPERADMIN],
    hasLinks: [
      {
        title: 'All Chats',
        icon: faInbox,
        path: 'chats',
      },
      {
        title: 'Support Chats',
        icon: faEnvelopeCircleCheck,
        path: 'support',
      },
    ],
  },
  {
    title: 'Users',
    link: '/users',
    icon: faUsers,
    roles: [ADMIN, SUPERADMIN],
  },
  {
    title: 'LMS',
    link: '/lms',
    icon: faBook,
    roles: [STUDENT, ADMIN, SUPERADMIN],
    hasLinks: [
      {
        title: 'books',
        icon: faBookOpen,
        path: 'products',
      },
      {
        title: 'Courses',
        icon: faCloudSunRain,
        path: 'courses',
      },
    ],
  },

  {
    title: 'Classes',
    link: '/classes',
    icon: faUsers,
    roles: [STUDENT, GUEST, TEACHER, ADMIN, SUPERADMIN],
    hasLinks: [
      {
        title: 'My Classes',
        icon: faUserGraduate,
        path: 'my-classes',
      },
      {
        title: 'Assignments',
        icon: faUserTag,
        path: 'my-assignments',
        roles: [STUDENT, GUEST, ADMIN, SUPERADMIN],
      },
      {
        title: 'Monthly Report',
        icon: faUserTag,
        path: 'monthly-report',
      },
    ],
  },
  {
    title: 'Subscriptions',
    link: '/subscriptions',
    icon: faFileInvoice,
    roles: [ADMIN, SUPERADMIN, STUDENT, GUEST],
    hasLinks: [
      {
        title: 'Invoices',
        icon: faFileInvoiceDollar,
        path: 'invoices',
        roles: [SUPERADMIN, ADMIN, STUDENT],
      },
      {
        title: 'Bank Transfers',
        icon: faBuildingColumns,
        path: 'bank-transfers',
        roles: [SUPERADMIN, ADMIN],
      },
      {
        title: 'Packages',
        icon: faBoxArchive,
        path: 'packages',
      },
    ],
  },

  {
    title: 'Calendar',
    link: '/calendar',
    icon: faCalendarDays,
    roles: [STUDENT, TEACHER, ADMIN, SUPERADMIN],
  },
  {
    title: 'Materials',
    link: '/materials',
    icon: faFolder,
    roles: [STUDENT, TEACHER, ADMIN, SUPERADMIN],
  },
  {
    title: 'Forms',
    link: '/forms',
    icon: faFileAlt,
    roles: [ADMIN, SUPERADMIN],
  },
];
