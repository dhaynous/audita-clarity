import { useState, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function AudioPlayer() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const cycleSpeed = () => {
    const idx = speeds.indexOf(speed);
    setSpeed(speeds[(idx + 1) % speeds.length]);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const duration = 1320; // 22 min mock
  const current = (progress / 100) * duration;

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold">🎧 Áudio da Consulta</h3>
        <span className="text-xs text-muted-foreground">Duração: {formatTime(duration)}</span>
      </div>

      <div className="flex items-center gap-3 mt-3">
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setProgress(Math.max(0, progress - 5))}>
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={() => setPlaying(!playing)}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setProgress(Math.min(100, progress + 5))}>
          <SkipForward className="h-4 w-4" />
        </Button>

        <div className="flex-1 flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono w-10">{formatTime(current)}</span>
          <Slider
            value={[progress]}
            onValueChange={([v]) => setProgress(v)}
            max={100}
            step={0.1}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground font-mono w-10">{formatTime(duration)}</span>
        </div>

        <Volume2 className="h-4 w-4 text-muted-foreground" />

        <button
          onClick={cycleSpeed}
          className="text-xs font-bold px-2 py-1 rounded bg-muted text-foreground hover:bg-accent transition-colors min-w-[40px]"
        >
          {speed}x
        </button>
      </div>

      <p className="text-xs text-muted-foreground mt-2 italic">
        Download desabilitado conforme LGPD.
      </p>
    </div>
  );
}
