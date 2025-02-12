const storedDataString = localStorage.getItem('role');
const permissions = storedDataString ? JSON.parse(storedDataString) : [];

const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'dashboard',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        permissions[0]?.pread == 1 && {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/dashboard/'
        }
      ]
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
          icon: 'feather icon-box',
          children: [
            permissions[0]?.pread == 1 && {
              id: 'User',
              title: 'User',
              type: 'item',
              url: '/UserMaster'
            },
            {
              id: 'UserRole',
              title: 'User Role',
              type: 'item',
              url: '/UserRole'
            },
            {
              id: 'VehicleMaster',
              title: 'Vehicle',
              type: 'item',
              url: '/VehicleMaster'
            },
            {
              id: 'TransportMaster',
              title: 'Transporter',
              type: 'item',
              url: '/TransportMaster'
            },
            // {
            //   id: 'DriverMaster',
            //   title: 'Driver Master',
            //   type: 'item',
            //   url: '/basic/DriverMaster'
            // },
            {
              id: 'BranchMaster',
              title: 'Branch',
              type: 'item',
              url: '/BranchMaster'
            },
            {
              id: 'ConsignorMaster',
              title: 'Party',
              type: 'item',
              url: '/ConsignorMaster'
            },
            // {
            //   id: 'ConsigneeMaster',
            //   title: 'Consignee',
            //   type: 'item',
            //   url: '/basic/ConsigneeMaster'
            // },
            {
              id: 'ClientMaster',
              title: 'Service Provider',
              type: 'item',
              url: '/ClientMaster'
            },

            {
              id: 'BillingofficeMaster',
              title: 'Billing Office',
              type: 'item',
              url: '/BillingofficeMaster'
            },
            // {
            //   id: 'BillingPartyMaster',
            //   title: 'Billing Party',
            //   type: 'item',
            //   url: '/BillingPartyMaster'
            // },
            {
              id: 'RouteMaster',
              title: 'Route',
              type: 'item',
              url: '/RouteMaster'
            },
            {
              id: 'MaterialGroup',
              title: 'Material Group',
              type: 'item',
              url: '/MaterialGroup'
            },
            {
              id: 'Material',
              title: 'Material',
              type: 'item',
              url: '/Material'
            },
            {
              id: 'StationaryMaster',
              title: 'Stationary',
              type: 'item',
              url: '/StationaryMaster'
            },

            {
              id: 'POMaster',
              title: 'PO',
              type: 'item',
              url: '/POMaster'
            }
          ]
        }
      ]
    },

    {
      id: 'operations',
      title: 'Operations',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'operation',
          title: 'Operations',
          type: 'collapse',
          icon: 'feather icon-box',
          children: [
            {
              id: 'ConsignorAndConsignee',
              title: 'Consignment',
              type: 'item',
              url: '/ConsignorAndConsignee'
            },
            ,
            {
              id: 'LorryArrival',
              title: 'Lorry Arrival',
              type: 'item',
              url: '/LorryArrival'
            }
          ]
        }
      ]
    },
    {
      id: 'finance',
      title: 'Finance',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'finance',
          title: 'Finance',
          type: 'collapse',
          icon: 'feather icon-box',
          children: [
            {
              id: 'account',
              title: 'Account',
              type: 'item',
              url: '/Finance'
            },
            ,
          ]
        }
      ]
    },
    {
      id: 'report',
      title: 'Report',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'report',
          title: 'Report',
          type: 'collapse',
          icon: 'feather icon-box',
          children: [
            {
              id: 'consignmentReport',
              title: 'Consignment Report',
              type: 'item',
              url: '/Report'
            },
            ,
          ]
        }
      ]
    }
  ]
};

export default menuItems;
