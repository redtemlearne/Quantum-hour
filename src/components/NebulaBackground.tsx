import React from 'react';

export const NebulaBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10 cosmic-bg"
      aria-hidden="true"
    >
      {/* Soft blurred violet nebula glow */}
      <div
        className="absolute -top-[10%] -left-[10%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full bg-[#8b7cf6]/15 blur-[120px]"
      />

      {/* Soft blurred teal nebula glow */}
      <div
        className="absolute top-[40%] -right-[10%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full bg-[#5eead4]/10 blur-[130px]"
      />

      {/* Subtle secondary ambient space glow */}
      <div
        className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-[#8b7cf6]/8 blur-[100px]"
      />
    </div>
  );
};
