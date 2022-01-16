export const workButtonText = "Start work session";
export const stopButtonText = "Stop work session";
export const restButtonText = "Take a timeout";

export const workButtonId = "work_button";
export const restButtonId = "rest_button";
export const stopButtonId = "stop_button";

export const startText = `
  Press <code>${workButtonText}</code> to start new work session
<code>${restButtonText}</code> to 10 minut timeout (in progress)
<code>${stopButtonText}</code> to stop current work session
`;

export const workText = "Start working";
export const alreadyWoringText = (date: string) => {
  return `
    U already working
Since: ${date}
U can end session with <code>${stopButtonText}</code> button
  `;
};

export const restText = `
  In progress...
But ofcourse U can rest
`;
export const restNotWorkingText = "U not working currently";

export const stopText = (workDuration: string) => {
  return `
    Stop working
Work duration: ${workDuration}
  `;
};
export const stopNotWorkingText = "U not working now";
