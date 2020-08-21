import React, {useContext} from 'react';
import { connect } from 'react-redux';
import {
    Page,PageTopPart,  Row, ThemedText, Gap, InputCurrency, ThemedButton, ErrorMessage,
    InputGroupAddon,
    // @ts-ignore
} from 'unifyre-web-components';
import { formatter } from "../../common/Utils";
import { StakeToken, StakeTokenDispatch, StakeTokenProps } from './StakeToken';
import { Big } from 'big.js';
import {ThemeContext, Theme} from 'unifyre-react-helper';
import { LoaderContainer } from '../../components/Loader';

function StakeTokenComponent(props: StakeTokenProps&StakeTokenDispatch) {
    const theme = useContext(ThemeContext);
    const styles = themedStyles(theme);
    const {symbol,stakingCap,stakedAmount} = props.contract;   
    const {balance} = props;
    const error = props.error ? (
        <Row withPadding>
            <ErrorMessage text={props.error} />
        </Row>
    ) : undefined;
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
                      <ThemedText.H4>{'Amount To Stake'}</ThemedText.H4>
                  </Row>
                  <Row withPadding>
                    <InputCurrency
                        currencies={[{ label: props.symbol, key: props.symbol }]}
                        amountStr={props.amount}
                        onAmountChanged={props.onAmountToStakeChanged}
                        curreny={symbol}
                        onCurrencyChanged={() => { }}
                        autoFocus={true}
                        formatter={formatter}
                        inputMode={'decimal'}
                    />
                  </Row>
                  <Gap size={'small'}/>
                  <Row withPadding centered>
                      <ThemedText.H4>{'Available Balance'}</ThemedText.H4>
                  </Row>
                  <Row withPadding>
                      <InputGroupAddon
                          value={`${formatter.format(balance,false)} ${symbol}`}
                          inputMode={'decimal'}
                          disabled={true}
                      />
                  </Row>
                  <Gap size={'small'}/>
                  <Row withPadding centered>
                      <ThemedText.H4>{'Amount Remaining in Stake'}</ThemedText.H4>
                  </Row>
                  <Row withPadding>
                      <InputGroupAddon
                          value={`${formatter.format(
                              new Big(stakingCap || '0').minus(new Big(props.stakedAmount || '0')).toFixed(),true)} ${symbol}`}
                          inputMode={'decimal'}
                          disabled={true}
                      />
                  </Row>
                  <Gap/>
                  {error}
                  <Row withPadding>
                        <ThemedButton
                            highlight={true}
                            text={`Sign and Submit Stake`}
                            onClick={()=>{
                                props.onStakeToken(props)}}
                            textStyle={styles.btnText}/>
                  </Row>
              </>
            }        
        </Page>
    );
}

export const StakeTokenContainer = connect(
  StakeToken.mapStateToProps, StakeToken.mapDispatchToProps)(StakeTokenComponent);

  //@ts-ignore
const themedStyles = (theme) => ({
    stakingInfoHeader: { 
        justifyContent: 'center',  
        fontSize: '19px',
        fontWeight: 'bold',
        letterspacing: 1,
        lineHeight: '1.2'
    },
    stakingAmountStyle: {
        fontSize: '33px',
        lineHeight: 1,
        fontWeight: 900,
        letterSpacing: '2.4px',
        color:'rgb(255 59 47 / 88%)'
    },
    stakingSymbol:{
        paddingTop: '3px',
        letterSpacing: 1
    },
    unifyreMainTextlineHeight: {
        lineHeight: 0.9
    },
    smallerMediumText:{
        fontSize: '13px',
        letterSpacing: '1px',
        lineHeight: '0.8'
    },
    navHeader: {
        fontSize: '17px',
        lineHeight: 1
    },
    mediumText: {
        fontSize: '25px',
        fontWeight: 'bold',
        letterSpacing: '1px',
        lineHeight: '1.2'
    },
    littleText: {
        fontSize: '12.5px',
        fontWeight: 'bold'
    },
    percentStake: {
        textAlign: "center" as "center",
        marginTop: '15px',
        marginRight: '0px',
        marginLeft: '40px',
        marginBottom: '2px',
        width:'40%',
        display: 'flex',
        flexDirection: "row" as "row",
    },
    arrows: {
        marginRight: '10px',
        marginLeft: '10px',
        width: '16px'
    },
    divider: {
        height: '3px',
        borderTopStyle: "solid" as "solid",
        borderTopColor: 'rgba(249, 64, 43, 1)',
        width: '10%',
        margin: '0px auto',
    },
    highlight:{
        color: 'rgb(255, 59, 47)'
    },
    DurText: {
        fontSize: '12.5px' 
    },
    btnText: {
        color: '#ffffff',
        lineHeight:1.6
    }
});
