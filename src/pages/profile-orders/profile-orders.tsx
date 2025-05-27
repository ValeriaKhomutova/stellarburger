import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { loadAllOrders } from '../../services/slices/add-slice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  //const { ordersList: orders } = useSelector((store) => store.ordersReducer);
  const { ordersList: orders } = useSelector((store) => store.ordersReducer);
  useEffect(() => {
    dispatch(loadAllOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
