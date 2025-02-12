import React, { useContext, useEffect, useRef } from 'react';

// project import
import Navigation from './Navigation';
import NavBar from './NavBar';
import Breadcrumb from './Breadcrumb';

import useWindowSize from '../../hooks/useWindowSize';
import useOutsideClick from '../../hooks/useOutsideClick';
import { ConfigContext } from '../../contexts/ConfigContext';
import * as actionType from '../../store/actions';

// ==============================|| ADMIN LAYOUT ||============================== //

const AdminLayout = ({ children }) => {
  const windowSize = useWindowSize();
  const ref = useRef();
  const configContext = useContext(ConfigContext);

  const { collapseMenu, layout } = configContext.state;
  const { dispatch } = configContext;

  useOutsideClick(ref, () => {
    if (collapseMenu) {
      dispatch({ type: actionType.COLLAPSE_MENU });
    }
  });

  useEffect(() => {
    if (windowSize.width > 992 && windowSize.width <= 1024) {
      dispatch({ type: actionType.COLLAPSE_MENU });
    }

    if (windowSize.width < 992) {
      dispatch({ type: actionType.CHANGE_LAYOUT, layout: 'vertical' });
    }
  }, [dispatch, layout, windowSize]);

  const mobileOutClickHandler = () => {
    if (windowSize.width < 992 && collapseMenu) {
      dispatch({ type: actionType.COLLAPSE_MENU });
    }
  };

  let mainClass = ['pcoded-wrapper'];

  let common = (
    <React.Fragment>
      <Navigation />
      <NavBar />
    </React.Fragment>
  );

  if (windowSize.width < 992) {
    let outSideClass = ['nav-outside'];
    if (collapseMenu) {
      outSideClass = [...outSideClass, 'mob-backdrop'];
    }
    outSideClass = [...outSideClass, 'mob-fixed'];

    common = (
      <div className={outSideClass.join(' ')} ref={ref}>
        {common}
      </div>
    );
  }
  return (
    <React.Fragment>
      {common}
      <div className="pcoded-main-container" onClick={() => mobileOutClickHandler} onKeyDown={() => mobileOutClickHandler}>
        <div className={mainClass.join(' ')}>
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <Breadcrumb />
              {children}
            </div>
          </div>
        </div>
      </div>
      <footer style={{ backgroundColor: '#f0f0f0', padding: '10px', textAlign: 'center', position: 'fixed', bottom: 0, width: '100%' }}>
        <div className="ms-auto" style={{ display: 'flex', justifyContent: 'end' }}>
          <span className="me-1"> Powered By V5 Logistics & WareHousing Pvt Ltd</span>
        </div>
      </footer>
    </React.Fragment>
  );
};

export default AdminLayout;
