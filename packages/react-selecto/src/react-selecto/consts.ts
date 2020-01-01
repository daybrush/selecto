import { EVENTS } from "selecto";
import { camelize } from "@daybrush/utils";

export const REACT_EVENTS =  EVENTS.map(name => camelize(`on ${name}`));
