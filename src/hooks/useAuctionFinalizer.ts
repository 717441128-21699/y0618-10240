import { useEffect, useRef } from 'react';
import { useActivityStore } from '../store/useActivityStore';

export function useAuctionFinalizer() {
  const checkedItemsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const finalizeExpired = () => {
      const { activities, items, finalizeAuction, endActivity } = useActivityStore.getState();
      const now = new Date().getTime();

      for (const activity of activities) {
        const endTime = new Date(activity.endTime).getTime();
        if (endTime <= now && activity.status !== 'ended') {
          endActivity(activity.id);

          const activityItems = items.filter(i => i.activityId === activity.id);
          for (const item of activityItems) {
            if (item.status === 'active' && !checkedItemsRef.current.has(item.id)) {
              const ok = finalizeAuction(item.id);
              if (ok || item.status !== 'active') {
                checkedItemsRef.current.add(item.id);
              }
            }
          }
        } else if (endTime <= now && activity.status === 'ended') {
          const activityItems = items.filter(i => i.activityId === activity.id);
          for (const item of activityItems) {
            if (item.status === 'active' && !checkedItemsRef.current.has(item.id)) {
              const ok = finalizeAuction(item.id);
              if (ok || item.status !== 'active') {
                checkedItemsRef.current.add(item.id);
              }
            }
          }
        }
      }
    };

    finalizeExpired();

    const timer = setInterval(finalizeExpired, 5000);

    const originalFinalize = useActivityStore.getState().finalizeAuction;
    useActivityStore.setState(state => ({
      ...state,
      finalizeAuction: (itemId: string) => {
        checkedItemsRef.current.add(itemId);
        return originalFinalize(itemId);
      },
    }));

    return () => {
      clearInterval(timer);
    };
  }, []);

  return null;
}
