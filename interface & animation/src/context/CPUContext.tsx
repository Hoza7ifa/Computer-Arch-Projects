import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react';
import { cpuReducer, createInitialState } from '../engine/cpu';
import type { CPUState, CPUAction } from '../engine/types';

interface CPUContextType {
    state: CPUState;
    dispatch: Dispatch<CPUAction>;
}

const CPUContext = createContext<CPUContextType | undefined>(undefined);

export const CPUProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(cpuReducer, createInitialState());

    return (
        <CPUContext.Provider value={{ state, dispatch }}>
            {children}
        </CPUContext.Provider>
    );
};

export const useCPU = () => {
    const context = useContext(CPUContext);
    if (!context) {
        throw new Error('useCPU must be used within a CPUProvider');
    }
    return context;
};
