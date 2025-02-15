'use client';
import React from 'react';

const DataContextCreator = (
  reducer: any,
  actions: any,
  initialState: any
) => {
  const Context = React.createContext({state: initialState});
  const Provider = ({ children }: { children: any}) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const boundActions:any = {};
    for (let key in actions) {
      boundActions[key] = actions[key](dispatch);
    }
    const values = {state, ...boundActions};

    return <Context.Provider value={values}>{children}</Context.Provider>;
  }
  return {Context, Provider};
};

export default DataContextCreator;