import React, { Component } from 'react';
import {
  DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem,
  Modal, ModalHeader, ModalBody
} from 'reactstrap';
import cookie from 'react-cookies';
import { AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Loader from 'react-loader-advanced';

import logo from '../../assets/images/logo.png';
import logoMini from '../../assets/images/icon-logo.png';
import ChangePassword from '../forms/passwordChange';
import { getUserDetails } from '../../services/userDetails';
import { spinner, userInfo } from '../../const/index';

class DefaultHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };
  }

  toggle = () => this.setState({ modal: !this.state.modal });

  logout = () => {
    cookie.remove('session', { path: '/' });
    window.location.href = '/';
  }

  render() {
    const { modal } = this.state;
    const { className, userInformation: { response: { data } } } = this.props;
    const { first_name, last_name, id, gender } = data;
    const image = `/src/assets/images/${gender === 'Male' ? 'userMaleLogo' : 'userFemaleLogo'}.png`;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 'auto', height: 39, alt: 'Tetra Tech Logo' }}
          minimized={{ src: logoMini, width: 25, height: 25, alt: 'Tetra Tech Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <h5>EMS</h5>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              {first_name + ' ' + last_name} ({id}) <img src={image} className="img-avatar" alt="user" />
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem onClick={this.toggle}><i className="fa fa-key"></i> Change Password</DropdownItem>
              <DropdownItem onClick={this.logout}><i className="fa fa-lock"></i> Logout</DropdownItem>

            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>

        <Modal isOpen={modal} toggle={this.toggle} className={className} backdrop='static'>
          <ModalHeader toggle={this.toggle}>Change Password</ModalHeader>
          <ModalBody>
            <ChangePassword />
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
    // }
  }
}

const mapStateToProps = ({ userInformation }) => {
  return { userInformation }
}

export default connect(mapStateToProps, { getUserDetails })(DefaultHeader)