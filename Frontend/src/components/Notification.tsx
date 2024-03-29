import * as React from 'react';
import clsx from 'clsx';
import { createPortal } from 'react-dom';
import { Toast } from 'flowbite-react';
import { CheckCircle, ExclamationCircle, InfoCircle } from 'flowbite-react-icons/outline';

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
        return <InfoCircle color={getTextClass()} />;
      case 'success':
        return <CheckCircle color={getTextClass()} />;
      case 'warning':
        return (
          <div className={getTextClass()}>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20" aria-hidden="true" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
        );
      case 'danger':
        return <ExclamationCircle color={getTextClass()} />;
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
