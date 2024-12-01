import toast from 'react-hot-toast';

export const showSuccessNotification = (message) => {
  toast.success(message, {
    duration: 4000,
    position: 'bottom-right',
    style: {
      background: '#4CAF50',
      color: 'white',
      borderRadius: '8px',
      padding: '12px 20px',
    },
  });
};

export const showErrorNotification = (message) => {
  toast.error(message, {
    duration: 4000,
    position: 'bottom-right',
    style: {
      background: '#F44336',
      color: 'white',
      borderRadius: '8px',
      padding: '12px 20px',
    },
  });
};