
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Timer, Play, Pause, RotateCcw, Bell } from "lucide-react";

const FocusTimer = () => {
  const [duration, setDuration] = useState(25); // Default 25 minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const { toast } = useToast();

  // Reset timer when duration changes
  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  // Timer countdown logic
  useEffect(() => {
    let interval: number | undefined;
    
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      
      // Show notification
      toast({
        title: isBreak ? "Break finished!" : "Focus session complete!",
        description: isBreak 
          ? "Time to get back to work." 
          : "Great job! Take a short break.",
      });
      
      // Toggle between focus and break
      if (!isBreak) {
        setIsBreak(true);
        setDuration(5); // 5 minute break
        setTimeLeft(5 * 60);
      } else {
        setIsBreak(false);
        setDuration(25); // Back to 25 minute focus
        setTimeLeft(25 * 60);
      }
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak, toast]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start or pause timer
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setDuration(25);
    setTimeLeft(25 * 60);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Timer className="mr-2 h-5 w-5" />
            Focus Timer
          </div>
          <Badge variant={isBreak ? "outline" : "default"}>
            {isBreak ? "Break" : "Focus"}
          </Badge>
        </CardTitle>
        <CardDescription>
          Stay focused and track your productivity sessions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div className="flex justify-center">
            <div className="text-5xl font-bold tracking-tighter">
              {formatTime(timeLeft)}
            </div>
          </div>
          
          {!isRunning && !isBreak && (
            <div className="py-2">
              <div className="flex justify-between mb-2 text-sm">
                <span>Duration (minutes):</span>
                <span>{duration}</span>
              </div>
              <Slider
                value={[duration]}
                min={5}
                max={60}
                step={5}
                onValueChange={(value) => setDuration(value[0])}
                disabled={isRunning}
              />
            </div>
          )}
          
          <div className="flex justify-center space-x-3">
            <Button
              variant={isRunning ? "destructive" : "default"}
              onClick={toggleTimer}
            >
              {isRunning ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  {timeLeft < duration * 60 ? "Resume" : "Start"}
                </>
              )}
            </Button>
            
            <Button variant="outline" onClick={resetTimer}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
          
          {isRunning && (
            <div className="text-center text-sm text-muted-foreground">
              <Bell className="inline h-3 w-3 mr-1" />
              You'll be notified when the timer ends
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FocusTimer;
