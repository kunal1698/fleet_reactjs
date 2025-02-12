import React, { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ConfigContext } from '../../../contexts/ConfigContext';
import useWindowSize from '../../../hooks/useWindowSize';
import NavContent from './NavContent';

// ==============================|| NAVIGATION ||============================== //

const Navigation = () => {
  const configContext = useContext(ConfigContext);
  const { layoutType, collapseMenu } = configContext.state;
  const permissionRole = useSelector((state) => state.value) || [];
  const windowSize = useWindowSize();

  const menuItems = useMemo(() => {
    const getPermission = (mainMenu, subMenu) => {
      const item = (Array.isArray(permissionRole) ? permissionRole : []).find((p) => p.MainMenu === mainMenu && p.SubMenu === subMenu);
      return item && item.pread === 1;
    };

    return {
      items: [
        {
          id: 'navigation',
          title: 'dashboard',
          type: 'group',
          icon: 'icon-navigation',
          children: [
            getPermission('Dashboard', 'Dashboard') && {
              id: 'dashboard',
              title: 'Dashboard',
              type: 'item',
              icon: 'feather icon-home',
              url: '/dashboard/'
            }
          ].filter(Boolean) // Filter out falsy values
        },
        {
          id: 'utilities',
          title: 'Masters',
          type: 'group',
          icon: 'icon-ui',
          children: [
            {
              id: 'Master',
              title: 'Master',
              type: 'collapse',
              icon: 'feather icon-settings',
              children: [
                getPermission('Master', 'Branch') && {
                  id: 'BranchMaster',
                  title: 'Branch',
                  type: 'item',
                  url: '/BranchMaster'
                },
                getPermission('Master', 'Consignor/Consignee') && {
                  id: 'ConsignorMaster',
                  title: 'Consignor / Consignee',
                  type: 'item',
                  url: '/ConsignorMaster'
                },
                getPermission('Master', 'Driver') && {
                  id: 'TransportMaster',
                  title: 'Driver',
                  type: 'item',
                  url: '/DriverMaster'
                },
                getPermission('Master', 'Material') && {
                  id: 'Material',
                  title: 'Material',
                  type: 'item',
                  url: '/Material'
                },

                getPermission('Master', 'Parental Office') && {
                  id: 'BillingofficeMaster',
                  title: 'Parental Office',
                  type: 'item',
                  url: '/ParentalOffice'
                },
                getPermission('Master', 'PO') && {
                  id: 'POMaster',
                  title: 'PO',
                  type: 'item',
                  url: '/POMaster'
                },
                getPermission('Master', 'Route') && {
                  id: 'RouteMaster',
                  title: 'Route',
                  type: 'item',
                  url: '/RouteMaster'
                },

                getPermission('Master', 'Service Provider') && {
                  id: 'ClientMaster',
                  title: 'Service Provider',
                  type: 'item',
                  url: '/ServiceProvider'
                },
                getPermission('Master', 'Stationary') && {
                  id: 'StationaryMaster',
                  title: 'Stationary',
                  type: 'item',
                  url: '/StationaryMaster'
                },
                getPermission('Master', 'Transporter') && {
                  id: 'TransportMaster',
                  title: 'Transporter',
                  type: 'item',
                  url: '/TransportMaster'
                },

                getPermission('Master', 'Transporter Route Mapping') && {
                  id: 'TransporterRouteMapping',
                  title: 'Transporter Route Mapping',
                  type: 'item',
                  url: '/TransporterRouteMapping'
                },
                getPermission('Master', 'User') && {
                  id: 'User',
                  title: 'User',
                  type: 'item',
                  url: '/UserMaster'
                },
                getPermission('Master', 'User Role') && {
                  id: 'UserRole',
                  title: 'User Role',
                  type: 'item',
                  url: '/UserRole'
                },

                getPermission('Master', 'Vehicle') && {
                  id: 'VehicleMaster',
                  title: 'Vehicle',
                  type: 'item',
                  url: '/VehicleMaster'
                }
              ].filter(Boolean) // Filter out falsy values
            }
          ].filter(Boolean) // Filter out falsy values
        },
        (getPermission('Operations', 'Consingnment') ||
          getPermission('Operations', 'Lorry Arrival') ||
          getPermission('Operations', 'DC Received')) && {
          id: 'operations',
          title: 'Operations',
          type: 'group',
          icon: 'icon-ui',
          children: [
            {
              id: 'operation',
              title: 'Operations',
              type: 'collapse',
              icon: 'feather icon-activity',
              children: [
                getPermission('Operations', 'Consingnment') && {
                  id: 'ConsignorAndConsignee',
                  title: 'Consignment',
                  type: 'item',
                  url: '/ConsignorAndConsignee'
                },
                getPermission('Operations', 'Lorry Arrival') && {
                  id: 'LorryArrival',
                  title: 'Lorry Arrival',
                  type: 'item',
                  url: '/LorryArrival'
                },
                getPermission('Operations', 'DC Received') && {
                  id: 'DeliveryChallan',
                  title: 'DC Received',
                  type: 'item',
                  url: '/DeliveryChallan'
                }
              ].filter(Boolean) // Filter out falsy values
            }
          ].filter(Boolean) // Filter out falsy values
        },
        getPermission('Finance', 'Account') && {
          id: 'finance',
          title: 'Finance',
          type: 'group',
          icon: 'icon-ui',
          children: [
            {
              id: 'finance',
              title: 'Finance',
              type: 'collapse',
              icon: 'feather icon-briefcase',
              children: [
                getPermission('Finance', 'Account') && {
                  id: 'account',
                  title: 'Account',
                  type: 'item',
                  url: '/Finance'
                }
              ].filter(Boolean) // Filter out falsy values
            }
          ].filter(Boolean) // Filter out falsy values
        },
        (getPermission('Report', 'Consingnment Report') ||
          getPermission('Report', 'Lorry Arrival Report') ||
          getPermission('Report', 'Delivery Challan Report') ||
          getPermission('Report', 'Compile Report') ||
          getPermission('Report', 'PO Ageing Report')) && {
          id: 'report',
          title: 'Report',
          type: 'group',
          icon: 'icon-ui',
          children: [
            {
              id: 'report',
              title: 'Report',
              type: 'collapse',
              icon: 'feather icon-file-text',
              children: [
                getPermission('Report', 'Consingnment Report') && {
                  id: 'consignmentReport',
                  title: 'Consignment Report',
                  type: 'item',
                  url: '/Report'
                },
                getPermission('Report', 'Lorry Arrival Report') && {
                  id: 'LorryArrivalReport',
                  title: 'Lorry Arrival Report',
                  type: 'item',
                  url: '/LorryArrivalReport'
                },
                getPermission('Report', 'Delivery Challan Report') && {
                  id: 'DeliveryChallanReport',
                  title: 'Delivery Challan Report',
                  type: 'item',
                  url: '/DeliveryChallanReport'
                },
                getPermission('Report', 'Compile Report') && {
                  id: 'CompileReport',
                  title: 'Compile Report',
                  type: 'item',
                  url: '/CompileReport'
                },
                getPermission('Report', 'PO Ageing Report') && {
                  id: 'POAgeingReport',
                  title: 'PO Ageing Report',
                  type: 'item',
                  url: '/POAgeingReport'
                }
              ].filter(Boolean) // Filter out falsy values
            }
          ].filter(Boolean) // Filter out falsy values
        }
      ].filter(Boolean) // Filter out falsy values
    };
  }, [permissionRole]);

  const scroll = () => {
    document.querySelector('.pcoded-navbar')?.removeAttribute('style');
  };

  let navClass = ['pcoded-navbar', layoutType];
  navClass = [...navClass, 'menupos-fixed'];
  window.removeEventListener('scroll', scroll, false);

  if (windowSize.width < 992 && collapseMenu) {
    navClass = [...navClass, 'mob-open'];
  } else if (collapseMenu) {
    navClass = [...navClass, 'navbar-collapsed'];
  }

  let navBarClass = ['navbar-wrapper'];
  let navContent = (
    <div className={navBarClass.join(' ')}>
      <NavContent navigation={menuItems.items} />
    </div>
  );

  if (windowSize.width < 992) {
    navContent = (
      <div className="navbar-wrapper">
        <NavContent navigation={menuItems.items} />
      </div>
    );
  }

  return (
    <React.Fragment>
      <nav className={navClass.join(' ')}>{navContent}</nav>
    </React.Fragment>
  );
};

export default Navigation;
