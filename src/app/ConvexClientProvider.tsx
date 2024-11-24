import React from 'react';

const ConvexClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className='overflow-y-hidden'>
      {children}
    </div>
  );
};

export default ConvexClientProvider;