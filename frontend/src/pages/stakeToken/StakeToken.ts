import { AnyAction, Dispatch } from "redux";
import { IocModule, inject } from "../../common/IocModule";
import { addAction, CommonActions } from "../../common/Actions";
import { RootState, StakeTokenState } from "../../common/RootState";
import { StakingAppClient, StakingAppServiceActions } from "../../services/StakingAppClient";
import { StakeEvent, StakingApp } from "../../common/Types";
import { History } from 'history';
import {Utils} from '../../common/Utils';

const StakeTokenActions = {
    AMOUNT_TO_STAKE_CHANGED: 'AMOUNT_TO_STAKE_CHANGED',
};

const Actions = StakeTokenActions;

export interface StakeTokenProps extends StakeTokenState {
    symbol: string;
    contract: StakingApp;
    balance: string;
    stakedAmount: string;
    userAddress: string;
    stakeEvents: StakeEvent[];
}

export interface StakeTokenDispatch {
    onStakeToken: (history: History, props: StakeTokenProps) => Promise<void>;
    onAmountToStakeChanged: (v:number) => Promise<void>;
}

function mapStateToProps(state: RootState): StakeTokenProps {
    const userProfile = state.data.userData?.profile;
    const addr = userProfile?.accountGroups[0]?.addresses || {};
    const address = addr[0] || {};

    return {
        ...state.ui.stakeToken,
        symbol: address.symbol,
        contract: Utils.selectedContrat(state, (window.location.href.split(':')[3]) || '') || {} as any,
        balance: address.balance,
        stakedAmount: state.data.stakingData.userStake?.amountInStake || '',
        userAddress: address.address,
        stakeEvents: state.data.stakingData.stakeEvents,
    };
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
    onStakeToken: async (history, props) => {
        try{
            dispatch(addAction(CommonActions.WAITING, { source: 'stakeToken' }));
            await IocModule.init(dispatch);
            const client = inject<StakingAppClient>(StakingAppClient);
            
            const data = await client.stakeSignAndSend(
                dispatch, props.amount,
                props.contract.network,
                props.contract.contractAddress,
                props.userAddress,
                props.balance,
                );
            if (!!data) {
                history.replace('/info/' + props.contract.contractAddress);
            }
        } catch (e) {
            console.error('StakeToken.mapDispatchToProps', e);
            dispatch(addAction(StakingAppServiceActions.STAKING_FAILED, { error: e.toString() }));
        } finally {
            dispatch(addAction(CommonActions.WAITING_DONE, { source: 'stakeToken' }));
        }
    },
    onAmountToStakeChanged: async (v:number) => {
        dispatch(addAction(Actions.AMOUNT_TO_STAKE_CHANGED, { amount: v }));
    },
} as StakeTokenDispatch);

const defaultStakeTokenState = {
    amount: '0',
}

function reduce(state: StakeTokenState = defaultStakeTokenState, action: AnyAction) {    
    switch(action.type) {
        case StakingAppServiceActions.STAKING_FAILED:
            return {...state, error: action.payload.message};
        case Actions.AMOUNT_TO_STAKE_CHANGED:
            return {...state, error: undefined, amount: action.payload.amount}
        default:
        return state;
    }
}

export const StakeToken = ({
    mapDispatchToProps,
    mapStateToProps,
    reduce
});