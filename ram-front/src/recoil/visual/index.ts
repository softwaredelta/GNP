import { alert } from "./atoms";
import { selectAlert } from "./selectors";

export interface IAlert {
  isOpen?: boolean;
  type: "success" | "error" | "warning" | "info";
  message: string;
  description: string;
}

export { selectAlert };

export default alert;
