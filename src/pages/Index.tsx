
import { MindMapInput } from "@/components/MindMapInput";
import { useState, useEffect } from "react";

const Index = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-sage-50 flex flex-col items-center justify-center px-4">
      <div className={`max-w-4xl mx-auto text-center space-y-12 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="space-y-4">
          <div className="inline-block px-4 py-1.5 bg-sage-100 rounded-full text-sage-600 text-sm font-medium mb-4 animate-float">
            Transform Your Ideas
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
            Create Beautiful Mind Maps
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Start with any topic and watch your ideas branch out naturally. Our intelligent system helps you create comprehensive mind maps effortlessly.
          </p>
        </div>

        <div className={`transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <MindMapInput />
        </div>

        <div className={`pt-12 text-sm text-gray-500 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <p>No account required • Free to try • Export anytime</p>
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-sage-100/20 to-transparent rotate-12 transform-gpu animate-float" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-t from-sage-100/20 to-transparent -rotate-12 transform-gpu animate-float" style={{ animationDelay: '-3s' }} />
      </div>
    </div>
  );
};

export default Index;
