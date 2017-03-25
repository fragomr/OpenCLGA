import { OPENCLGA_STATES, STATE_HANDLERS } from '../shared/constants';
import { createSimpleAction } from '../shared/utils';
import { ACTION_KEYS } from '../shared/control';
import socket from './socket';

const setState = createSimpleAction(ACTION_KEYS.setState);

export const prepare = () => (dispatch, getState) => {
  dispatch(setState(OPENCLGA_STATES.PREPARING));
  setTimeout(() => {
    dispatch(setState(OPENCLGA_STATES.PREPARED));
  }, 2000);
};

export const run = () => (dispatch, getState) => {
  socket.sendCommand('run', {
    'prob_mutation': 0.1,
    'prob_crossover': 0.8
  });
  // The following line should be removed. The state changing should be made by
  // socket... We use this line to easy testing.
  setTimeout(() => {
    dispatch(setState(OPENCLGA_STATES.RUNNING));
  }, 2000);
};

export const pause = () => (dispatch, getState) => {
  socket.sendCommand('pause');
  // The following line should be removed. The state changing should be made by
  // socket... We use this line to easy testing.
  setTimeout(() => {
    dispatch(setState(OPENCLGA_STATES.PAUSED));
  }, 2000);
};

export const stop = () => (dispatch, getState) => {
  socket.sendCommand('stop');
  // The following line should be removed. The state changing should be made by
  // socket... We use this line to easy testing.
  setTimeout(() => {
    dispatch(setState(OPENCLGA_STATES.STOPPED));
  }, 2000);
};

// This is not a traditional action creator. It calculates the state and generates the
// action if needed. If no needs, it returns null.
export const calcStateChange = (currentState, clientsStates) => {
  const nextState = STATE_HANDLERS[currentState](clientsStates);
  return (nextState !== currentState) ? setState(nextState) : null;
}
