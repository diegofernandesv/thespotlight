import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";


import QuizRoute from "./views/QuizRoute";
import MainScreen from "./views/MainScreen";
import TakeAPhoto from "./views/TakeAPhoto";
import SelectQuote from "./views/SelectQuote";
import Consent from "./views/Consent";



const router = createBrowserRouter([
  {
    path: "/thespotlight/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <MainScreen />,
      },
      { path: "quiz",
        element: <QuizRoute />
      },
      { path: "photo",
        element: <TakeAPhoto />
      },
      { path: "quote",
        element: <SelectQuote />
      },
      { path: "consent",
        element: <Consent />
      },
    ],
  },
]);

function App() {
  

  return (
    <RouterProvider router={router} />
  );
}

export default App;
