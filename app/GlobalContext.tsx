'use client';
import React, { createContext, useEffect, useState } from 'react';
import { setCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next-nprogress-bar';

interface GlobalContextType {
    globalCity: string;
    setglobalCity: React.Dispatch<React.SetStateAction<string>>

    updateUser: any;
    setUpdateUser: React.Dispatch<React.SetStateAction<any>>;

    updateCart: any;
    setUpdateCart: React.Dispatch<React.SetStateAction<any>>;

    updateOrder: any;
    setUpdateOrder: React.Dispatch<React.SetStateAction<any>>;

    updateWishlist: any;
    setUpdateWishlist: React.Dispatch<React.SetStateAction<any>>;

    updateCompare: any;
    setUpdateCompare: React.Dispatch<React.SetStateAction<any>>;

    globalStore: any;
    setglobalStore: React.Dispatch<React.SetStateAction<any>>;
}

const GlobalContext = createContext<GlobalContextType>({
    globalCity: '',
    setglobalCity: () => {},

    updateUser: null,
    setUpdateUser: () => {},

    updateCart: null,
    setUpdateCart: () => {},

    updateOrder: null,
    setUpdateOrder: () => {},

    updateWishlist: null,
    setUpdateWishlist: () => {},

    updateCompare: null,
    setUpdateCompare: () => {},

    globalStore: null,
    setglobalStore: () => {},
});

export const GlobalProvider = ({ children }: any) => {
    const [globalCity, setglobalCity] = useState<any>('');
    const [updateUser, setUpdateUser] = useState<any>(0);
    const [updateCart, setUpdateCart] = useState<any>(0);
    const [updateOrder, setUpdateOrder] = useState<any>(0);
    const [updateWishlist, setUpdateWishlist] = useState<any>(0);
    const [updateCompare, setUpdateCompare] = useState<any>(0);
    const [globalStore, setglobalStore] = useState<any>(0);

    const router = useRouter();

    useEffect(() => {
        if (globalCity) {
            const oldcity = getCookie('selectedCity');
            setCookie('selectedCity', globalCity, {
                maxAge: 60 * 60 * 24,
                path: '/',
            });

            if (oldcity !== globalCity) {
                router.refresh();
            }
        }
        else{
            const city = getCookie('selectedCity');
            if (city) {
                setglobalCity(city);
            }
        }
    }, [globalCity]);

    return (
        <GlobalContext.Provider
            value={{
                globalCity,
                setglobalCity,
                updateUser,
                setUpdateUser,
                updateCart,
                setUpdateCart,
                updateOrder,
                setUpdateOrder,
                updateWishlist,
                setUpdateWishlist,
                updateCompare,
                setUpdateCompare,
                globalStore,
                setglobalStore
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalContext;