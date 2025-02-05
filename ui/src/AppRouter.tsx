import { BrowserRouter, Route, Routes } from "react-router-dom";
import routes from "./constants/routes";
import Main from "./layout/Main";
import { ContactUs } from "./page/contact/ContactUs";
import CalendarComponent from "./page/appointment/CalendarComponent";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path={routes.login} element={<Login />} /> */}
        <Route path={routes.main} element={<Main />} />
        <Route
          path={routes.appointment}
          element={
            <Main>
              <CalendarComponent />
            </Main>
          }
        />
        <Route
          path={routes.contact}
          element={
            <Main>
              <ContactUs />
            </Main>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
