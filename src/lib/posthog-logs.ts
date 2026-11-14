import posthog, { type LogAttributes } from "posthog-js";

export function posthogLogInfo(message: string, attributes: LogAttributes) {
  posthog.logger.info(message, attributes);
}
