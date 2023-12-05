import { type ReactNode, createContext, useContext, useReducer } from "react";

export type Timer = {
  name: string;
  duration: number;
};

type TimersState = {
  isRunning: boolean;
  timers: Timer[];
};

const initialState: TimersState = {
  isRunning: true,
  timers: [],
};

type TimersContextValue = TimersState & {
  addTimer: (timerData: Timer) => void;
  startTimers: () => void;
  stopTimers: () => void;
};

const TimerContext = createContext<TimersContextValue | null>(null);

export function useTimersContext() {
  const timersCtx = useContext(TimerContext);

  if (timersCtx === null) {
    throw new Error("timers context is null - that should not be the case!");
  }
  return timersCtx;
}

type TimerContextProviderProps = {
  children: ReactNode;
};

type StartTimerAction = {
  type: "START_TIMERS";
};
type StopTimerAction = {
  type: "STOP_TIMERS";
};

type AddTimerAction = {
  type: "ADD_TIMER";
  payload: Timer;
};

type Action = StartTimerAction | StopTimerAction | AddTimerAction;
function timersReducer(state: TimersState, action: Action): TimersState {
  if (action.type === "START_TIMERS") {
    return {
      ...state,
      isRunning: true,
    };
  }

  if (action.type === "STOP_TIMERS") {
    return {
      ...state,
      isRunning: false,
    };
  }

  if (action.type === "ADD_TIMER") {
    return {
      ...state,
      timers: [
        ...state.timers,
        {
          name: action.payload.name,
          duration: action.payload.duration,
        },
      ],
    };
  }
  return state;
}

export default function TimerContextProvider({ children }: TimerContextProviderProps) {
  const [timersState, dispatch] = useReducer(timersReducer, initialState);

  const ctx: TimersContextValue = {
    timers: timersState.timers,
    isRunning: timersState.isRunning,
    addTimer(timerData) {
      dispatch({ type: "ADD_TIMER", payload: timerData });
    },
    startTimers() {
      dispatch({ type: "START_TIMERS" });
    },
    stopTimers() {
      dispatch({ type: "STOP_TIMERS" });
    },
  };

  return <TimerContext.Provider value={ctx}>{children}</TimerContext.Provider>;
}
