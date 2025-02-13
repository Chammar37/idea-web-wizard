
import { MindMapInput } from "@/components/MindMapInput";
import { useState, useEffect } from "react";

const Index = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-sage-50/30 flex flex-col items-center justify-center px-4">
      <div className={`max-w-3xl mx-auto text-center space-y-16 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="space-y-8">
          <div className="inline-block px-6 py-1.5 bg-sage-50 border border-sage-200 rounded-full text-sage-600 text-sm font-light tracking-wide mb-4">
            思考の地図 • Mind Mapping
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 tracking-wide leading-relaxed">
            Create Beautiful
            <br />
            Mind Maps
          </h1>
          <p className="mt-6 text-base md:text-lg text-gray-600 max-w-xl mx-auto font-light tracking-wide leading-relaxed">
            Start with any topic and watch your ideas branch out naturally, like a cherry blossom tree in spring.
          </p>
        </div>

        <div className={`transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <MindMapInput />
        </div>

        <div className={`pt-16 text-sm text-gray-500 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <p className="font-light tracking-wider">始めましょう • Start Your Journey</p>
        </div>
      </div>

      {/* Background decoration - more subtle and minimal */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-sage-100/10 to-transparent rotate-45 transform-gpu" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-t from-sage-100/10 to-transparent -rotate-45 transform-gpu" />
      </div>
    </div>
  );
};

export default Index;
