import { EventEmitter } from 'eventemitter3';
export const appEvents = new EventEmitter();
export const EVENTS = {
  NUDGE_RECORDED: 'nudge_recorded',
};