import Base from './base.js';

/**
 * 
 */
class InputSelect extends Base {
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
  connectedCallback() {
    setTimeout(() => {
      this._updateItems();
      this.initEvents();
      this.resizeItems();
      //this.fitSize();
    });
  }

  /**
   * 
   */
  disconnectedCallback() {
  }

  /**
   * 
   */
  static get observedAttributes() {
    return ['nstate'];
  }

  /**
   * called when one of attributes listed above is modified
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name == 'nstate') this.nstate = newValue;
      else if (name == 'value') {
        //this.value = newValue;
      }
    }
  }

  /**
   * 
   */
  initEvents() {
    /*const items = */this.querySelectorAll('input-item').forEach((item) => {
      item.addEventListener('click', () => {
        if (this._enabled)
          this._itemClick(item);
      });
    });
    
    /*for (let i = 0; i < items.length; i++) {
      const item = items[i];
      item.addEventListener('click', () => {
        if (this._enabled)
          this._itemClick(item);
      });
    };*/
  }

  /**
   * 
   */
  _itemClick(item) {
    
  }

  /**
   * 
   */
  _updateItems() {
    //console.log('UPDATEITEMS', this);
    /*const inputItems = */this.querySelectorAll('input-item').forEach((inputItem) => {
      inputItem.nstate = this._nstate;
    });
    //for (let i = 0; i < inputItems.length; i++)
    //  inputItems[i].nstate = this._nstate;
  }

  /**
   * 
   */
  resizeItems() {
    /*const items = this.querySelectorAll('input-item');
    let maxWidth = 0;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.clientWidth > maxWidth) maxWidth = item.clientWidth;
    }

    maxWidth += 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      item.style.width = maxWidth +'px';
    }*/
  }

  /**
   * Hapus semua state. 
   */
  stateClear() {
    return this.stateFill(0);
  }

  /**
   * Menset state untuk value tertentu.
   */
  stateSet(value, state) {
    /*const items = */this.querySelectorAll(`input-item [value=${value}]`).forEach((item) => {
      item.state = state;
    });
    //for (let i = 0; i < items.length; i++)
    //  items[i].state = state;

    return this;
  }

  /**
   * Menset semua state.
   */
  stateFill(state) {
    const items = this.querySelectorAll('input-item');
    for (let i = 0; i < items.length; i++) 
      items[i].state = state;

    return this;
  }

  /**
   * Mengubah state dari before ke after.
   */
  stateChange(before, after) {
    const items = this.querySelectorAll('input-item');
    for (let i = 0; i < items.length; i++)
      if (items[i].state == before)
        items[i].state = after;

    return this;
  }

  /**
   * 
   */
  /*fitSize() {
    let maxWidth = 0;

    const items = this.querySelectorAll('input-item');
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const rect = item.getBoundingClientRect();
      console.log(item, rect);
      if (item.width > maxWidth) maxWidth = item.width;
    }
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      item.style.width = maxWidth +'px';      
    }

    return this;
  }*/

  /**
   * 
   */
  get options() {
    
  }

  /**
   * 
   */
  get nstate() {
    return this._nstate;
  }

  set nstate(value) {
    this._nstate = value;
    this._updateItems();

    return this._nstate;
  }

  /**
   * 
   */
  get value() {
    const value = { };
    this.querySelectorAll('input-item').forEach((item) => {
      value[item.value] = parseInt(item.state);
    });

    /*for (let i = 0; i < items.length; i++) {
      const item = items[i];

    }*/

    return value;
  }

  set value(value) {
    this.querySelectorAll('input-item').forEach((item) => {
      if (typeof value === 'object')
        item.state = value[item.value];
      else if (item.value == value)
        item.state = this._nstate - 1;
      else item.state = 0;
    });

    /*for (let i = 0; i < items.length; i++) {
      const item = items[i];

    }*/
  }

  /**
   * 
   */
  get enabled() { return super.enabled; }
  set enabled(value) {
    this._enabled = value;
    /*const items = */this.querySelectorAll('input-item').forEach((item) => {
      item.enabled = this._enabled;
    });

    //for (let i = 0; i < items.length; i++)
    //  items[i].enabled = this._enabled;

    return this._enabled;
  }
}

/**
 * 
 */
class InputItem extends Base {
  /**
   * 
   */
  constructor() {
    super();

    this._nstate = 2;
    this._state = 0;
  }

  /**
   * 
   */
  connectedCallback() {
    if (! this._initialized) {
      if (this.hasAttribute('state')) 
        this._state = parseInt(this.getAttribute('state'));
      else this.setAttribute('state', this._state);

      this.initEvents();

      this._initialized = true;
    }
  }

  /**
   * 
   */
  disconnectedCallback() {
  }

  /**
   * 
   */
  static get observedAttributes() {
    return ['nstate', 'state'];
  }

  /**
   * called when one of attributes listed above is modified
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name == 'nstate') this._nstate = newValue;
      if (name == 'state') this.state = newValue;
    }
  }

  /**
   * 
   */
  initEvents() {
    this.addEventListener('click', this._click);
  }

  /**
   * 
   */
  _click() {
    if (this.enabled)
      this.nextState();
  }

  /**
   * 
   */
  nextState() {
    this._state ++;
    if (this._state >= this._nstate) this._state = 0;

    this.setAttribute('state', this._state);
  }

  /**
   * 
   */
  get nstate() {
    return this._nstate;
  }
  set nstate(value) {
    return this._nstate = value;
  }

  /**
   * 
   */
  get state() {
    return this._state;
  }
  set state(value) {
    if (! value) value = 0;
    if (Number.isNaN(value)) value = 0;
    
    if (value > this._nstate) value = this._nstate - 1;
    else if (value < 0) value = 0;

    this._state = value;
    this.setAttribute('state', this._state);

    return this._state;
  }

  get value() {
    return this.getAttribute('value');
  }
  set value(value) {
    this.setAttribute('value', value);
  }
}

customElements.define("input-item", InputItem);
customElements.define("input-select", InputSelect);

export default InputSelect;