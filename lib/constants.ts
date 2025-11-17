export interface Event {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string; // e.q., '2024-07-15'
  time: string; // e.q., "09:00 AM"
}

export const events: Event[] = [
  {
    title: 'AWS re:Invent 2024',
    image: '/images/event1.png',
    slug: 'aws-reinvent-2024',
    location: 'Las Vegas, NV · Las Vegas Convention Center',
    date: '2024-11-18',
    time: '09:00 AM - 06:00 PM'
  },
  {
    title: 'Google Cloud Next 2024',
    image: '/images/event2.png',
    slug: 'google-cloud-next-2024',
    location: 'San Francisco, CA · Moscone Convention Center',
    date: '2024-08-28',
    time: '09:00 AM - 06:00 PM'
  },
  {
    title: 'Apple WWDC 2024',
    image: '/images/event3.png',
    slug: 'apple-wwdc-2024',
    location: 'Cupertino, CA · Apple Park',
    date: '2024-06-10',
    time: '10:00 AM - 06:00 PM'
  },
  {
    title: 'Microsoft Build 2024',
    image: '/images/event4.png',
    slug: 'microsoft-build-2024',
    location: 'Seattle, WA · Washington State Convention Center',
    date: '2024-05-21',
    time: '09:00 AM - 06:00 PM'
  },
  {
    title: 'Facebook F8 Developer Conference 2024',
    image: '/images/event5.png',
    slug: 'facebook-f8-2024',
    location: 'San Jose, CA · McEnery Convention Center',
    date: '2024-04-25',
    time: '09:30 AM - 06:00 PM'
  },
  {
    title: 'Open Source Summit North America 2024',
    image: '/images/event6.png',
    slug: 'opensource-summit-north-america-2024',
    location: 'Austin, TX · Austin Convention Center',
    date: '2024-09-16',
    time: '08:00 AM - 06:00 PM'
  },
  {
    title: 'ReactConf 2024',
    image: '/images/event-full.png',
    slug: 'react-conf-2024',
    location: 'New Orleans, LA · Ernest N. Morial Convention Center',
    date: '2024-10-14',
    time: '09:00 AM - 05:30 PM'
  },
  {
    title: 'KubeCon + CloudNativeCon North America 2024',
    image: '/images/event1.png',
    slug: 'kubecon-cloudnativecon-2024',
    location: 'Salt Lake City, UT · Salt Palace Convention Center',
    date: '2024-10-29',
    time: '08:00 AM - 06:00 PM'
  },
  {
    title: 'PyCon US 2024',
    image: '/images/event2.png',
    slug: 'pycon-us-2024',
    location: 'Pittsburgh, PA · David L. Lawrence Convention Center',
    date: '2024-05-15',
    time: '08:00 AM - 06:00 PM'
  },
  {
    title: 'NodeConf EU 2024',
    image: '/images/event3.png',
    slug: 'nodeconf-eu-2024',
    location: 'Berlin, Germany · Station Berlin',
    date: '2024-09-23',
    time: '09:00 AM - 06:00 PM'
  },
  {
    title: 'GOTO Conference 2024',
    image: '/images/event4.png',
    slug: 'goto-conference-2024',
    location: 'Copenhagen, Denmark · Bella Center',
    date: '2024-06-10',
    time: '08:30 AM - 06:00 PM'
  },
  {
    title: 'DevOps Pro Europe 2024',
    image: '/images/event5.png',
    slug: 'devops-pro-europe-2024',
    location: 'Amsterdam, Netherlands · RAI Amsterdam',
    date: '2024-05-14',
    time: '09:00 AM - 05:30 PM'
  }
];

// 为页面提供精选事件数据
export const featuredEvents: Event[] = events.slice(0, 6);

// 为搜索和筛选功能提供事件数据
export const upcomingEvents: Event[] = events
  .filter(event => new Date(event.date) >= new Date())
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

// 为筛选功能提供按地点分组的事件
export const eventsByLocation: Record<string, Event[]> = events.reduce((acc, event) => {
  if (!acc[event.location]) {
    acc[event.location] = [];
  }
  acc[event.location].push(event);
  return acc;
}, {} as Record<string, Event[]>);