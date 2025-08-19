const routes = {
  login: "/login",
  main: "/",
  appointment: "/appointment",
  myAppointment: "/appointment/:userId",
  myNote: "/notes/:userId",
  contact: "/contact",
  instructor: "/instructor",
  user: "/user",
  room: "/room",
  playGroups: "/playGroups",
  notes: "/notes",
  userRelation: "/userRelation",
  profile: "/profile"
} as const;

export default routes;
