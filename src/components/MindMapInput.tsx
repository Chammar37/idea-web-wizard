
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export const MindMapInput = () => {
  const [topic, setTopic] = useState('');
  const { toast } = useToast();

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
    // Handle the topic submission here
    toast({
      title: "Topic received!",
      description: "Creating your mind map for: " + topic,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4">
      <div className="relative group">
        <Input
          type="text"
          placeholder="Enter your topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full px-4 py-3 text-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent placeholder:text-gray-400"
        />
      </div>
      <Button
        type="submit"
        className="w-full py-6 text-lg font-medium text-white transition-all duration-300 bg-sage-300 hover:bg-sage-400 rounded-lg flex items-center justify-center gap-2 group"
      >
        Create Mind Map
        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
      </Button>
    </form>
  );
};
