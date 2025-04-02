
import { toast } from "sonner";

export { toast };
export const useToast = () => {
  return {
    toast,
    // For compatibility with any code expecting the shadcn/ui toast API
    toasts: [],
    dismiss: () => {},
  };
};
