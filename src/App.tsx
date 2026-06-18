import AppRouter from './router';
import { useAuctionFinalizer } from './hooks/useAuctionFinalizer';

export default function App() {
  useAuctionFinalizer();
  return <AppRouter />;
}
