import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const { userData } = useSelector((state) => state.authReducer);
  return <AppHeaderUI userName={userData.name} />;
};
