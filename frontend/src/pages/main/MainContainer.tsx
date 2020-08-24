import React, {useContext, useState} from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
    Page,PageTopPart,  Row, ThemedText, Gap, ThemedButton
    // @ts-ignore
} from 'unifyre-web-components';
import { Main, MainDispatch, MainProps } from './Main';
import { buildStyles,CircularProgressbarWithChildren} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {ThemeContext, Theme} from 'unifyre-react-helper';
import {RewardsBar} from "./../../components/ProgressBar";
import {CategoryBtn} from "./../../components/Categories";
import {TransitionGroup} from 'react-transition-group'; // ES6
import { StakingApp } from "../../common/Types";

function MainComponent(props: MainProps&MainDispatch) {
    const theme = useContext(ThemeContext);
    const styles = themedStyles(theme);
    const history = useHistory();
    let [index,setindex] = useState(0);
    const selected = true;
    const {stakings,symbol} = props;
    console.log(props,stakings,'=====');
    
    return (
        <Page>
            <PageTopPart>
                <Row centered noMarginTop><ThemedText.H2 styles={{...styles.stakingInfoHeader}}>{`Staking`}</ThemedText.H2></Row>
                <div style={{...styles.divider}}></div>
            </PageTopPart>
            {
                stakings.map((e:StakingApp) => {
                    return (
                        <CategoryBtn
                            symbol={symbol}
                            stakingCap={e.stakingCap}
                            name={e.name}
                            currency={e.currency}
                            startDate={e.stakingStarts}
                            history={history}
                            staking={e}
                            userAddress={props.userAddress}
                            onStakeNow={()=>props.onContractSelected(history,e,props.userAddress)}
                        />
                    )
                })
            }
            <Gap size={'small'}/>
            <Row withPadding>
                <ThemedText.H4>{'Recent Transactions'}</ThemedText.H4>
            </Row>
            <Row withPadding>
                <div style={styles.btnContainer}>
                    You Have Made No Recent Transactions 
                </div>
            </Row>
        </Page>
    );
}

//@ts-ignore
const themedStyles = (theme) => ({
    btnContainer: {
        display: 'flex',
        color: 'black',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '15px',
        fontSize: '15px'
    },
    miniText: {
        fontSize: '14px',
    },
    symb:{
        fontSize: '17px',
    },
    rewards:{
        backgroundColor: 'white',
        color: '#c1052a',
        textAlign: "center" as "center",
        borderRadius: '5px',
        fontSize: '17px',
        fontWeight: "bold" as "bold",
        margin: '5px 0px',
        padding: '2px 0px'
    },
    tokenInfo: {
        display: 'flex',
        color: 'white',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    tokenSymbol: {
        margin: '0px 10px'
    },
    listContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
    listItemContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        minHeight: theme.get(Theme.Spaces.line) * 4,
        padding: theme.get(Theme.Spaces.line),
    },
    stakedText:{
        fontFamily: 'Sawarabi Gothic',
        marginTop: 'auto',
        margin: '3px',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: "center" as "center",
        lineHeight: 1
    },
    commonText: {
        fontFamily: 'Sawarabi Gothic',
        fontWeight: 'bold',
        fontSize: '16.5px',
        letterSpacing: '1px'
    },
    unifyreTextColor: {
      color:  '#9a3531'
    },
    stakingInfoHeader: { 
        justifyContent: 'center',  
        fontSize: '14px',
        fontWeight: 'bold',
        letterSpacing: 1.3,
        lineHeight: '1.2'
    },
    stakingAmountStyle: {
        color: '#ffff',
        fontSize: '30px',
        lineHeight: 1,
        fontWeight: '900',
        letterSpacing: '3px'
    },
    stakingSymbol:{
        paddingTop: '3px',
        letterSpacing: 1,
        fontSize:'13px',
        fontWeight: 200
    },
    unifyreMainTextlineHeight: {
        lineHeight: 0.9
    },
    smallerMediumText:{
        fontSize: '14px',
        letterSpacing: '1px',
        lineHeight: '0.8',
        fontWeight: 200
    },
    navHeader: {
        fontSize: '17px',
        lineHeight: 1
    },
    mediumText: {
        fontSize: '25px',
        fontWeight: 'bold',
        letterSpacing: '2px',
        lineHeight: '1.3'
    },
    littleText: {
        fontSize: '12.5px',
        fontWeight: '200'
    },
    percentStake: {
        textAlign: "center" as "center",
        marginTop: '15px',
        marginRight: '0px',
        marginLeft: '20px',
        marginBottom: '2px',
        width:'45%',
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
        width: '5%',
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
        letterSpacing: '2px',
        lineHeight: '1.7'
    },
    bottomFix:{
        width: '99%',
        marginBottom: '1rem'
    },
    header: {
        fontSize: '45px',
        width: '80%',
        lineHeight: 0.9,
        marginLeft: '15pt'
    }
});

export const MainContainer = connect(
  Main.mapStateToProps, Main.mapDispatchToProps)(MainComponent);