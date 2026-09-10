import React from 'react';
import { Modal } from '../common/Modal';

export interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  trailerUrl: string;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  isOpen,
  onClose,
  title,
  trailerUrl,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center gap-2 text-base font-bold">
          <span className="text-[var(--primary)] font-black">Trailer:</span>
          <span className="truncate">{title}</span>
        </div>
      }
    >
      <div className="relative w-full pb-[56.25%] h-0 rounded-xl overflow-hidden bg-black shadow-2xl">
        {isOpen && (
          <iframe
            src={trailerUrl}
            title={title}
            className="absolute top-0 left-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </Modal>
  );
};
