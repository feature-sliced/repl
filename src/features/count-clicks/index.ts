import { createStore, createEvent } from "effector";

export const up = createEvent();
export const $count = createStore(0).on(up, (s) => s + 1);
