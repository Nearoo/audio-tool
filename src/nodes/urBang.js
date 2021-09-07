import { Button } from "antd";
import { useState } from "react";
import { globalScheduler, s, useOnGlobalSchedulerStart, useOnGlobalSchedulerStop } from "../scheduler/scheduler";


export const UrBang = ({useTitle, useBangOutputHandle}) => {
    useTitle();

    // Use isRunning state following global scheduler state
    const [isRunning, setRunning] = useState(false);
    useOnGlobalSchedulerStart(() => setRunning(true));
    useOnGlobalSchedulerStop(() => setRunning(false));
    
    // Setup urBang handle
    const triggerUrBang = useBangOutputHandle("urbang-out");
    useOnGlobalSchedulerStart(() => globalScheduler.now().add(s(0.1)).schedule(triggerUrBang));

    // Return start / stop button depending on global scheduler state
    return isRunning ? 
            <Button onClick={() => globalScheduler.stop()}>🟦</Button> :
            <Button onClick={() => globalScheduler.start()}>💥</Button>;
}
