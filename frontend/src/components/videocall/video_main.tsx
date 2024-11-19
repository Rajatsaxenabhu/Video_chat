import React, { useState } from 'react';
import VideoCall from '../videocall/interface';

const Videomain: React.FC = () => {
  const [isCallActive, setIsCallActive] = useState(false);

  const handleCallStart = () => {
    // Handle WebRTC signaling to start the call (not implemented here)
    console.log('Call started');
  };

  const handleCallEnd = () => {
    // Handle WebRTC signaling to end the call (not implemented here)
    console.log('Call ended');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <VideoCall
        isCallActive={isCallActive}
        onCallStart={handleCallStart}
        onCallEnd={handleCallEnd}
      />
    </div>
  );
};

export default Videomain;
