import { UiState } from './';

type UiActionType =
    | { type: 'UI_ToggleMenu' }

export const uiReducer = (state: UiState, action: UiActionType): UiState => {

    switch (action.type) {
        case 'UI_ToggleMenu':
            return {
                ...state,
                isMenuOpen: !state.isMenuOpen
            }

        default:
            return state;
    }
}