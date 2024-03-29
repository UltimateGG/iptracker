import * as React from 'react';
import Notification, { NotificationProps } from '../components/Notification';

interface TimerInfo {
  notificationId: string;
  timer: number;
  seconds: number;
}

const randomId = () => {
  return 'n-' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

export interface NotificationContextProps {
  notifications: NotificationProps[];
  notify: (notification: NotificationProps, seconds?: number) => void;
  notifySuccess: (message: string, seconds?: number) => void;
  notifyError: (message: string, seconds?: number) => void;
}

export const NotificationContext = React.createContext<NotificationContextProps | undefined>(undefined);
export const NotificationProvider = ({ children }: { children?: React.ReactNode }) => {
  const [notifications, setNotifications] = React.useState<NotificationProps[]>([]);
  const [timers, setTimers] = React.useState<TimerInfo[]>([]);

  /**
   * @param seconds Seconds until auto dismiss, or -1 for until manually dismissed
   */
  const notifyError = (msg: string, seconds = 5) => {
    notify({ color: 'danger', children: msg }, seconds);
  };

  /**
   * @param seconds Seconds until auto dismiss, or -1 for until manually dismissed
   */
  const notifySuccess = (msg: string, seconds = 5) => {
    notify({ color: 'success', children: msg }, seconds);
  };

  /**
   * @param seconds Seconds until auto dismiss, or -1 for until manually dismissed
   */
  const notify = (notification: NotificationProps, seconds = 5) => {
    const id = randomId();
    notification.id = id;
    setNotifications(arr => [...arr, notification]);

    if (seconds > 0) {
      const timerInfo: TimerInfo = {
        notificationId: id,
        timer: setTimeout(() => removeNotification(id), seconds * 1000),
        seconds
      };

      setTimers(arr => [...arr, timerInfo]);
    }

    setTimeout(() => {
      setNotifications(arr => arr.map(n => (n.id === notification.id ? { ...n, shown: true } : n)));
    }, 0); // Next tick for animation to work properly
  };

  const removeNotification = (id?: string) => {
    if (!id) return;
    setNotifications(arr => arr.map(n => (n.id === id ? { ...n, shown: false } : n)));

    setTimeout(() => {
      setNotifications(arr => arr.filter(n => n.id !== id));
      setTimers(arr => arr.filter(t => t.notificationId !== id));
    }, 300); // ! Keep with notification animation duration in Notification.tsx
  };

  return (
    <NotificationContext.Provider value={{ notifications, notifyError, notifySuccess, notify }}>
      {children}

      {notifications.map((n, index) => (
        <Notification
          {...n}
          key={index}
          __index={index}
          onMouseEnter={() => {
            const timerInfo = timers.find(t => t.notificationId === n.id);
            if (timerInfo) clearTimeout(timerInfo.timer);
          }}
          onMouseLeave={() => {
            const timerInfo = timers.find(t => t.notificationId === n.id);
            if (timerInfo) timerInfo.timer = setTimeout(() => removeNotification(n.id), timerInfo.seconds * 1000);
          }}
          onDismiss={() => removeNotification(n.id)}
        />
      ))}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = React.useContext(NotificationContext);

  if (context === undefined) throw new Error('You are not using the correct provider (NotificationContext).');

  return context;
};
