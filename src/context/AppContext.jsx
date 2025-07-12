import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const [listaClientes, setListaClientes] = useState();

    return (
        <AppContext.Provider value={{ listaClientes, setListaClientes }}>
            {children}
        </AppContext.Provider>
    );

};


// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);