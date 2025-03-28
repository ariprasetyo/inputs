import InputSelect from './select.js';

/**
 * 
 */
class InputRadio extends InputSelect {
  /**
   * 
   */
  _itemClick(item) {
    this.stateClear();

    item.state = this.nstate - 1;
  }

  /**
   * 
   */
  get value() {
    let value = null;
    /*const items = */this.querySelectorAll('input-item').forEach((item) => {
      if (item.state > 0) value = item.value;
    });

    console.log('VAL', value);

    return value;

    /*for (let i = 0; i < items.length; i++) {
      if (items[i].state > 0) return items[i].value;
    }*/
  }

  set value(value) {
    /*const items = */this.querySelectorAll('input-item').forEach((item) => {
      if (item.value == value)
        item.state = this.nstate - 1;
      else
        item.state = 0;
    });

    /*for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.value == value)
        item.state = this.nstate - 1;
      else
        item.state = 0;
    }*/
  }
}

customElements.define("input-radio", InputRadio);

export default InputRadio;