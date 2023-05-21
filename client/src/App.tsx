import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import Auth, { EAuthType } from './routes/Auth/Auth';
import Home from './routes/Home/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/signup',
    element: <Auth authType={EAuthType.SingUp} />,
  },
  {
    path: '/signin',
    element: <Auth authType={EAuthType.SingIn} />,
  },
]);

function App() {
  return (
    <div className='container'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
