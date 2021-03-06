import {Link, Redirect} from 'react-router-dom';
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, params, Form, Icon, Input, Layout, message } from 'antd';
import LogoBox from '../../components/LogoBox';
import qs from 'query-string';
import { observable } from 'mobx';
import agent from '../../agent';
import { showApiError } from '../../utils';

const { Content } = Layout;
const { API_ROOT } = process.env;

@inject('authStore')
@inject('commonStore')
@inject('userStore')
@observer
class Authorize extends React.Component {

  @observable transactionId = '';
  componentWillMount() {
    const { authStore, userStore } = this.props;
    let params = qs.parse(window.location.search);
    if(!userStore.currentUser) {
      authStore.redirectParams = {
        to: window.location.pathname + window.location.search
      };
      return this.props.history.push('/register');
    }

    this.redirectUri = params.redirect_uri;
    agent.Oauth.getTransaction(params)
      .then( res => { console.log(res); this.transactionId = res.transactionId});
  }

  onAuthorize = e => {
    agent.Oauth.authorize(this.transactionId)
      .then( () => window.location.href = this.redirectUri)
      .catch( (err) => {
        console.log(err);
        console.error(err);
        // window.location.replace(this.redirectUri);
    });
  }

  render() {
    return (
      <Layout className="default-top-layout authorize-popup">
        <Content className="">
          <LogoBox />
          <form method="post" action={`${API_ROOT}/oauth/authorize`}>
            <input type="hidden" value={this.transactionId} name="transaction_id" />
            <input type="hidden" value={this.props.commonStore.token} name="jwt" />
            <div className="buttons">
              <Button type="primary" htmlType="submit">GXC Quest Login</Button>
            </div>
          </form>
        </Content>
      </Layout>
    );
  }
}

export default Authorize;
