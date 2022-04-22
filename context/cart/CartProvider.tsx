import { FC, useEffect, useReducer } from 'react';
import Cookie from 'js-cookie';
import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';

interface Props {
    children: JSX.Element[] | JSX.Element;
}

export interface ShippingAddress {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
}

export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
    shippingAddress?: ShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: undefined
}

export const CartProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

    useEffect(() => {
        try {
            const cookieProducts = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [];
            dispatch({ type: 'Cart_LoadProducts_Cookies', payload: cookieProducts });
        } catch (error) {
            dispatch({ type: 'Cart_LoadProducts_Cookies', payload: [] });
        }
    }, []);

    useEffect(() => {
        if (Cookie.get('firstName')) {
            const shippingAddress = {
                firstName: Cookie.get('firstName') || '',
                lastName: Cookie.get('lastName') || '',
                address: Cookie.get('address') || '',
                address2: Cookie.get('address2') || '',
                zip: Cookie.get('zip') || '',
                city: Cookie.get('city') || '',
                country: Cookie.get('country') || '',
                phone: Cookie.get('phone') || '',
            }
            dispatch({ type: 'Cart_LoadAddress_Cookies', payload: shippingAddress });
        }
    }, []);

    useEffect(() => {
        Cookie.set('cart', JSON.stringify(state.cart));
    }, [state.cart]);

    useEffect(() => {
        const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev, 0);
        const subTotal = state.cart.reduce((prev, current) => (current.price * current.quantity) + prev, 0);
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

        const orderSummary = {
            numberOfItems,
            subTotal,
            tax: subTotal * taxRate,
            total: subTotal * (1 + taxRate)
        }

        dispatch({ type: 'Cart_Update_Order', payload: orderSummary });
    }, [state.cart]);

    const addProductToCart = (product: ICartProduct) => {
        const productInCart = state.cart.some(p => p._id === product._id);
        if (!productInCart) return dispatch({ type: 'Cart_Update_Products', payload: [...state.cart, product] });

        const productInCartButDifferentSize = state.cart.some(p => p._id === product._id && p.size === product.size);
        if (!productInCartButDifferentSize) return dispatch({ type: 'Cart_Update_Products', payload: [...state.cart, product] });

        const updatedProducts = state.cart.map(p => {
            if (p._id !== product._id) return p;
            if (p.size !== product.size) return p;

            // Actualizar la cantidad cuando es el mismo producto y talla
            if (p.quantity + product.quantity <= 10) { p.quantity += product.quantity } else { p.quantity = 10 };
            return p;
        });

        dispatch({ type: 'Cart_Update_Products', payload: updatedProducts });
    }

    const updateCartQuantity = (product: ICartProduct) => {
        dispatch({ type: 'Cart_Change_Quantity', payload: product });
    }

    const removeCartProduct = (product: ICartProduct) => {
        dispatch({ type: 'Cart_Remove_Product', payload: product });
    }

    const updateAddress = (address: ShippingAddress) => {
        Cookie.set('firstName', address.firstName);
        Cookie.set('lastName', address.lastName);
        Cookie.set('address', address.address);
        Cookie.set('address2', address.address2 || '');
        Cookie.set('zip', address.zip);
        Cookie.set('city', address.city);
        Cookie.set('country', address.country);
        Cookie.set('phone', address.phone);
        dispatch({ type: 'Cart_Update_Address', payload: address });
    }

    return (
        <CartContext.Provider value={{
            ...state,
            // Methods
            addProductToCart,
            updateCartQuantity,
            removeCartProduct,
            updateAddress,
        }}>
            {children}
        </CartContext.Provider>
    )
};