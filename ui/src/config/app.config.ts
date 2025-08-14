export interface ServiceUrls {
  coreUrl: string;
  authorizationsUrl: string;
  coreRefreshUrl: string;
  userUrl: string;
  appointmentUrl: string;
  appointmentRoomsUrl: string;
  appointmentPlayGroupUrl: string;
  noteUrl: string; // Notlar için eklenebilir
  profileGroupUrl: string; // Profil Grupları için eklenebilir
}

interface Endpoints {
  // Core Service
  authenticate: string;
  authorizations: string;
  refreshAuthentication: string;

  // User Service
  user: string;
  appointment: string;
  room: string;
  playGroup: string;
  note: string;
  profileGroup: string;
}

interface ServiceAddress {
  coreService: string;
  userService: string;
  appointmentService: string;
  noteService?: string; // Notlar için eklenebilir
}

export const endpoints: Endpoints = {
  // Core Service
  authenticate: "authenticate",
  refreshAuthentication: "refresh-authentication",
  user: "user",
  appointment: "appointments",
  room: "room",
  playGroup: "playGroups",
  note: "notes", // Notlar için eklenebilir
  authorizations: "authorizations",
  profileGroup: "profileGroups",
} as const;

export const services: ServiceAddress = {
  coreService: `https://localhost:5030/api`,
  userService: `https://localhost:5031/api`,
  appointmentService: `https://localhost:5032/api`,
  noteService: `https://localhost:5033/api`,
} as const;

export const apiUrl: ServiceUrls = {
  // Core Service
  coreUrl: `${services.coreService}/${endpoints.authenticate}`,
  authorizationsUrl: `${services.coreService}/${endpoints.authorizations}`,
  coreRefreshUrl: `${services.coreService}/${endpoints.refreshAuthentication}`,
  userUrl: `${services.userService}/${endpoints.user}`,
  appointmentUrl: `${services.appointmentService}/${endpoints.appointment}`,
  appointmentRoomsUrl: `${services.appointmentService}/${endpoints.room}`,
  appointmentPlayGroupUrl: `${services.appointmentService}/${endpoints.playGroup}`,
  noteUrl: `${services.noteService}/${endpoints.note}`,
  profileGroupUrl: `${services.userService}/${endpoints.profileGroup}`,
};

export function createRequestUrl(
  requestUrl: string,
  id?: string,
  subEndpoint?: string,
  subId?: string
): string {
  return id && subEndpoint && subId
    ? `${requestUrl}/${id}/${subEndpoint}/${subId}`
    : id && subEndpoint
    ? `${requestUrl}/${id}/${subEndpoint}`
    : id
    ? `${requestUrl}/${id}`
    : requestUrl;
}
