import { useState } from "react"

export default function useVisualMode(initial) {
// eslint-disable-next-line
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);


  const transition = (newmode, opt = false) => {
    if (opt) {
  
      // history[history.length - 1] = newmode;`
      setHistory((prev) => ([...prev.slice(0,-1),newmode]))
      return setMode(history[history.length - 1]);
    }
    setHistory(prev => [...prev,newmode])
    return setMode(newmode);
  }

  const back = () => {
    if (history.length > 1) {
      setHistory((prev) => ([...prev.slice(0,-1)]))
      return setMode(history[history.length - 1]);
    }

  }

  return { mode:history[history.length - 1], transition, back };

}