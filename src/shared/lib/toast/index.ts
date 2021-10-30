import React from "react";
import { useToasts, Toast } from "@geist-ui/react";
import { createEvent, createStore, attach, Unit, sample } from "effector";
import { useEvent } from "effector-react";

type Toaster = ReturnType<typeof useToasts>[1];

const handlerSet = createEvent<Toaster>();
const $handler = createStore<Toaster>(() => {
  console.error("setToast is not provided");
}).on(handlerSet, (_, h) => h);

export const ToastsProvider = React.memo(() => {
  const setHandler = useEvent(handlerSet);
  const handler = useToasts()[1];

  React.useLayoutEffect(() => {
    setHandler(handler);
  }, []);

  return null;
});

export const showToastFx = attach({
  source: $handler,
  effect: (toaster, toast) => toaster(toast),
});

export const message = <T>(config: {
  source: Unit<T>;
  fn: (v: T) => Toast;
}) => {
  sample({
    source: config.source,
    fn: config.fn,
    target: showToastFx,
  });
};
