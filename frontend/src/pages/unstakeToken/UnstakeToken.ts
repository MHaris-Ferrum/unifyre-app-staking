import { AnyAction, Dispatch } from "redux";
import { addAction, CommonActions } from "../../common/Actions";
import { RootState, StakeTokenState } from "../../common/RootState";
import { StakingAppClient, StakingAppServiceActions } from "../../services/StakingAppClient";
import { StakeToken, StakeTokenProps } from "../stakeToken/StakeToken";
import { Utils } from "../../common/Utils";
import { ValidationUtils } from "ferrum-plumbing";
import { inject, IocModule } from "../../common/IocModule";
import { History} from 'history';
import { Big } from 'big.js';

const UnstakeTokenActions = {
    AMOUNT_TO_UN_STAKE_CHANGED: 'AMOUNT_TO_UN_STAKE_CHANGED',
};

const Actions = UnstakeTokenActions;

export interface UnstakeTokenProps extends StakeTokenProps {
}

export interface UnstakeTokenDispatch {
    onUnstakeToken: (history: History, props: UnstakeTokenProps) => Promise<void>;
    onAmountToUnstakeChanged: (v:number) => Promise<void>;
}

function mapStateToProps(state: RootState): StakeTokenProps {
    return {
        ...(StakeToken.mapStateToProps(state)),
        ...state.ui.unstakeToken,
        // contract: Utils.selectedContrat(state, (window.location.href.split('?')[2]) || '') || {} as any,
    };
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
    onUnstakeToken: async (history, props: UnstakeTokenProps) => {
        try{
            dispatch(addAction(CommonActions.WAITING, { source: 'unstakeToken' }));
            ValidationUtils.isTrue(
                new Big(props.amount || '0').gt(new Big('0')),
            `Amount to unstake must be positive`);
            ValidationUtils.isTrue(
                new Big(props.amount || '0').lte(new Big(props.stakedAmount)),
            `You can not unstake more than your staked balance`);
            if (props.contract.maxContribution) {
                ValidationUtils.isTrue(
                    new Big(props.amount || '0').lt(new Big(props.contract.maxContribution)),
                    `Maximum contribution is ${props.contract.maxContribution} ${props.contract.symbol}`);
            }
            await IocModule.init(dispatch);
            const client = inject<StakingAppClient>(StakingAppClient);
            const data = await client.unstakeSignAndSend(
                dispatch, props.amount,
                props.contract.network,
                props.contract.contractAddress,
                props.userAddress,
                );
            if (!!data) {
                history.replace(`/continuation`);
            }
        } catch (e) {
            console.error('StakeToken.mapDispatchToProps', e);
            dispatch(addAction(StakingAppServiceActions.UN_STAKING_FAILED, { message: e.toString() }));
        } finally {
            dispatch(addAction(CommonActions.WAITING_DONE, { source: 'unstakeToken' }));
        }
    },
    onAmountToUnstakeChanged: async (v:number) => {
        dispatch(addAction(Actions.AMOUNT_TO_UN_STAKE_CHANGED, { amount: v }));
    },
} as UnstakeTokenDispatch);

const defaultUnstakeTokenState = {
    amount: '0',
}

function reduce(state: StakeTokenState = defaultUnstakeTokenState, action: AnyAction) {    
    switch(action.type) {
        case StakingAppServiceActions.UN_STAKING_FAILED:
            return {...state, error: action.payload.message};
        case Actions.AMOUNT_TO_UN_STAKE_CHANGED:
            return {...state, error: undefined, amount: action.payload.amount}
        default:
        return state;
    }
}

export const UnstakeToken = ({
    mapDispatchToProps,
    mapStateToProps,
    reduce
});