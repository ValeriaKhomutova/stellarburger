import { 
  ConstructorPageFeed,
	ForgotPassword,
	Login,
	NotFound404,
	Profile,
	ProfileOrders,
	Register,
	ResetPassword, } from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector,  useDispatch} from '../../services/store';
import { loadIngredients } from '../../services/slices/ingregient-slice';
import { clearCurrentOrder } from '../../services/slices/add-slice';

import { 
  AppHeader,
  IngredientDetails,
	Modal,
	OrderInfo,
	ProtectRoute, 
} from '@components';

const App = () => {
  const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const state = location.state as { background?: Location };

	useEffect(() => {
		dispatch(loadIngredients());
	}, [dispatch]);

	const handleModalClose = () => {
		navigate(-1);
		dispatch(clearCurrentOrder());
	};

  return (
		<div className={styles.app}>
			<AppHeader />
			<Routes location={state?.background || location}>
				<Route path='*' element={<NotFound404 />} />
				<Route path='/' element={<ConstructorPage />} />
				<Route path='/feed' element={<Feed />} />
				<Route
					path='/feed/:number'
					element={
						<Modal title='Детали заказа' onClose={handleModalClose}>
							<OrderInfo />
						</Modal>
					}
				/>
				<Route
					path='/ingredients/:id'
					element={
						<Modal title='Детали ингредиента' onClose={handleModalClose}>
							<IngredientDetails />
						</Modal>
					}
				/>
				<Route
					path='/profile/orders/:number'
					element={
						<ProtectRoute>
							<Modal title='Детали заказа' onClose={handleModalClose}>
								<OrderInfo />
							</Modal>
						</ProtectRoute>
					}
				/>
				<Route
					path='/login'
					element={
						<ProtectRoute onlyUnAuth>
							<Login />
						</ProtectRoute>
					}
				/>
				<Route
					path='/register'
					element={
						<ProtectRoute onlyUnAuth>
							<Register />
						</ProtectRoute>
					}
				/>
				<Route
					path='/forgot-password'
					element={
						<ProtectRoute onlyUnAuth>
							<ForgotPassword />
						</ProtectRoute>
					}
				/>
				<Route
					path='/reset-password'
					element={
						<ProtectRoute onlyUnAuth>
							<ResetPassword />
						</ProtectRoute>
					}
				/>
				<Route
					path='/profile'
					element={
						<ProtectRoute>
							<Profile />
						</ProtectRoute>
					}
				/>
				<Route
					path='/profile/orders'
					element={
						<ProtectRoute>
							<ProfileOrders />
						</ProtectRoute>
					}
				/>
			</Routes>
			{state?.background && (
			<Routes>
				<Route
				path='/ingredients/:id'
				element={
					<Modal title='Детали ингредиента' onClose={handleModalClose}>
						<IngredientDetails />
					</Modal>
				}
				/>
			</Routes>
			)}
			{state?.background && (
			<Routes>
				<Route
				path='/feed/:number'
				element={
					<Modal title='Детали заказа' onClose={handleModalClose}>
						<OrderInfo />
					</Modal>
				}
				/>
			</Routes>
			)}
			{state?.background && (
			<Routes>
				<Route
				path='/profile/orders/:number'
				element={
					<Modal title='Детали заказа' onClose={handleModalClose}>
						<OrderInfo />
					</Modal>
				}
				/>
			</Routes>
			)}
		</div>
	);
}

export default App;
