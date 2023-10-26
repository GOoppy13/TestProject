import { Weather } from "./components/Weather";
import { Upload } from "./components/Upload";
import { Home } from "./components/Home";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/weather',
    element: <Weather />
  },
  {
    path: '/upload_data_weather',
    element: <Upload />
  }
];

export default AppRoutes;
