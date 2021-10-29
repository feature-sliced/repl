import { createEvent, createStore } from "effector";

export const $fileStructures = createStore({});

export const addStructure = createEvent();
export const deleteStructure = createEvent();
