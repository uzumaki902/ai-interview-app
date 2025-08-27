"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface AIAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  currentQuestion: string;
  onStartListening: () => void;
  onStopListening: () => void;
}

export default function AIAvatar({ 
  isSpeaking, 
  isListening, 
  currentQuestion, 
  onStartListening, 
  onStopListening 
}: AIAvatarProps) {
  const [avatarState, setAvatarState] = useState<'idle' | 'speaking' | 'listening'>('idle');
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSpeaking) {
      setAvatarState('speaking');
    } else if (isListening) {
      setAvatarState('listening');
    } else {
      setAvatarState('idle');
    }
  }, [isSpeaking, isListening]);

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* AI Avatar */}
      <div className="relative">
        {/* Avatar Container */}
        <motion.div
          ref={avatarRef}
          className="w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl"
          animate={{
            scale: avatarState === 'speaking' ? [1, 1.05, 1] : 1,
            rotate: avatarState === 'listening' ? [0, 5, -5, 0] : 0,
          }}
          transition={{
            duration: 2,
            repeat: avatarState === 'speaking' ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          {/* AI Face */}
          <div className="text-white text-6xl">
            {avatarState === 'speaking' && '🗣️'}
            {avatarState === 'listening' && '👂'}
            {avatarState === 'idle' && '🤖'}
          </div>
        </motion.div>

        {/* Speaking Animation */}
        {avatarState === 'speaking' && (
          <motion.div
            className="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Listening Animation */}
        {avatarState === 'listening' && (
          <motion.div
            className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Pulse Ring */}
        <motion.div
          className="absolute inset-0 border-4 border-blue-300 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Status Indicator */}
      <div className="text-center">
        <motion.div
          className={`px-4 py-2 rounded-full text-white font-medium ${
            avatarState === 'speaking' ? 'bg-blue-500' :
            avatarState === 'listening' ? 'bg-yellow-500' :
            'bg-gray-500'
          }`}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {avatarState === 'speaking' && '🤖 AI is asking a question...'}
          {avatarState === 'listening' && '👂 Listening to your answer...'}
          {avatarState === 'idle' && '⏸️ Ready for interview'}
        </motion.div>
      </div>

      {/* Current Question Display */}
      {currentQuestion && (
        <motion.div
          className="max-w-md bg-white p-4 rounded-lg shadow-lg border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="font-semibold text-gray-800 mb-2">Current Question:</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{currentQuestion}</p>
        </motion.div>
      )}

      {/* Control Buttons */}
      <div className="flex space-x-4">
        <motion.button
          onClick={onStartListening}
          disabled={avatarState === 'speaking'}
          className={`px-6 py-3 rounded-lg font-medium text-white ${
            avatarState === 'speaking' 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
          whileHover={{ scale: avatarState === 'speaking' ? 1 : 1.05 }}
          whileTap={{ scale: avatarState === 'speaking' ? 1 : 0.95 }}
        >
          🎤 Start Answering
        </motion.button>

        <motion.button
          onClick={onStopListening}
          disabled={avatarState !== 'listening'}
          className={`px-6 py-3 rounded-lg font-medium text-white ${
            avatarState !== 'listening' 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-red-500 hover:bg-red-600'
          }`}
          whileHover={{ scale: avatarState !== 'listening' ? 1 : 1.05 }}
          whileTap={{ scale: avatarState !== 'listening' ? 1 : 0.95 }}
        >
          ⏹️ Stop Answering
        </motion.button>
      </div>

      {/* Instructions */}
      <div className="text-center text-gray-600 max-w-md">
        <h4 className="font-medium mb-2">🎯 How to use:</h4>
        <ul className="text-sm space-y-1">
          <li>• AI will speak each question out loud</li>
          <li>• Click "Start Answering" to respond with your voice</li>
          <li>• Speak clearly and naturally</li>
          <li>• Click "Stop Answering" when done</li>
        </ul>
      </div>
    </div>
  );
}
