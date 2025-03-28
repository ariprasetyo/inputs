import InputShort from './short.js';

/**
 * 
 */
 class InputLong extends InputShort {
  /**
   * 
   */
  constructor() {
    super();
  }

  /**
   * 
   */
  initInputElement() {
    this.innerHTML = '<textarea></textarea>';
  }

  /**
   * 
   */
  get inputElement() {
    return this.querySelector('textarea');
  }


}

customElements.define("input-long", InputLong);

export default InputLong;