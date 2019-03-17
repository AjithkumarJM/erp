import React, { Component } from 'react';
import {
    AppSidebar,
    AppSidebarFooter,
    AppSidebarForm,
    AppSidebarHeader,
    AppSidebarMinimizer,
    AppSidebarNav,
} from '@coreui/react';
import navigation from '../../_nav';
import { withRouter } from 'react-router-dom';

class SideNav extends Component {
    render() {
        return (
            <AppSidebar fixed display="lg">
                <AppSidebarHeader />
                <AppSidebarForm />
                <AppSidebarNav navConfig={navigation} {...this.props} />
                <AppSidebarFooter />
                <AppSidebarMinimizer />
            </AppSidebar>
        )
    }
}

export default withRouter(SideNav);