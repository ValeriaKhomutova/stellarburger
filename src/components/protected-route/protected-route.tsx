import { useSelector, useDispatch } from '../../services/store';
import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Типы для пропсов компонента
export type TProtectedRouteProps = {
  onlyForUnauthorized?: boolean;
  children: ReactElement;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  onlyForUnauthorized = false,
  children
}) => {
  // Получаем данные пользователя из хранилища
  const { authChecked, userData: user } = useSelector(
    (state) => state.authReducer
  );
  const location = useLocation();

  // Если маршрут только для неавторизованных, а пользователь вошел
  if (onlyForUnauthorized && user.email && user.name) {
    // Перенаправляем откуда пришел или на главную
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} />;
  }

  // Если маршрут для авторизованных, а пользователь не вошел
  if (!onlyForUnauthorized && (!user.email || !user.name)) {
    // Перенаправляем на логин, сохраняя откуда пришли
    return <Navigate to='/login' state={{ from: location }} />;
  }

  // Если все проверки пройдены - рендерим детей
  return children;
};
