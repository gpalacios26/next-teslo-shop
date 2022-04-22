import { useContext, useEffect } from 'react';
import { NextPage } from "next";
import { useRouter } from 'next/router';
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import { ShopLayout } from '../../components/layouts';
import { CartList, OrderSummary } from "../../components/cart";
import { CartContext } from "../../context";

const CartPage: NextPage = () => {

    const { isLoaded, cart } = useContext(CartContext);
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && cart.length === 0) {
            router.replace('/cart/empty');
        }
    }, [isLoaded, cart, router]);

    if (!isLoaded || cart.length === 0) {
        return (<></>);
    }

    const toCheckoutAddress = () => {
        router.push('/checkout/address');
    }

    return (
        <ShopLayout title="Mi Carrito" pageDescription="Carrito de compras de la tienda">
            <Typography variant='h1' component='h1'>Carrito</Typography>

            <Grid container>
                <Grid item xs={12} sm={7}>
                    <CartList editable={true} />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Orden</Typography>

                            <Divider sx={{ my: 1 }} />

                            <OrderSummary />

                            <Box sx={{ mt: 3 }}>
                                <Button
                                    color="secondary"
                                    className='circular-btn'
                                    fullWidth
                                    onClick={toCheckoutAddress}
                                >
                                    Checkout
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export default CartPage;