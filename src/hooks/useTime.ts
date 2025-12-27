import { useState, useEffect } from 'react';

export function useTime() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        // Sync with seconds for smoother tick
        const tick = () => setTime(new Date());
        const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
    }, []);

    return time;
}
