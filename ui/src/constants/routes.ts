const routes = {
  login: "/login",
  main: "/",
  appointment: "/appointment",
  myAppointment: "/appointment/:userId",
  contact: "/contact",
  instructor: "/instructor",
  user: "/user",
  room: "/room",
  playGroups: "/playGroups",
  notes: "/notes",
} as const;

export default routes;
