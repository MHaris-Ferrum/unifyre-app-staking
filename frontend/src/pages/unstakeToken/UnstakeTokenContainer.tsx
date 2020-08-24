import React, {useContext, useEffect} from 'react';
import { connect } from 'react-redux';
import {
    Page,PageTopPart,  Row, ThemedText, Gap,InputGroupAddon,ThemedButton
    // @ts-ignore
} from 'unifyre-web-components';
import { formatter } from "../../common/Utils";
import { LoaderContainer } from '../../components/Loader';
import { UnstakeToken, UnstakeTokenDispatch, UnstakeTokenProps } from './UnstakeToken';
import Big from 'big.js';
import { useHistory } from 'react-router-dom';
import {ThemeContext} from 'unifyre-react-helper';

function UnstakeTokenComponent(props: UnstakeTokenProps&UnstakeTokenDispatch) {
    // const stakeInfo = props.props.stakingData.find((e:any)=> e.contractAddress === '0x36850161766d7a1738358291b609eF02E2Ee0375')
    const {symbol,stakingCap} = props.contract;   
    const history = useHistory();
    const {contract} = props;
    var utcSeconds = contract.stakingStarts;
    const theme = useContext(ThemeContext);
    const styles = themedStyles(theme);
    return (
        <Page>
            <LoaderContainer />
             <PageTopPart>
                <Row centered><ThemedText.H2 styles={{...styles.stakingInfoHeader}}>{`Staking`}</ThemedText.H2></Row>
                <div style={{...styles.divider}}></div>
            </PageTopPart>
            {
                <>
                  <Row withPadding centered>
                      <ThemedText.H4>{'Amount To Withdraw'}</ThemedText.H4>
                  </Row>
                  <Row withPadding>
                      <InputGroupAddon
                          value={props.amount}
                          onChange={props.onAmountToUnstakeChanged}
                          inputMode={'decimal'}
                          type={Number}
                      />
                  </Row>
                  <Gap size={'small'}/>
                  <Row withPadding centered>
                      <ThemedText.H4>{'Amount In Stake'}</ThemedText.H4>
                  </Row>
                  <Row withPadding>
                      <InputGroupAddon
                          value={`${formatter.format(
                              new Big(stakingCap).minus(new Big(props.amount)).toFixed(),true)} ${symbol}`}
                          inputMode={'decimal'}
                          disabled={true}
                      />
                  </Row>
                  <Gap/>
                  <Row withPadding>
                        <ThemedButton text={`UnStake`} onClick={()=>{props.onUnstakeToken(props)}}/>
                  </Row>
              </>
            }        
        </Page>
    );
}

//@ts-ignore
const themedStyles = (theme) => ({
    divider: {
        height: '3px',
        borderTopStyle: "solid" as "solid",
        borderTopColor: 'rgba(249, 64, 43, 1)',
        width: '10%',
        margin: '0px auto',
    },
    stakingInfoHeader: { 
        justifyContent: 'center',  
        fontSize: '19px',
        fontWeight: 'bold',
        letterspacing: 1,
        lineHeight: '1.2'
    },
})

export const UnstakeTokenContainer = connect(
  UnstakeToken.mapStateToProps, UnstakeToken.mapDispatchToProps)(UnstakeTokenComponent);