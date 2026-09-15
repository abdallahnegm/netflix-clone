const HeroSkeleton = () => {
  return (
    <section
      id="hero"
      className="bg-[#141414] h-screen relative overflow-hidden animate-pulse"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10"></div>

      <div className="container relative z-20 flex flex-col items-start justify-center h-full max-w-8xl w-full m-auto md:p-6 p-6">
        <div className="h-14 md:h-20 w-72 md:w-[500px] bg-[#2a2a2a] rounded mb-6"></div>

        <div className="flex items-center gap-4">
          <div className="h-5 w-16 bg-[#2a2a2a] rounded"></div>
          <div className="h-5 w-20 bg-[#2a2a2a] rounded"></div>
          <div className="h-5 w-14 bg-[#2a2a2a] rounded"></div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="h-4 w-80 md:w-[600px] bg-[#2a2a2a] rounded"></div>
          <div className="h-4 w-72 md:w-[550px] bg-[#2a2a2a] rounded"></div>
          <div className="h-4 w-60 md:w-[450px] bg-[#2a2a2a] rounded"></div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <div className="h-10 w-32 bg-[#2a2a2a] rounded-full"></div>
          <div className="h-10 w-28 bg-[#2a2a2a] rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSkeleton;
