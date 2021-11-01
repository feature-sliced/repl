import React, { createContext, useContext, useState } from "react";
import type { DragMoveEvent } from "@dnd-kit/core";

const MovementsContext = createContext<ReturnType<typeof useState> | null>(
  null
);
