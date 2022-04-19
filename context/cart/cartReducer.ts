import { CartState } from './';
import { ICartProduct } from '../../interfaces';

type CartActionType =
    | { type: 'Cart_Load_Products_Cookie', payload: ICartProduct[] }
    | { type: 'Cart_Update_Products', payload: ICartProduct[] }
    | { type: 'Cart_Change_Quantity', payload: ICartProduct }
    | { type: 'Cart_Remove_Product', payload: ICartProduct }
    | {
        type: 'Cart_Update_Order',
        payload: {
            numberOfItems: number;
            subTotal: number;
            tax: number;
            total: number;
        }
    }

export const cartReducer = (state: CartState, action: CartActionType): CartState => {

    switch (action.type) {
        case 'Cart_Load_Products_Cookie':
            return {
                ...state,
                cart: [...action.payload]
            }

        case 'Cart_Update_Products':
            return {
                ...state,
                cart: [...action.payload]
            }

        case 'Cart_Change_Quantity':
            return {
                ...state,
                cart: state.cart.map(product => {
                    if (product._id !== action.payload._id) return product;
                    if (product.size !== action.payload.size) return product;
                    return action.payload;
                })
            }

        case 'Cart_Remove_Product':
            return {
                ...state,
                cart: state.cart.filter(product => !(product._id === action.payload._id && product.size === action.payload.size))
            }

        case 'Cart_Update_Order':
            return {
                ...state,
                ...action.payload
            }

        default:
            return state;
    }
}