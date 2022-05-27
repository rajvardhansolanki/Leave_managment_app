import React from 'react'
import { useHistory } from 'react-router'
import {
  // CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { removeUserSession } from '../components/storage/LocalStorage'

const TheHeaderDropdown = () => {
  const history = useHistory();

  const Logout = () => {
    removeUserSession();
    history.push("/login");
  }

  const User_profile = () => {
    history.push("/user-profile");
  }

  const Settings = () => {
    history.push("/settings");
  }

  return (
    <CDropdown
      inNav
      className="c-header-nav-items mx-2"
      direction="down"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <CImg
            src={'avatars/6.jpg'}
            className="c-avatar-img"
            alt="admin@bootstrapmaster.com"
          />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem onClick={User_profile} >
          <CIcon name="cil-user" className="mfe-2" />Profile
        </CDropdownItem>
        {
          localStorage.getItem("role") === "Admin" && <CDropdownItem onClick={Settings}>
            <CIcon name="cil-settings" className="mfe-2" />
            Settings
          </CDropdownItem>
        }

        <CDropdownItem divider />
        <CDropdownItem onClick={Logout}>
          <CIcon name="cil-lock-locked" className="mfe-2" />
          Log Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdown
