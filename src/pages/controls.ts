import { createEvent, sample, Event, Store, Effect } from "effector";
import type { History } from "history";
import { matchPath, RouteProps } from "react-router";

import {
  createHistoryClocks,
  wrapHistory,
} from "shared/lib/effector-history-wrap";

export const attachHistory = createEvent<History>();
export const clocks = createHistoryClocks();

const historyUpdated = wrapHistory({
  clocks,
  historySource: attachHistory,
});

export const createPathMatcher = <Match = unknown>(config: {
  path: string | string[] | RouteProps;
  clock?: Event<any> | Store<any> | Effect<any, any>;
}) => {
  return sample({
    source: historyUpdated,
    clock: config.clock ?? historyUpdated,
    fn: (update) => {
      const { location } = update;

      return location ? matchPath<Match>(location.pathname, config.path) : null;
    },
  }).filterMap((match) => (match ? match : undefined));
};
