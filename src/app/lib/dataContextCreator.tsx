'use client';
import React from 'react';

const DataContextCreator = (
  reducer: any, actions: { [x: string]: (arg0: React.DispatchWithoutAction) => any; }, initialState: unknown
) => {
  const Context = React.createContext({state: initialState});
  const Provider = ({children}: {children: React.ReactNode}) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const boundActions: { [key: string]: any } = {};
    for (let key in actions) {
      boundActions[key] = actions[key as keyof typeof actions](dispatch);
    }
    const values = {state, ...boundActions};

    return <Context.Provider value={values}>{children}</Context.Provider>;
  }
  return {Context, Provider};
};

export default DataContextCreator;