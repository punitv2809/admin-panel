import Layout from './components/Layout'
import { ThemeProvider } from './components/theme-provider'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Login from './components/ui/Main/Login';
import Settings from './components/ui/Apps/Admin/Settings';
import Setup from './components/ui/Apps/Admin/Setup';
import List from './components/ui/Apps/Admin/Channel/List';
import AppsList from './components/ui/Apps/Admin/Apps/List';

const routes = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
    index: true, // default /login route
  },
  {
    path: "/app",
    element: <Layout />,
    children: [
      {
        index: true, // default /app route
        element: <p>cool</p>,
      },
      {
        path: "admin/settings",
        element: <Settings />,
      },
      {
        path: "admin/settings/setup",
        element: <Setup />,
      },
      {
        path: "admin/channels",
        element: <List />,
      },
      {
        path: "admin/apps",
        element: <AppsList />,
      },
    ],
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={routes} />
    </ThemeProvider>
  )
}

export default App
