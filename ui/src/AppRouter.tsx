import { BrowserRouter, Route, Routes } from "react-router-dom";
import routes from "./constants/routes";
import Main from "./layout/AppLayout";
import { ContactUs } from "./page/contact/ContactUs";
import CalendarComponent from "./page/appointment/CalendarComponent";
import InstructorOverview from "./page/instructor/InstructorOverview";
import UserOverview from "./page/user/UserOverwiew";
import RoomOverview from "./page/rooms/RoomOverview";
import PlayGroupOverview from "./page/playgroups/PlayGroupOverview";
import NoteBook from "./page/note/NoteBook";
import { RequireAuthentication } from "./authentication/AuthenticationContext";
import UserRelationManager from "./page/userprofile/UserRelationManager";
import Login from "./page/login/Login";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.login} element={<Login />} />
        <Route
          path={routes.main}
          element={
            <RequireAuthentication>
              <Main />
            </RequireAuthentication>
          }
        />
        <Route
          path={routes.appointment}
          element={
            <RequireAuthentication>
              <Main>
                <CalendarComponent />
              </Main>
            </RequireAuthentication>
          }
        />
        <Route
          path={routes.myAppointment}
          element={
            <RequireAuthentication>
              <Main>
                <CalendarComponent />
              </Main>
            </RequireAuthentication>
          }
        />
        <Route
          path={routes.contact}
          element={
            <RequireAuthentication>
              <Main>
                <ContactUs />
              </Main>
            </RequireAuthentication>
          }
        />
        <Route
          path={routes.user}
          element={
            <RequireAuthentication>
              <Main>
                <UserOverview />
              </Main>
            </RequireAuthentication>
          }
        />
        <Route
          path={routes.instructor}
          element={
            <RequireAuthentication>
              <Main>
                <InstructorOverview />
              </Main>
            </RequireAuthentication>
          }
        />
        <Route
          path={routes.room}
          element={
            <RequireAuthentication>
              <Main>
                <RoomOverview />
              </Main>
            </RequireAuthentication>
          }
        />
        <Route
          path={routes.playGroups}
          element={
            <RequireAuthentication>
              <Main>
                <PlayGroupOverview />
              </Main>
            </RequireAuthentication>
          }
        />
        <Route
          path={routes.notes}
          element={
            <RequireAuthentication>
              <Main>
                <NoteBook />
              </Main>
            </RequireAuthentication>
          }
        />
        <Route
          path={routes.myNote}
          element={
            <RequireAuthentication>
              <Main>
                <NoteBook />
              </Main>
            </RequireAuthentication>
          }
        />
        <Route
          path={routes.userRelation}
          element={
            <RequireAuthentication>
              <Main>
                <UserRelationManager />
              </Main>
            </RequireAuthentication>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
