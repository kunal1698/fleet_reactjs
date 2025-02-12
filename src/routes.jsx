import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Navigate, Route, useNavigate, HashRouter } from 'react-router-dom';

// project import
import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

import { BASE_URL } from './config/constant';

// ==============================|| ROUTES ||============================== //
const userDataString = sessionStorage.getItem('userData');

const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;
        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

export const routes = [
  {
    exact: 'true',
    path: '/auth/signup-1',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  {
    exact: 'true',
    path: '/demo',
    element: lazy(() => import('./views/Master/Demo'))
  },
  !userDataString && {
    exact: 'true',
    path: '/',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/auth/reset-password-1',
    element: lazy(() => import('./views/auth/reset-password/ResetPassword1'))
  },
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        exact: 'true',
        path: '/dashboard/',
        element: lazy(() => import('./views/dashboard'))
      },
      {
        exact: 'true',
        path: '/UserMaster',
        element: lazy(() => import('./views/Master/UserMaster')),
        private: true
      },
      {
        exact: 'true',
        path: '/UserRole',
        element: lazy(() => import('./views/Master/UserRole'))
      },

      {
        exact: 'true',
        path: '/VehicleMaster',
        element: lazy(() => import('./views/Master/VehicleMaster'))
      },

      {
        exact: 'true',
        path: '/TransportMaster',
        element: lazy(() => import('./views/Master/TransportMaster'))
      },
      {
        exact: 'true',
        path: '/DriverMaster',
        element: lazy(() => import('./views/Master/DriverMaster'))
      },
      {
        exact: 'true',
        path: '/DriverMaster',
        element: lazy(() => import('./views/Master/DriverMaster'))
      },
      {
        exact: 'true',
        path: '/BranchMaster',
        element: lazy(() => import('./views/Master/BranchMaster'))
      },

      {
        exact: 'true',
        path: '/ConsignorMaster',
        element: lazy(() => import('./views/Master/Consignor'))
      },
      {
        exact: 'true',
        path: '/ConsigneeMaster',
        element: lazy(() => import('./views/Master/ConsigneeMaster'))
      },

      {
        exact: 'true',
        path: '/ParentalOffice',
        element: lazy(() => import('./views/Master/BillingOfficeMaster'))
      },
      {
        exact: 'true',
        path: '/BillingPartyMaster',
        element: lazy(() => import('./views/Master/BillingPartyMaster'))
      },
      {
        exact: 'true',
        path: '/RouteMaster',
        element: lazy(() => import('./views/Master/RouteMaster'))
      },
      {
        exact: 'true',
        path: '/MaterialGroup',
        element: lazy(() => import('./views/Master/MaterialGroup'))
      },
      {
        exact: 'true',
        path: '/Material',
        element: lazy(() => import('./views/Master/Material'))
      },
      {
        exact: 'true',
        path: '/StationaryMaster',
        element: lazy(() => import('./views/Master/StationaryMaster'))
      },
      {
        exact: 'true',
        path: '/ServiceProvider',
        element: lazy(() => import('./views/Master/ClientMaster'))
      },
      {
        exact: 'true',
        path: '/ConsignorAndConsignee',
        element: lazy(() => import('./views/Master/ConsignorAndConsignee'))
      },
      {
        exact: 'true',
        path: '/POMaster',
        element: lazy(() => import('./views/Master/POMaster'))
      },
      {
        exact: 'true',
        path: '/POMaster',
        element: lazy(() => import('./views/Master/POMaster'))
      },
      {
        exact: 'true',
        path: '/LorryArrival',
        element: lazy(() => import('./views/Master/LorryArrival'))
      },
      {
        exact: 'true',
        path: '/report',
        element: lazy(() => import('./views/Master/Report'))
      },
      {
        exact: 'true',
        path: '/DeliveryChallan',
        element: lazy(() => import('./views/Master/DeliveryChallan'))
      },
      {
        exact: 'true',
        path: '/TransporterRouteMapping',
        element: lazy(() => import('./views/Master/TransporterRouteMapping'))
      },

      {
        exact: 'true',
        path: '/UpdatePassword',
        element: lazy(() => import('./views/Master/UpdatePassword'))
      },
      {
        exact: 'true',
        path: '/LorryArrivalReport',
        element: lazy(() => import('./views/Master/LorryArrivalReport'))
      },
      {
        exact: 'true',
        path: '/DeliveryChallanReport',
        element: lazy(() => import('./views/Master/DeliveryChallanReport'))
      },
      {
        exact: 'true',
        path: '/CompileReport',
        element: lazy(() => import('./views/Master/CompileReport'))
      },

      {
        exact: 'true',
        path: '/POAgeingReport',
        element: lazy(() => import('./views/Master/POAgeingReport'))
      },

      !userDataString && {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default renderRoutes;
