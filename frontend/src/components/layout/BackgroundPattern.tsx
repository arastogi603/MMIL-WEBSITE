export const BackgroundPattern = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-white">
      {/* Top Left Blob */}
      <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] bg-neutral-100 rounded-[3rem] opacity-70 transform rotate-12" />
      <div className="absolute top-[25%] left-[15%] w-[150px] h-[150px] bg-neutral-100 rounded-[2rem] opacity-70 transform -rotate-6" />
      <div className="absolute top-[40%] left-[5%] w-[100px] h-[100px] bg-neutral-100 rounded-[1.5rem] opacity-70 transform rotate-45" />

      {/* Top Right Blob */}
      <div className="absolute top-[5%] right-[10%] w-[200px] h-[120px] bg-neutral-100 rounded-[2rem] opacity-70 transform -rotate-6" />
      <div className="absolute top-[20%] right-[5%] w-[100px] h-[100px] bg-neutral-100 rounded-[1.5rem] opacity-70 transform rotate-12" />
      <div className="absolute top-[35%] right-[2%] w-[150px] h-[250px] bg-neutral-100 rounded-[2rem] opacity-70 transform -rotate-12" />

      {/* Center Blobs */}
      <div className="absolute top-[45%] left-[35%] w-[180px] h-[180px] bg-neutral-100 rounded-[2rem] opacity-70 transform rotate-12" />
      <div className="absolute top-[55%] left-[55%] w-[250px] h-[250px] bg-neutral-100 rounded-[3rem] opacity-70 transform -rotate-6" />
      <div className="absolute top-[65%] left-[45%] w-[150px] h-[150px] bg-neutral-100 rounded-[2rem] opacity-70 transform rotate-45" />

      {/* Bottom Left Blob */}
      <div className="absolute bottom-[10%] left-[10%] w-[250px] h-[250px] bg-neutral-100 rounded-[3rem] opacity-70 transform -rotate-12" />
      <div className="absolute bottom-[20%] left-[25%] w-[120px] h-[120px] bg-neutral-100 rounded-[1.5rem] opacity-70 transform rotate-6" />

      {/* Bottom Right Blob */}
      <div className="absolute bottom-[5%] right-[5%] w-[300px] h-[300px] bg-neutral-100 rounded-[3rem] opacity-70 transform rotate-12" />
      <div className="absolute bottom-[25%] right-[15%] w-[150px] h-[150px] bg-neutral-100 rounded-[2rem] opacity-70 transform -rotate-45" />
    </div>
  );
};
