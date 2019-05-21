import { BEGIN_LOAD, END_LOAD } from '../constants/actionTypes';

const doBeginLoad = () => ({
  type: BEGIN_LOAD,
});

const doEndLoad = () => ({
  type: END_LOAD,
});

export {
  doBeginLoad,
  doEndLoad,
}