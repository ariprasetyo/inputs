import InputBase from './base';
import CommonParser from '@app/parser/common';

/**
 * 
 * @attribute value
 * @attribute options
 * @attribute preset
 * @attribute regex
 * @attribute match
 * @attribute placeholder
 * @attribute label (reserved)
 */
class InputShort extends InputBase {
  /**
   * 
   */
  constructor() {
    super();

    this._regexPreset = null;
    this._regex = null;
    this._match = null;

    this.readAttributes();
    //this.initInputElement();
  }

  /**
   * 
   */
  connectedCallback() {
    if (! this._initialized)
      setTimeout(() => {
        this.initInputElement();
        this.ready();
        this._initialized = true;  
      });
  }

  /**
   * 
   */
  static get observedAttributes() {
    return [
      'value', 
      'options', 
      'regex', 'match', 'preset',
      'chars',  // Hanya boleh karakter dari sini
      'parser',
      'label', 'placeholder',
      'size',
    ];
  }

  /**
   * called when one of attributes listed above is modified
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name == 'value' && this.inputElement) this.inputElement.value = newValue;
      else if (name == 'options') this.options = newValue;
      else if (name == 'preset') this.preset = newValue;
      else if (name == 'regex') this.regex = newValue;
      else if (name == 'match') this.regexMatch = newValue;
      else if (name == 'placeholder') this.placeholder = newValue;
      else if (name == 'parser') this.parser = newValue;
      else if (name == 'size') this.inputElement.size = newValue;
      //else if (name == 'chars') this.chars
    }
  }

  /**
   * 
   */
  readAttributes() {
    this.parser = this.getAttribute('parser');
    this._value = this.getAttribute('value');
    this.options = this.getAttribute('options');
    this._regexMatch = this.getAttribute('match');
    this.regex = this.getAttribute('regex');
    this.placeholder = this.getAttribute('placeholder');
    //this._label = this.getAttribute('label');
  }

  /**
   * 
   */
  initEvents() {
    this.inputElement.addEventListener('input', (e) => {
      // Ini agar auto-width: https://css-tricks.com/auto-growing-inputs-textareas/
      this.dataset.value = this.value;

      //console.log('VALIDATE', this._regex, this.inputElement.value);
      if (this.validate()) this.inputElement.classList.remove('invalid');
      else this.inputElement.classList.add('invalid');
    });
  }

  /**
   * 
   */
  initInputElement() {
    this.innerHTML = '<input type="text" />';

    this.inputElement.size = 4;
  }

  /**
   * 
   */
  ready() {
    if (this.inputElement) {
      this.initEvents();
    }
  }

  /**
   * 
   */
  validate() {
    if (this._parser && this._parser.parse) {
      let parsed = this._parser.parse(this.value);

      return parsed !== false;
    }

    if (! this._regex) return true;

    return this._regex.test(this.value);
  }

  /**
   * 
   */
  help() {

  }

  /**
   * 
   */
  get $help() {
    return '';
  }

  /**
   * 
   */
  static parserAdd(name, parser, formatter) {
    if (! this._parsers) this._parsers = { };
    if (this._parsers[name]) throw `Parser ${name} exists.`;

    if (typeof parser == 'string') {
      this._parsers[name] = {
        parser: new RegExp(parser),
        formatter: formatter,
      }
    }
    else {
      this._parsers[name] = {
        parser: parser,
        formatter: formatter,
      }
    }

    return this._parsers;
  }

  /**
   * 
   */
  static parserRemove(name) {
    if (! this._parsers) this._parsers = { };
    if (this._parsers[name]) delete this._parsers[name];
    else throw `Parser ${name} does not exist.`;
  }

  /**
   * 
   */
  static parserGet(name) {
    if (! this._parsers) this._parsers = { };

    return this._parsers[name];
  }

  /**
   * 
   */
  get inputElement() {
    return this.querySelector('input');
  }

  /**
   * 
   */
  get options() {
    return this._options;
  }

  /**
   * 
   */
  set options(opts) {
    let parsedOpts = null;
    try {
      parsedOpts = JSON.parse(opts);
    }
    catch(e) {
      console.error('Attribute options is invalid JSON.');
      parsedOpts = null;
    }

    if (parsedOpts) this._options = parsedOpts;
    else this._options = {};

    return this._options;
  }

  /**
   * 
   */
  get parser() {
    return this._parser;
  }
  set parser(parser) {
    if (typeof parser == 'string') {
      this._parser = this.constructor._parsers[parser];
    }
    else if (typeof parser == 'object') {
      this._parser = { parser: parser };
    }
    else
      this._parser = null;

    return this._parser;
  }

  /**
   * 
   */
  get regex() {
    return this._regex;
  }

  /**
   * 
   */
  set regex(reDef) {
    if (typeof reDef == 'object' && reDef instanceof RegExp) {
      return this._regex = reDef;
    }

    if (! reDef || (typeof reDef !== 'string') || (typeof reDef == 'string' && ! reDef.trim())) {
      return this._regex = null;
    }

    // TODO: Negation
    let matchStart = false;
    let matchEnd = false;
    if (this._regexMatch == 'start') matchStart = true;
    else if (this._regexMatch == 'end') matchEnd = true;
    else if (this._regexMatch == 'whole') matchStart = matchEnd = true;
    
    if (matchStart && reDef.charAt(0) !== '^') reDef = '^'+ reDef;
    if (matchEnd && reDef.charAt(reDef.length - 1) !== '$') reDef = reDef + '$';

    let RE = null;
    try {
      RE = new RegExp(reDef);
    }
    catch(e) {
      console.error(e);
      RE = null;
    }

    this._regex = RE;
    return this._regex;
  }

  /**
   * 
   */
  get regexMatch() { return this._regexMatch; }
  set regexMatch(value) {
    if (typeof value !== 'string') value = '';
    value = value.toLowerCase();

    if (value == 'whole' || value == 'start' || value == 'end');
    else value = 'contains';
    this._regexMatch = value;

    // Bangun ulang regex-nya
    this.regex = this.getAttribute('regex');

    return this._regexMatch;
  }

  /**
   * 
   */
  get placeholder() {
    if (this.inputElement)
      return this.inputElement.placeholder;

    return '';
  }
  set placeholder(value) {
    if (this.inputElement)
      return this.inputElement.placeholder = value;

    return '';
  }

  /**
   * 
   */
  get value() {
    return this.inputElement.value;
  }

  /**
   * 
   */
  set value(value) {
    if (typeof value === 'undefined') value = '';
    else if (typeof value === 'object') value = '';

    this.inputElement.value = value;
  }

  /**
   * 
   */
  get enabled() { return super.enabled; }
  set enabled(value) {
    super.enabled = value;

    const answerEls = this.querySelectorAll('input,textarea');
    for (let i = 0; i < answerEls.length; i++)
      answerEls[i].disabled = ! this.enabled;

    return this.enabled;
  }

}

// Define Presets
InputShort._parsers = {
  number: {
    parse: CommonParser.parser.number,
    format: CommonParser.formatter.number,
    chars: /[0-9.,\s\(\)]/,
  },
  interval: {
    parse: CommonParser.parser.interval,
    format: CommonParser.formatter.interval,
    chars: /[0-9a-zU.,\s\(\)\[\]]/,
  },
};

customElements.define("input-short", InputShort);

export default InputShort;