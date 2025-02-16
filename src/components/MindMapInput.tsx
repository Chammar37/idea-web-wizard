
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

export const MindMapInput = () => {
  const [topic, setTopic] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast({
        title: "Please enter a topic",
        description: "The topic field cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    navigate('/mindmap', { state: { topic: topic.trim() } });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
      <div className="relative group">
        <Input
          type="text"
          placeholder="Enter your topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full px-6 py-4 text-lg transition-all duration-300 bg-white/60 backdrop-blur-sm border border-nezumi-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-nezumi-300 focus:border-nezumi-300 placeholder:text-gray-400 font-light tracking-wide"
        />
      </div>
      <Button
        type="submit"
        className="w-full py-6 text-base font-light tracking-wider text-nezu-500 transition-all duration-300 bg-nezumi-300/30 hover:bg-nezumi-300/50 border border-nezumi-300 rounded-lg flex items-center justify-center gap-3 group"
      >
        Begin Your Journey
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Button>
    </form>
  );
};
