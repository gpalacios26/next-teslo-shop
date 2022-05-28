import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import useSWR from 'swr';
import { Grid, Typography } from '@mui/material';
import { AttachMoneyOutlined, CreditCardOffOutlined, DashboardOutlined, GroupOutlined, CategoryOutlined, CancelPresentationOutlined, ProductionQuantityLimitsOutlined, AccessTimeOutlined } from '@mui/icons-material';
import { AdminLayout } from '../../components/layouts';
import { SumaryTitle } from '../../components/admin';
import { DashboardSumaryResponse } from '../../interfaces';

const DashboardPage: NextPage = () => {

    const { data, error } = useSWR<DashboardSumaryResponse>('/api/admin/dashboard', {
        refreshInterval: 300 * 1000 //Cada 30 segundos
    });

    const [refreshIn, setRefreshIn] = useState(30);

    useEffect(() => {
        const interval = setInterval(() => {
            setRefreshIn(refreshIn => refreshIn > 0 ? refreshIn - 1 : 30);
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, []);

    if (!error && !data) {
        return <></>
    }

    if (error) {
        console.log(error);
        return <Typography>Error al cargar la información</Typography>
    }

    const {
        numberOfOrders,
        paidOrders,
        notPaidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory
    } = data!;

    return (
        <AdminLayout title='Dashboard' subTitle='Estadística Generales' icon={<DashboardOutlined />}>

            <Grid container spacing={2}>
                <SumaryTitle title={numberOfOrders} subTile='Ordenes totales'
                    icon={<CreditCardOffOutlined color='secondary' sx={{ fontSize: 40 }} />}
                />

                <SumaryTitle title={paidOrders} subTile='Ordenes pagadas'
                    icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} />}
                />

                <SumaryTitle title={notPaidOrders} subTile='Ordenes pendientes'
                    icon={<CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} />}
                />

                <SumaryTitle title={numberOfClients} subTile='Clientes'
                    icon={<GroupOutlined color='primary' sx={{ fontSize: 40 }} />}
                />

                <SumaryTitle title={numberOfProducts} subTile='Productos'
                    icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }} />}
                />

                <SumaryTitle title={productsWithNoInventory} subTile='Sin Existencias'
                    icon={<CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />}
                />

                <SumaryTitle title={lowInventory} subTile='Bajo Inventario'
                    icon={<ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} />}
                />

                <SumaryTitle title={refreshIn} subTile='Actualización en:'
                    icon={<AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} />}
                />
            </Grid>

        </AdminLayout>
    )
}

export default DashboardPage;