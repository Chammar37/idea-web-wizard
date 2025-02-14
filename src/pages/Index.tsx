
import { MindMapInput } from "@/components/MindMapInput";
import { useState, useEffect } from "react";

const Index = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-nezumi-300/30 flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Interactive floating nodes background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Large central node */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-nezumi-200/20 border border-nezumi-300/30 animate-[float_8s_ease-in-out_infinite]" />
        
        {/* Connected nodes */}
        <div className="absolute top-1/3 left-1/4 w-20 h-20 rounded-full bg-nezu-200/20 border border-nezu-300/20 animate-[float_6s_ease-in-out_infinite]">
          <div className="absolute w-32 h-px bg-gradient-to-r from-nezumi-300/20 to-transparent -right-32 top-1/2" />
        </div>
        
        <div className="absolute top-2/3 right-1/4 w-24 h-24 rounded-full bg-nezumi-400/20 border border-nezumi-300/20 animate-[float_7s_ease-in-out_infinite]">
          <div className="absolute w-40 h-px bg-gradient-to-l from-nezumi-300/20 to-transparent -left-40 top-1/2" />
        </div>
        
        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 rounded-full bg-nezu-300/20 border border-nezu-400/20 animate-[float_5s_ease-in-out_infinite]">
          <div className="absolute w-24 h-px bg-gradient-to-r from-nezumi-300/20 to-transparent -right-24 top-1/2 rotate-45" />
        </div>
        
        <div className="absolute top-1/4 right-1/3 w-28 h-28 rounded-full bg-nezumi-200/20 border border-nezumi-300/20 animate-[float_9s_ease-in-out_infinite]">
          <div className="absolute w-32 h-px bg-gradient-to-l from-nezumi-300/20 to-transparent -left-32 top-1/2 -rotate-45" />
        </div>

        {/* Additional floating nodes */}
        <div className="absolute top-1/4 left-1/2 w-12 h-12 rounded-full bg-nezu-200/20 border border-nezu-300/20 animate-[float_4s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/3 right-1/2 w-10 h-10 rounded-full bg-nezumi-300/20 border border-nezumi-400/20 animate-[float_6s_ease-in-out_infinite]" />
        <div className="absolute top-2/3 left-1/3 w-8 h-8 rounded-full bg-nezu-200/20 border border-nezu-300/20 animate-[float_5s_ease-in-out_infinite]" />
      </div>

      {/* Main content */}
      <div className={`relative z-10 max-w-3xl mx-auto text-center space-y-16 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="space-y-8">
          <div className="inline-block px-6 py-1.5 bg-nezumi-300/20 border border-nezumi-300 rounded-full text-nezu-500 text-sm font-light tracking-wide mb-4">
            思考の地図 • Mind Mapping
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-nezu-500 tracking-wide leading-relaxed">
            Create Beautiful
            <br />
            Mind Maps
          </h1>
          <p className="mt-6 text-base md:text-lg text-nezu-400 max-w-xl mx-auto font-light tracking-wide leading-relaxed">
            Start with any topic and watch your ideas branch out naturally, like a cherry blossom tree in spring.
          </p>
        </div>

        <div className={`transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <MindMapInput />
        </div>

        <div className={`pt-16 text-sm text-nezu-400 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <p className="font-light tracking-wider">始めましょう • Start Your Journey</p>
        </div>
      </div>

      {/* Subtle gradient overlays */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-nezumi-300/10 to-transparent rotate-45 transform-gpu" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-t from-nezumi-300/10 to-transparent -rotate-45 transform-gpu" />
      </div>
    </div>
  );
};

export default Index;
