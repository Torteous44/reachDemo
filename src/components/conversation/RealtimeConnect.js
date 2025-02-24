import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AudioVisualizer from './AudioVisualizer';
import './RealtimeConnect.css';

function RealtimeConnect() {
  const { sessionId: urlSessionId } = useParams();
  const [sessionId, setSessionId] = useState(urlSessionId || "");
  const [log, setLog] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [mediaStream, setMediaStream] = useState(null);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const peerConnection = useRef(null);
  const navigate = useNavigate();

  const appendLog = useCallback((msg) => {
    console.log("Log:", msg);
    setLog((prev) => prev + "\n" + msg);
  }, []);

  const handleConnect = useCallback(async () => {
    if (!sessionId) {
      appendLog("No session ID provided");
      return alert("Need a session ID.");
    }

    appendLog("Starting connection process...");
    const token = localStorage.getItem("token");
    if (!token) {
      appendLog("Not logged in");
      return alert("You must be logged in first.");
    }

    try {
      setIsConnected(true);
      // 1) Get ephemeral token from your backend
      appendLog("Fetching ephemeral token...");
      const rtResp = await fetch(`https://demobackend-p2e1.onrender.com/realtime/token?session_id=${sessionId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!rtResp.ok) throw new Error("Failed to get ephemeral token");
      const rtData = await rtResp.json();
      const ephemeralKey = rtData.client_secret.value;
      appendLog("Got ephemeral key: " + ephemeralKey.substring(0, 15) + "...");
      
      // 2) Create local RTCPeerConnection
      appendLog("Creating RTCPeerConnection...");
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      });
      
      // Add connection state change logging
      pc.onconnectionstatechange = () => {
        appendLog(`Connection state changed: ${pc.connectionState}`);
      };
      
      pc.oniceconnectionstatechange = () => {
        appendLog(`ICE connection state: ${pc.iceConnectionState}`);
      };
      
      pc.onicegatheringstatechange = () => {
        appendLog(`ICE gathering state: ${pc.iceGatheringState}`);
      };
      
      pc.onsignalingstatechange = () => {
        appendLog(`Signaling state: ${pc.signalingState}`);
      };

      // 3) Add audio track for user's microphone
      appendLog("Adding user audio track...");
      const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(newStream);
      newStream.getTracks().forEach(track => {
        track.enabled = !isMuted;
        pc.addTrack(track, newStream);
      });
      
      // 4) Set up ontrack handler for incoming audio
      pc.ontrack = (evt) => {
        appendLog("🎵 Track received: " + evt.track.kind);
        if (evt.track.kind === "audio") {
          appendLog("Setting up audio playback...");
          try {
            const stream = evt.streams[0];
            console.log('Stream received:', stream); // Debug log
            console.log('Stream active:', stream.active); // Debug log
            console.log('Audio tracks:', stream.getAudioTracks().length); // Debug log
            
            setMediaStream(stream);
            
            if (audioRef.current) {
              audioRef.current.srcObject = stream;
              audioRef.current.play()
                .then(() => appendLog("Playback started"))
                .catch(err => appendLog(`Play failed: ${err.message}`));
            }
          } catch (err) {
            appendLog(`Audio setup error: ${err.message}`);
            console.error('Audio setup error:', err);
          }
        }
      };

      // 5) Create local SDP offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      appendLog("Local SDP offer created.");
      
      // 6) Send the SDP offer to OpenAI Realtime
      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";
      const sdpResp = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ephemeralKey}`,
          "Content-Type": "application/sdp"
        },
        body: offer.sdp
      });
      if (!sdpResp.ok) throw new Error("OpenAI Realtime handshake failed");
      const answerSDP = await sdpResp.text();
      appendLog("Received SDP answer from OpenAI.");
      
      // 7) Set remote SDP
      await pc.setRemoteDescription({ type: "answer", sdp: answerSDP });
      appendLog("Remote SDP set.");
      
      appendLog("Setup complete - waiting for audio...");
    } catch (err) {
      appendLog(` Connection error: ${err.message}`);
      console.error("Connection error:", err);
      setIsConnected(false);
    }
  }, [sessionId, isMuted, appendLog]);

  useEffect(() => {
    if (urlSessionId) {
      handleConnect();
    }
  }, [urlSessionId, handleConnect]);

  useEffect(() => {
    let interval;
    if (isConnected) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}s`;
  }

  const handleEndCall = async () => {
    try {
      // Stop all tracks in the media stream
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }

      // Close WebRTC connection if it exists
      if (peerConnection.current) {
        peerConnection.current.close();
      }

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Send end session request to backend
      const token = localStorage.getItem('token');
      await fetch(`https://demobackend-p2e1.onrender.com/sessions/${sessionId}/end`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Navigate back to dashboard
      navigate('/dashboard');
    } catch (err) {
      appendLog(`Error ending call: ${err.message}`);
    }
  };

  const handleMuteToggle = () => {
    if (mediaStream) {
      const audioTracks = mediaStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
      appendLog(`Microphone ${!isMuted ? 'muted' : 'unmuted'}`);
    }
  };

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
    if (!isPaused) {
      // Pause timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      // Pause audio
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => {
          track.enabled = false;
        });
      }
      appendLog("Interview paused");
    } else {
      // Resume timer
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      // Resume audio
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => {
          track.enabled = true;
        });
      }
      appendLog("Interview resumed");
    }
  };

  // Initialize timer when component mounts
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="realtime-connect-container">
      {!urlSessionId && (
        <div className="session-input">
          <h2>Enter Session ID</h2>
          <input 
            value={sessionId} 
            onChange={(e) => setSessionId(e.target.value)}
            type="number"
            placeholder="Enter session ID"
          />
          <button onClick={handleConnect}>Connect</button>
        </div>
      )}

      <div className="interview-interface">
        <div className="visualizer-container">
          <AudioVisualizer mediaStream={mediaStream} />
          <div className="timer">{formatTime(timer)}</div>
        </div>
        
        <div className="controls">
          <button
            className={`control-button ${isMuted ? 'active' : ''}`}
            onClick={handleMuteToggle}
            title={isMuted ? "Unmute" : "Mute"}
          >
            <img 
              src="/assets/mute.svg" 
              alt="Mute"
              className="control-icon"
            />
          </button>

          <button
            className="control-button end-call"
            onClick={handleEndCall}
            title="End Call"
          >
            <img 
              src="/assets/call.svg" 
              alt="End Call"
              className="control-icon"
            />
          </button>

          <button
            className={`control-button ${isPaused ? 'active' : ''}`}
            onClick={handlePauseToggle}
            title={isPaused ? "Resume" : "Pause"}
          >
            <img 
              src="/assets/pause.svg" 
              alt="Pause"
              className="control-icon"
            />
          </button>
        </div>
      </div>
      
      <audio 
        ref={audioRef}
        id="aiAudio" 
        autoPlay 
        hidden 
      />
      
      {/* Debug log - can be hidden in production */}
      <pre className="debug-log">{log}</pre>
    </div>
  );
}

export default RealtimeConnect;
