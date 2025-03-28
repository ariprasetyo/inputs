/**
 * 
 */
export default class InputBase extends HTMLElement {
  /**
   * 
   */
  constructor() {
    super();

    this._enabled = true;
    this._value = null;
  }

  /**
   * 
   */
  /*ready() {

  }*/

  /**
   * 
   */
  readAttributes() {    
  }

  /**
   * 
   */
  initEvents() {

  }

  /**
   * 
   */
  disable() {
    this.enabled = false;
  }

  /**
   * 
   */
  enable() {
    this.enabled = true;
  }

  /**
   * 
   */
  get enabled() {
    return this._enabled;
  }

  /**
   * 
   */
  set enabled(value) {
    return this._enabled = value;
  }

  /**
   * 
   */
  get value() {
    return this._value;
  }

  /**
   * 
   */
  set value(value) {
    return this._value = value;
  }
}