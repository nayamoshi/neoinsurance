// Mock feedback hook
export const useFeedback = () => ({
  triggerFeedbackEvent: (event: string) => {
    console.log(`Feedback event triggered: ${event}`);
  },
});
