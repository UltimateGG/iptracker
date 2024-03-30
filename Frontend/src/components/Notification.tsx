import * as React from 'react';
import clsx from 'clsx';
import { createPortal } from 'react-dom';
import { Toast } from 'flowbite-react';
import { HiCheckCircle, HiExclamation, HiExclamationCircle, HiInformationCircle } from 'react-icons/hi';

export interface NotificationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  /** If the notification is visible (Controls animation)
   * @default false
   */
  shown?: boolean;

  /** The color of the notification
   * @default 'info'
   */
  color?: 'info' | 'success' | 'warning' | 'danger';

  /** Whether an icon will be displayed on the left side of the notification
   * @default true
   */
  showIcon?: boolean;

  /** The position of the notification. Bottom/top is centered.
   * @default 'bottom'
   */
  position?: 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right';

  /** If the notification will have a close button/x
   * @default true
   */
  dismissible?: boolean;

  onDismiss?: () => void;

  /** Used internally to keep track of the notification's index in the NotificationContext. Controls positioning */
  __index?: number;
}

const Notification = ({ shown = false, color = 'info', showIcon = true, position = 'top-left', dismissible = true, onDismiss, __index = 0, ...rest }: NotificationProps) => {
  const getTextClass = () => {
    switch (color) {
      case 'info':
        return 'text-sky-500 dark:text-sky-200';
      case 'success':
        return 'text-green-400 dark:text-green-200';
      case 'warning':
        return 'text-yellow-400 dark:text-yellow-200';
      case 'danger':
        return 'text-red-500 dark:text-red-200';
    }
  };

  const getBgClass = () => {
    switch (color) {
      case 'info':
        return 'bg-sky-100 dark:bg-sky-800';
      case 'success':
        return 'bg-green-100 dark:bg-green-800';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-800';
      case 'danger':
        return 'bg-red-100 dark:bg-red-800';
    }
  };

  const getIcon = () => {
    switch (color) {
      case 'info':
        return <HiInformationCircle color={getTextClass()} />;
      case 'success':
        return <HiCheckCircle color={getTextClass()} />;
      case 'warning':
        return <HiExclamation className={getTextClass()} />;
      case 'danger':
        return <HiExclamationCircle color={getTextClass()} />;
    }
  };

  return createPortal(
    <div
      {...rest}
      className={clsx(
        'fixed transition-opacity duration-300 m-4 shadow-lg z-50',
        shown ? 'pointer-events-all' : 'pointer-events-none opacity-0',
        position === 'top' && 'top-0 left-1/2 -translate-x-1/2',
        position === 'top-left' && 'top-0 left-0',
        position === 'top-right' && 'top-0 right-0',
        position === 'bottom' && 'bottom-0 left-1/2 -translate-x-1/2',
        position === 'bottom-left' && 'bottom-0 left-0',
        position === 'bottom-right' && 'bottom-0 right-0',
        rest.className
      )}
      style={{
        top: (position.includes('top') && `${__index * 4.6}rem`) || undefined,
        bottom: (position.includes('bottom') && `${__index * 4.6}rem`) || undefined,
        ...rest.style
      }}
    >
      <Toast className="w-full min-w-[200px] border border-gray-200 dark:border-gray-700">
        <div className={clsx('inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', getBgClass(), getTextClass())}>{showIcon && getIcon()}</div>
        <div className="ml-3 text-sm font-normal">{rest.children}</div>
        {dismissible && <Toast.Toggle onClick={() => onDismiss && onDismiss()} />}
      </Toast>
    </div>,
    document.body
  );
};

export default Notification;
