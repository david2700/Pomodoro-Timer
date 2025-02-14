import { useState, useEffect } from "react";
import TaskList from "../TaskList/TaskList";
import styles from "./Timer.module.css";
import { useTheme } from "../../ThemeContext";

export default function Timer() {
    const [timeLeft, setTimeLeft] = useState(1500);
    const [isRunning, setIsRunning] = useState(false);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);
    const [activeMode, setActiveMode] = useState("Pomodoro");
    const { setTheme, theme } = useTheme();
    const [pomodoroCount, setPomodoroCount] = useState(1);

    useEffect(() => {
      if (!isRunning) return; 

      const interval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft <= 1) {
            setIsRunning(false);
            if (activeMode === "Pomodoro") {
              setSessionsCompleted(prev => prev + 1);
            }
            switchToNextMode();
            return 0;
          }
          return prevTimeLeft - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRunning, activeMode, pomodoroCount]);

    const switchToNextMode = () => {
      if (activeMode === "Pomodoro") {
        // If we just finished a Pomodoro, go to appropriate break
        if (pomodoroCount === 4) {
          handleModeChange("long", 15);
          setPomodoroCount(1); // Reset counter after 4th pomodoro
        } else {
          handleModeChange("short", 5);
          setPomodoroCount(prev => prev + 1);
        }
      } else {
        // If we're in any break, go back to Pomodoro
        handleModeChange("Pomodoro", 25);
      }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    const handleModeChange = (mode, time) => {
      setActiveMode(mode);
      setTimeLeft(time * 60);
      setIsRunning(false);

      if (mode === "Pomodoro") {
        setTheme("bg-pomodoro");
      } else if (mode === "short") {
        setTheme("bg-short-break");
      } else if (mode === "long") {
        setTheme("bg-long-break");
      }
    }

    const getButtonClass = () => {
      if (theme === "bg-pomodoro") return styles.pomodoro;
      if (theme === "bg-short-break") return styles.shortBreak;
      if (theme === "bg-long-break") return styles.longBreak;
      return "";
    };

    const handleSkip = () => {
      setIsRunning(false);
      if (activeMode === "Pomodoro") {
        setSessionsCompleted(prev => prev + 1);
      }
      switchToNextMode();
    };

    return (
      <main className={styles.mainContainer}>
        <section className={styles.timerContainer}>
          <div className={styles.buttons}>
            <button className={`${styles.button} ${activeMode === "Pomodoro" ? styles.active : ""}`} onClick={() => {handleModeChange("Pomodoro", 25)}}>Pomodoro</button>
            <button className={`${styles.button} ${activeMode === "short" ? styles.active : ""}`} onClick={() => {handleModeChange("short", 5);}}>Short Break</button>
            <button className={`${styles.button} ${activeMode === "long" ? styles.active : ""}`} onClick={() => {handleModeChange("long", 15)}}>Long Break</button>
          </div>

          <h1 className={styles.timer}>{formatTime(timeLeft)}</h1>
          <div className={styles.playButtons}>
            <button
              className={`${styles.playButton} ${isRunning ? styles.pauseButton : ""} ${getButtonClass()}`}
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? 'PAUSE' : 'START'}
            </button>
            <button
              className={`${styles.skipButton} ${getButtonClass()}`}
              onClick={handleSkip}
              aria-label="Skip to next session"
            >
              ⏭️
            </button>
          </div>

        </section>
        <section>
          <TaskList sessionsCompleted={sessionsCompleted} />
        </section>
      </main>
    );
}
