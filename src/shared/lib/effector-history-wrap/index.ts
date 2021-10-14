import type { Action, History, Location, LocationState, Path } from "history";
import type { Domain, Event, Store } from "effector";
import { createEvent, sample, scopeBind } from "effector";

export type ToParams<S extends LocationState = LocationState> = {
  to: Path;
  LocationState?: S;
};
export type HistoryUpdate = { action: Action; location: Location };
export type Clocks<S extends LocationState> = {
  push: Event<ToParams<S>>;
  replace: Event<ToParams<S>>;
  go: Event<number>;
  back: Event<unknown>;
  forward: Event<unknown>;
};

type Config<S extends LocationState = LocationState> = {
  historySource: Event<History<S>> | Store<History<S>>;
  clocks: Clocks<S>;
  target?: Event<HistoryUpdate>;
};

const checkHistory = <S extends LocationState>(
  history?: History<S> | null
): history is History<S> => {
  const historyProvided = Boolean(history);

  if (!historyProvided) {
    console.warn("No history was provided");
    return false;
  }

  return historyProvided;
};

export const createHistoryClocks = (domain?: Domain) => {
  if (domain) {
    return {
      push: domain.createEvent<ToParams>(),
      replace: domain.createEvent<ToParams>(),
      go: domain.createEvent<number>(),
      back: domain.createEvent<unknown>(),
      forward: domain.createEvent<unknown>(),
    };
  }

  return {
    push: createEvent<ToParams>(),
    replace: createEvent<ToParams>(),
    go: createEvent<number>(),
    back: createEvent<unknown>(),
    forward: createEvent<unknown>(),
  };
};

export const wrapHistory = <S extends LocationState = LocationState>(
  config: Config<S>
) => {
  const {
    historySource,
    clocks,
    target = createEvent<HistoryUpdate>(),
  } = config;

  historySource.watch((history) => {
    // Hacky way to support both in and out of scope listeners
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let listener = (_: any) => console.warn("History listener is not set");

    try {
      listener = scopeBind(target);
    } catch (e) {
      listener = target;
    }

    if (!checkHistory<S>(history)) return;

    listener({ location: history.location, action: history.action });
    history.listen(() => {
      listener({ location: history.location, action: history.action });
    });
  });

  // push
  const historyPushed = sample({
    source: historySource,
    clock: clocks.push,
    fn: (history, params) => ({ history, params }),
  });

  historyPushed.watch(
    ({ history, params }) =>
      checkHistory(history) && history.push(params.to, params.LocationState)
  );

  // replace
  const historyReplaced = sample({
    source: historySource,
    clock: clocks.replace,
    fn: (history, params) => ({ history, params }),
  });

  historyReplaced.watch(
    ({ history, params }) =>
      checkHistory(history) && history.replace(params.to, params.LocationState)
  );

  // go
  const historyGo = sample({
    source: historySource,
    clock: clocks.go,
    fn: (history, params) => ({ history, params }),
  });

  historyGo.watch(
    ({ history, params }) => checkHistory(history) && history.go(params)
  );

  // back
  const historyBack = sample({
    source: historySource,
    clock: clocks.back,
    fn: (history) => history,
  });

  historyBack.watch((history) => checkHistory(history) && history.goBack());

  // forward
  const historyForward = sample({
    source: historySource,
    clock: clocks.forward,
    fn: (history) => history,
  });

  historyForward.watch(
    (history) => checkHistory(history) && history.goForward()
  );

  return target;
};
