import { message } from "shared/lib/toast";
import { appMounted } from "shared/config/system-events";

export const initOnboardingFlow = () => {
  message({
    source: appMounted,
    fn: () => ({
      text: "Welcome to Feature-Sliced REPL!",
      type: "success",
    }),
  });
};
