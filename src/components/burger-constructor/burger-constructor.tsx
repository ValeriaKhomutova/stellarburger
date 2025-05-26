import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  createNewOrder,
  clearCurrentOrder
} from '../../services/slices/add-slice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector((store) => store.burgerReducer);
  const orderRequest = useSelector(
    (store) => store.ordersReducer.creatingOrder
  );
  const { isAuthenticated } = useSelector((store) => store.authReducer);

  const orderModalData = useSelector(
    (store) => store.ordersReducer.currentOrder
  );

  /*const constructorItems = {
    bun: {
      price: 0
    },
    ingredients: []
  };*/

  //const orderRequest = false;

  //const orderModalData = null;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!isAuthenticated) {
      return navigate('/login');
    }
    const data = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id
    ];

    dispatch(createNewOrder(data));
  };

  const closeOrderModal = () => {
    dispatch(clearCurrentOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
