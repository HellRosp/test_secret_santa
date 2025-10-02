import React from 'react';
import Modal from './Modal';
import Button from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {

  const handleConfirm = () => {
    onConfirm();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="text-slate-600">
        <p>{message}</p>
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose} className="w-auto px-6">
            {cancelText}
          </Button>
          <Button variant="primary" onClick={handleConfirm} className="w-auto px-6">
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
