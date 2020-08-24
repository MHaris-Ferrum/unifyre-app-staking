import React, {useEffect} from 'react';
import { Dashboard, DashboardDispatch } from './Dashboard';
import { Switch, Route } from 'react-router-dom';
import {
    Page, Row, ThemedText, Gap,
    // @ts-ignore
} from 'unifyre-web-components';
import { connect } from 'react-redux';
import { CONFIG } from '../../common/IocModule';
import { intl } from 'unifyre-react-helper';
import { DashboardProps } from '../../common/RootState';
import { MainContainer } from '../main/MainContainer';
import { StakingContractContainer } from '../stakingContract/StakingContractContainer';
import { StakeTokenContainer } from '../stakeToken/StakeTokenContainer';
import { UnstakeTokenContainer } from '../unstakeToken/UnstakeTokenContainer';

function DashboardComponent(props: DashboardProps&DashboardDispatch) {
    const {onLoad} = props;
    useEffect(() => {
        onLoad();
    }, [onLoad]);

    const testAlert = CONFIG.isProd ? undefined : (<><Row withPadding><ThemedText.H1>TEST MODE</ThemedText.H1></Row></>)
    if (props.initialized) {
        // Render the routes
        return (
            <>
              <Switch>
                  <Route path='/unstake/:contractAddress'>
                        <UnstakeTokenContainer/>
                  </Route>
                  <Route path='/stake/:contractAddress'>
                        <StakeTokenContainer/>
                  </Route>
                  <Route path='/info/:contractAddress'>
                        <StakingContractContainer />
                  </Route>
                  <Route path='/'>
                        <MainContainer />
                  </Route>
              </Switch>
            </>
        );
    }

    const fatalError = props.fatalError ? (
      <>
        <Row withPadding centered>
          <ThemedText.H2 >{intl('fatal-error-heading')}</ThemedText.H2>
        </Row>
        <Row withPadding centered>
          <ThemedText.H3 >{props.fatalError}</ThemedText.H3>
        </Row>
      </>
    ) : (
      <Row withPadding centered>
          <ThemedText.H2>Connecting...</ThemedText.H2>
      </Row>
    );

    return (
        <Page>
            {testAlert}
            <Gap />
            <Gap />
            <Gap />
            <Gap />
            {fatalError}
        </Page>
    );
}

export const DashboardContainer = connect(
  Dashboard.mapStateToProps, Dashboard.mapDispatchToProps)(DashboardComponent);