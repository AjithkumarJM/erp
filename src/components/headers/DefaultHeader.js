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
import user from '../../assets/images/user.png';
import ChangePassword from '../forms/passwordChange';
import { getUserDetails } from '../../services/userDetails';
import { spinner } from '../../const/index';

class DefaultHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      userInformation: {}
    };

    this.renderChangePasswordForm = this.renderChangePasswordForm.bind(this);
  }

  componentWillMount = () => this.props.getUserDetails();

  componentWillReceiveProps = ({ userInformation }) => this.setState({ userInformation: userInformation.response.data })

  toggle = () => this.setState({ modal: !this.state.modal });

  renderChangePasswordForm = () => null

  logout = () => {
    cookie.remove('session', { path: '/' });
    window.location.href = '/';
  }

  render() {
    const { modal, userInformation } = this.state;
    const { className, userInformation: { requesting } } = this.props;

    if (requesting === true) return <Loader show={true} message={spinner} />
    else {
      const { first_name, last_name, id } = userInformation;

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
                {first_name + ' ' + last_name} ({id}) <img src={user} className="img-avatar" alt="Admin" />
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
    }
  }
}

const mapStateToProps = ({ userInformation }) => {
  return { userInformation }
}

export default connect(mapStateToProps, { getUserDetails })(DefaultHeader)