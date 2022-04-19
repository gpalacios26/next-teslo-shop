import { FC, useReducer } from 'react';
import { UiContext, uiReducer } from './';

interface Props {
    children: JSX.Element[] | JSX.Element;
}

export interface UiState {
    isMenuOpen: boolean;
}

const UI_INITIAL_STATE: UiState = {
    isMenuOpen: false,
}

export const UiProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

    const toggleSideMenu = () => {
        dispatch({ type: 'UI_ToggleMenu' });
    }

    return (
        <UiContext.Provider value={{
            ...state,
            toggleSideMenu,
        }}>
            {children}
        </UiContext.Provider>
    );
};