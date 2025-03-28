import Base from './base';
import Short from './short';
import Long from './long';

import Select from './select';
import Radio from './radio';
import Checkbox from './checkbox';
import TriState from './tristate';

import Sort from './sort';
//import Group from './group';

import IMath from './math';
//import Table from './table';
//import Horner from './special/horner';

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
};