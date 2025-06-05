import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";


import QuizRoute from "./views/QuizRoute";
import MainScreen from "./views/MainScreen";



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
    ],
  },
]);

function App() {
  

  return (
    <RouterProvider router={router} />
  );
}

export default App;
