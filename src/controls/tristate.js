import InputSelect from './select.js';

/**
 * 
 */
class InputTriState extends InputSelect {
  /**
   * 
   */
  constructor() {
    super();

    this._nstate = 3;
  }

  /**
   * 
   */
  get value() {
    let val = { ... super.value };

    for (let i in val)
      if (val[i] > 1) val[i] = -1;

    return val;
  }

  set value(value) {
    let val = { ... value };
    for (let i in value)
      if (val[i] < 0) val[i] = 2;

    return super.value = val;
  }
}

customElements.define("input-tristate", InputTriState);

export default InputTriState;