import Base from './controls/base.js';
import Short from './controls/short.js';
import Long from './controls/long.js';

import Select from './controls/select.js';
import Radio from './controls/radio.js';
import Checkbox from './controls/checkbox.js';
import TriState from './controls/tristate.js';

import Sort from './controls/sort.js';
//import Group from './group';

import IMath from './controls/math.js';
//import Table from './table';
//import Horner from './special/horner';

import InputBox from './input-box.js';

export default {
  base: Base,
  short: Short,
  long: Long,

  select: Select,
  radio: Radio,
  checkbox: Checkbox,
  tristate: TriState,
  
  sort: Sort,

  math: IMath,
  //table: Table,
  //horner: Horner,

  inputBox: InputBox,
};