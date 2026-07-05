import { createBrowserRouter } from 'react-router';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Buy from './pages/Buy';
import Sell from './pages/Sell';
import Rent from './pages/Rent';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/signup',
    Component: SignUp,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/buy',
    Component: Buy,
  },
  {
    path: '/sell',
    Component: Sell,
  },
  {
    path: '/rent',
    Component: Rent,
  },
  {
    path: '/cart',
    Component: Cart,
  },
  {
    path: '/checkout',
    Component: Checkout,
  },
  {
    path: '/profile',
    Component: Profile,
  },
]);