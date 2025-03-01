
import React from 'react';
import { Loader } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...' 
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="loading-spinner">
      <div className="flex flex-col items-center justify-center">
        <Loader className={`${sizeMap[size]} animate-spin text-movie-accent`} />
        {text && <p className="mt-2 text-sm text-movie-secondary">{text}</p>}
      </div>
    </div>
  );
};

export default React.memo(LoadingSpinner);
