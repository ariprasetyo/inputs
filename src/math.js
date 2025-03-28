import InputShort from './short';
import 'mathlive';

/**
 * 
 */
class InputMath extends InputShort {
  /**
   * 
   */
  constructor() {
    super();
  }

  /**
   * 
   */
  ready() {
    if (this.inputElement)
      this.inputElement.setOptions(this._options);

    super.ready();
  }

  /**
   * 
   */
  initInputElement() {
    this.innerHTML = '<math-field></math-field>';
  }

  /**
   * 
   */
  get inputElement() {
    return this.querySelector('math-field');
  }

  /**
   * 
   */
  set options(opts) {
    super.options = opts;

    if (this.inputElement)
      this.inputElement.setOptions(this._options);

    return this._options;
  }
}

customElements.define("input-math", InputMath);

export default InputMath;