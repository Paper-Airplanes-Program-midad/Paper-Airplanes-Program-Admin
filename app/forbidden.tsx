import { ErrorView } from "./error-view";

export default function Forbidden() {
  return <ErrorView code={403} />;
}
