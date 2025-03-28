import check from 'check-types';
import inputs from './inputs.js';

class InputBox extends HTMLElement {
  /**
   * 
   */
  constructor() {
    super();

    this._value = null;
    this._single = false;
    this._enabled = true;
  }

  /**
   * 
   */
  connectedCallback() {

  }

  /**
   * 
   */
  _getElementValue(el) {
    const tag = el.tagName;
    const type = el.getAttribute('type');
    const editable = el.getAttribute('contenteditable');

    let value = null;
    
    // Read
    if (tag == 'TEXTAREA')
      value = el.value;
    else if (tag == 'INPUT') {
      if (type == 'checkbox' || type == 'radio') {
        value = el.checked;
      }
      else
        value = el.value;
    }
    else if (tag == 'SELECT') {
      value = el.value;
    }
    else if (el instanceof inputs.base)
      value = el.value;
    else if (editable) {
      value = el.innerText;
    }
    else
      value = el.getAttribute('value');

    return value;
  }

  /**
   * 
   */
  _setElementValue(el, value) {
    const tag = el.tagName;
    const type = el.getAttribute('type');
    const editable = el.getAttribute('contenteditable');
    const parse = el.getAttribute('parse');

    if (tag == 'TEXTAREA')
      el.value = value;
    else if (tag == 'INPUT') {
      if (type == 'checkbox' || type == 'radio') {
        el.checked = value;
      }
      else
        el.value = value;
    }
    else if (tag == 'SELECT') {
      el.value = value;
    }
    else if (el instanceof inputs.base)
      el.value = value;
    else if (editable) {
      el.innerText = value;   // !WASPADALAH
    }
    else
      el.setAttribute('value', value);

    if (typeof parse === 'string') {
      const parsers = parse.split(/\s+/);
    }

    if (check.assigned(el.getAttribute('floatc'))) value = parseFloat(value.replace(/(\s|&nbsp;)+/g, ' ').replace(/,/g, '.').trim());
    else if (check.assigned(el.getAttribute('float'))) value = parseFloat(value.replace(/(\s|&nbsp;)+/g, ' ').trim());
    else if (check.assigned(el.getAttribute('int'))) value = parseInt(value.replace(/(\s|&nbsp;)+/g, ' ').trim());

    if (check.string(value)) {
      if (check.assigned(el.getAttribute('minspace'))) value = value.replace(/(\s|&nbsp;)+/g, ' ');
      if (check.assigned(el.getAttribute('nospace'))) value = value.replace(/(\s|&nbsp;)+/g, '');

      if (! check.assigned(el.getAttribute('notrim'))) value = value.trim();
    }

  }

  /**
   * 
   */
  read() {
    let _this = this;
    let values = {};

    this.querySelectorAll('[answerplace]').forEach((answerEl) => {
      const key = answerEl.getAttribute('key');
      const value = this._getElementValue(answerEl);

      values[key] = value;
    });

    this.extractCells(values);
    this.extractObjects(values);

    /*let filterAnswer = 
      this.question? 
        (this.question.script? 
          this.question.script.filterAnswer
          : null)
        :null;
    if (check.function(filterAnswer)) {
      answer = filterAnswer(answer);
    }*/
    console.log('GETVALUE', values);

    if (this._single) return this._value = values['default'];

    return this._value = values;
  }

  /**
   * 
   */
  write(values) {
    if (this._single) {
      const answerEl = this.querySelector(`[key=default]`);

      if (answerEl)
        this._setElementValue(answerEl, values);
      
      return;
    }

    if (typeof values == 'undefined') values = {};
    const linearizedValues = this.linearizeValues(values) ?? {};
    //console.log('INPUTBOXSET', values, linearizedValues);

    this.querySelectorAll('[answerplace]').forEach((answerEl) => {
      const key = answerEl.getAttribute('key');
      //console.log('SET', key, linearizedValues[key]);
      if (typeof values[key] !== 'undefined') {
        this._setElementValue(answerEl, values[key]);
      }
      else if (typeof linearizedValues[key] !== 'undefined') {
        this._setElementValue(answerEl, linearizedValues[key]);
      }
    });
  }

  /**
   * Khusus untuk key berformat cell_*_*, akan dimasukkan
   * sebagai array 2 dimensi (tabel). 
   * Untuk backward compatibility. Ini akan digantikan oleh
   * extractObjects.
   */
  extractCells(values) {
    let regex = /cell_(\w+)_(\w+)/;
    let table = [];

    for (let key in values) {
      let value = values[key];
      let m;
      
      if (m = key.match(regex)) {
        let r = m[1];
        let c = m[2];

        if (! table[r]) table[r] = [];
        table[r][c] = value;
      }

      //TODO: delete values[key];
    }

    if (table.length)
      values['cells'] = table;

    return values;
  }

  /**
   * 
   */
  extractObjects(values) {
    let objects = { };
    for (let key in values) {
      let path = key.split('.');
      let value = values[key];

      if (path.length > 0) {
        let sub = objects;
        for (let i = 0; i < path.length; i++) {
          let pname = path[i];

          if (i == (path.length - 1)) sub[pname] = value;
          else if (!(pname in sub)) sub[pname] = { };
          else if (! check.object(sub[pname]))
            sub[pname] = {
              '.': sub[pname]
            };

          sub = sub[pname];
        }

        delete values[key];
      }
    }

    for (let o in objects) values[o] = objects[o];

    return values;
  }

  /**
   * Menerjemahkan semua objek menjadi variabel.
   */
  linearizeValues(values) {
    let linearized = { };

    for (let name in values) {
      let value = values[name];

      if (check.object(value) || check.array(value)) {
        let subs = this.linearizeValues(value);

        for (let i in subs) {
          linearized[name +'.'+ i] = subs[i];
        }
      }
      else
        linearized[name] = value;
    }

    return linearized;
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
  disable() {
    this.enabled = false;
  }

  /**
   * 
   */
  get value() {
    this.read();

    return this._value;
  }
  set value(value) {
    this.write(value);
  }

  /**
   * 
   */
  get single() { return this._single; }
  set single(value) {
    return this._single = value;
  }

  /**
   * 
   */
  get enabled() { return this._enabled; }
  set enabled(value) {
    this._enabled = value;

    this.querySelectorAll('[answerplace]').forEach((answerEl) => {
      answerEl.enabled = value;
    });

    return this._enabled;
  }
}

customElements.define("input-box", InputBox);

export default InputBox;