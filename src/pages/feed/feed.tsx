import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchFeedData } from '../../services/slices/feed-slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { loading, feedData } = useSelector((state) => state.feedReducer);

  //TODO: взять переменную из стора
  const orders: TOrder[] = feedData.orders;

  const handleGetFeeds = () => {
    dispatch(fetchFeedData());
  };

  useEffect(() => {
    handleGetFeeds();
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return loading ? (
    <Preloader />
  ) : (
    <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />
  );
};
