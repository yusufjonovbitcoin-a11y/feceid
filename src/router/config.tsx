import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import LoginPage from "../pages/login/page";
import DashboardPage from "../pages/dashboard/page";
import ClientsPage from "../pages/clients/page";
import ClientProfilePage from "../pages/clients/ClientProfile";
import QueuePage from "../pages/queue/page";
import SlotsPage from "../pages/slots/page";
import CalendarPage from "../pages/calendar/page";
import ServersPage from "../pages/servers/page";
import VideosPage from "../pages/videos/page";
import LogsPage from "../pages/logs/page";
import AnalyticsPage from "../pages/analytics/page";
import OperatorsPage from "../pages/operators/page";
import SettingsPage from "../pages/settings/page";
import Layout from "../components/feature/Layout";

const routes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <Layout><DashboardPage /></Layout>,
  },
  {
    path: "/dashboard",
    element: <Layout><DashboardPage /></Layout>,
  },
  {
    path: "/analytics",
    element: <Layout><AnalyticsPage /></Layout>,
  },
  {
    path: "/clients",
    element: <Layout><ClientsPage /></Layout>,
  },
  {
    path: "/clients/:id",
    element: <Layout><ClientProfilePage /></Layout>,
  },
  {
    path: "/queue",
    element: <Layout><QueuePage /></Layout>,
  },
  {
    path: "/slots",
    element: <Layout><SlotsPage /></Layout>,
  },
  {
    path: "/calendar",
    element: <Layout><CalendarPage /></Layout>,
  },
  {
    path: "/servers",
    element: <Layout><ServersPage /></Layout>,
  },
  {
    path: "/videos",
    element: <Layout><VideosPage /></Layout>,
  },
  {
    path: "/logs",
    element: <Layout><LogsPage /></Layout>,
  },
  {
    path: "/operators",
    element: <Layout><OperatorsPage /></Layout>,
  },
  {
    path: "/settings",
    element: <Layout><SettingsPage /></Layout>,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;