export interface ServiceUrls {
  coreUrl: string;
  coreRefreshUrl: string;
  userUrl: string;
  appointmentUrl: string;
  appointmentRoomsUrl: string;
  appointmentPlayGroupUrl: string;
}

interface Endpoints {
  // Core Service
  authenticate: string;
  refreshAuthentication: string;

  // User Service
  user: string;
  appointment: string;
  room: string;
  playGroup: string;
}

interface ServiceAddress {
  coreService: string;
  userService: string;
  appointmentService: string;
}

export const endpoints: Endpoints = {
  // Core Service
  authenticate: "authenticate",
  refreshAuthentication: "refresh-authentication",
  user: "user",
  appointment: "appointments",
  room: "room",
  playGroup: "playGroups",
} as const;

export const services: ServiceAddress = {
  coreService: `https://localhost:5001/api`,
  userService: `https://localhost:5002/api`,
  appointmentService: `https://localhost:5003/api`,
} as const;

export const apiUrl: ServiceUrls = {
  // Core Service
  coreUrl: `${services.coreService}${endpoints.authenticate}`,
  coreRefreshUrl: `${services.coreService}${endpoints.refreshAuthentication}`,
  userUrl: `${services.userService}/${endpoints.user}`,
  appointmentUrl: `${services.appointmentService}/${endpoints.appointment}`,
  appointmentRoomsUrl: `${services.appointmentService}/${endpoints.room}`,
  appointmentPlayGroupUrl: `${services.appointmentService}/${endpoints.playGroup}`,
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
