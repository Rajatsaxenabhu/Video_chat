import React, { useEffect, useRef, useState } from 'react';

interface VideoCallProps {
  onCallStart: () => void;
  onCallEnd: () => void;
  isCallActive: boolean;
}

const VideoCall: React.FC<VideoCallProps> = ({ onCallStart, onCallEnd, isCallActive }) => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCalling, setIsCalling] = useState(false);

  // Capture local video and audio
  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing media devices', err);
    }
  };

  // Stop the local stream when call ends
  const stopLocalStream = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
  };

  // Start the call (this should be connected to your WebRTC logic for offer/answer)
  const handleStartCall = () => {
    setIsCalling(true);
    onCallStart();
    startLocalStream();
  };

  // End the call (this should disconnect WebRTC peer connection)
  const handleEndCall = () => {
    setIsCalling(false);
    onCallEnd();
    stopLocalStream();
  };

  // Handle remote stream (received from peer connection)
  const handleRemoteStream = (stream: MediaStream) => {
    setRemoteStream(stream);
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = stream;
    }
  };

  // Clean up when component unmounts or call ends
  useEffect(() => {
    if (isCallActive) {
      handleStartCall();
    } else {
      handleEndCall();
    }

    return () => {
      stopLocalStream();
    };
  }, [isCallActive]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-800 text-white p-4">
      {/* Video Call UI */}
      <div className="flex flex-col md:flex-row items-center space-x-4">
        {/* Local Video */}
        <div className="relative mb-4 md:mb-0">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="w-64 h-48 border-2 border-gray-300 rounded-lg shadow-lg"
          />
          <span className="absolute top-2 left-2 text-white bg-black text-xs px-2 py-1 rounded-lg">You</span>
        </div>

        {/* Remote Video */}
        {isCallActive && (
          <div className="relative">
            <video
              ref={remoteVideoRef}
              autoPlay
              className="w-64 h-48 border-2 border-gray-300 rounded-lg shadow-lg"
            />
            <span className="absolute top-2 left-2 text-white bg-black text-xs px-2 py-1 rounded-lg">Remote</span>
          </div>
        )}
      </div>

      {/* Call Controls */}
      <div className="mt-4">
        {!isCallActive ? (
          <button
            onClick={handleStartCall}
            className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-500 transition duration-200"
          >
            Start Call
          </button>
        ) : (
          <button
            onClick={handleEndCall}
            className="px-6 py-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-500 transition duration-200"
          >
            End Call
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
