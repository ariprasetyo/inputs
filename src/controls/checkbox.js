import InputSelect from './select.js';

/**
 * 
 */
class InputCheckbox extends InputSelect {
  /**
   * 
   */
  constructor() {
    super();

    this._nstate = 2;
  }

  /**
   * 
   */
  get value() {
    let val = { ... super.value };

    for (let i in val)
      if (val[i] < 1) val[i] = -1;

    return val;
  }

  set value(value) {
    let val = { ... value };
    for (let i in value) 
      if (val[i] < 0) val[i] = 0;

    return super.value = value;
  }
}

customElements.define("input-checkbox", InputCheckbox);

export default InputCheckbox;