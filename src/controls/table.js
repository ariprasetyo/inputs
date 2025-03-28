import InputBase from './base.js';
//import Handsontable from 'handsontable';

/**
 * Untuk menginput data berbentuk tabel.
 * 
 * @attribute value
 *   - Isi sel
 * @attribute header
 *   - Header
 * @attribute options
 *   - Opsi tambahan (JSON)
 *     - fixed-rows: Indeks baris yang tidak boleh diedit
 *     - fixed-cols: Indeks kolom yang tidak boleh diedit
 *     - fixed-cells: Sel-sel yang tidak boleh diedit
 *     - regex-rows:
 *     - regex-cols:
 *     - regex-cells: Regex untuk sel
 * @attribute size
 *   - Format: baris x kolom, banyak baris x kolom
 * @attribute r
 *   - Banyak baris
 * @attribute c
 *   - Banyak kolom
 * @attribute input
 *   - Jenis input (short|math)
 * @attribute auto-add
 *   - Otomatis menambah sel ketika kursor melampaui tabel
 *     - r: Otomatis menambah row
 *     - c: Otomatis menambah column
 *     - rc: Otomatis menambah row & column
 * @attribute allow-add
 *   - Dapat menambah sel [r - baris, c - kolom, rc - baris & kolom]
 */
class InputTable extends InputBase {
  /**
   * 
   */
  constructor() {
    super();

    this._nRows = 0;
    this._nCols = 0;
    this._input = 'short';

    this.innerHTML = this.$content;

    this.readAttributes();
    //this.initCells();
  }

  /**
   * 
   */
  connectedCallback() {
    this.value = this.getAttribute('value');
  }

  /**
   * 
   */
  static get observedAttributes() {
    return [
      'value', 
      'header', 'options', 
      'r', 'c', 'size',
      'regex', 'match', 
      'allow-add', 'allow-insert', 'allow-remove',
      'auto-add', 'auto-remove',
    ];
  }

  /**
   * called when one of attributes listed above is modified
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name == 'r' || name == 'c' || name == 'size') this.readSize();
      else if (name == 'value') this.value = newValue;
    }
  }

  /**
   * 
   */
  readAttributes() {
    this.readSize();

    if (this.hasAttribute('value'))
      this.value = this.getAttribute('value');

    this._input = this.hasAttribute('input')? this.getAttribute('input'): 'short';
  }

  /**
   * Membaca atribut ukuran (size, r, c)
   */
  readSize() {
    let R, C;
    let size = this.getAttribute('size');
    if (size) {
      size = size.split('x');

      if (size[0]) {
        R = parseInt(size[0]);
        C = parseInt(size[1]);
        if (! C) C = R;
      }
    }
    else {
      R = parseInt(this.getAttribute('r'));
      C = parseInt(this.getAttribute('c'));  
    }

    this._nRows = R? R: 2;
    this._nCols = C? C: 2;
  }

  /**
   * 
   */
  initEvents() {

  }

  /**
   * 
   */
  initCellEvents() {
    this.querySelectorAll('td').forEach((td) => {
      if (! td.hasAttribute('cellinited'))
        this.initCellEvent(td);
    });
  }

  /**
   * 
   */
  initCellEvent(td) {
    let input = td.querySelector('input-short');
    td.setAttribute('cellinited', 1);
  }

  /**
   * 
   */
  initNavigation() {

  }

  /**
   * 
   */
  initCells() {
    //console.log('INIT-CELLS');
    const cells = this.constructor.createEmptyCells(this._nRows, this._nCols);
    this.cellsBuild(cells);
    //this._table = new Handsontable({
    //  data: cells,
    //});
  }

  /**
   * 
   */
  navigateCell() {

  }

  /**
   * 
   */
  rowAdd(section) {

  }

  /**
   * 
   */
  rowInsert(r, section) {
    if (! section) section = 'body';

    const sect = this.querySelector(`t${section}`);
    const tr = sect.querySelector(`:nth-child(${r})`);

    let newTR = '<tr>';
    for (let c = 0; c < this._nCols; c++) {
      newTR += '<td></td>';
    }
    newTR += '</tr>';

    sect.insertBefore(newTR, tr);

    this._nCols ++;

    return newTR;
  }

  /**
   * 
   */
  columnInsert(c) {

  }

  /**
   * 
   */
  _isDataInJSON(data) {
    return (typeof cells == 'string') && (cells.charAt(0) == '[');
  }

  /**
   * 
   */
  _isDataInCSV(data) {
    return ! this._isDataInJSON(cells);
  }

  /**
   * 
   */
  parseData(cells) {
    let parsed = null;

    // Parse JSON
    const isJSON = this._isDataInJSON(cells);
    if (isJSON) {
      try {
        parsed = JSON.parse(cells);
      }
      catch(e) {
        parsed = null;
      }
      
      if (parsed) this._cells = parsed;
      else isJSON = false;
    }

    // Parse CSV
    // Betul, ini memang dipisah (tidak pakai else)
    if (typeof cells == 'string' && ! isJSON) {
      parsed = cells.split(';');
      for (let r = 0; r < parsed.length; r++) {
        parsed[r] = parsed[r].split(',');
      }
    }
    else parsed = this.constructor.createEmptyTableData(this._nRows, this._nCols);

    this.constructor.equalizeDataColumns(parsed);
    
    return parsed;
  }

  /**
   * 
   */
  cellsBuild(cells) {
    let out = '';
    for (let r in cells) {
      out += '<tr>';
      for (let c in cells[r]) {
        out += this.cellTemplate(cells[r][c], r, c);
      }
      out += '</tr>';
    }

    this.querySelector('tbody').innerHTML = out;
  }

  /**
   * 
   */
  static createEmptyTableData(nrows, ncols) {
    const data = [];
    for (let r = 0; r < nrows; r++) {
      const row = [];
      for (let c = 0; c < ncols; c++) {
        row.push('');
      }
      data.push(row);
    }

    return data;
  }

  /**
   * Menyamakan semua kolom
   */
  static equalizeDataColumns(data) {
    const maxCols = this.getMaxColumn(data);

    for (let i in data) {
      const row = data[i];

      if (row.length < maxCols)
        for (let j = row.length; j < maxCols; j++)
          row.push('');
    }

    return data;
  }

  /**
   * Hitung kolom terbanyak.
   */
  static getMaxColumn(data) {
    let maxCols = 0;
    for (let i in data) {
      const row = data[i];
      if (Array.isArray(row) && row.length > maxCols) maxCols = row.length;
    }

    return maxCols;
  }

  /**
   * 
   */
  cellTemplate(value, r, c) {
    let input = '';
    if (this._input == 'short')
      input = `<input-short value="${value}"></input-short>`;
    else if (this._input == 'math')
      input = `<input-math value="${value}"></input-math>`;

    return `<td>${input}</td>`;
  }

  /**
   * 
   */
  get $content() {
    if (! this.constructor._$content)
      this.constructor._$content = '<table><thead></thead><tbody></tbody><tfoot></tfoot></table>';

    return this.constructor._$content;
  }

  /**
   * 
   */
  get value() {
    let prevTR = null;
    const value = [];
    let row = [];
    this.querySelectorAll('td').forEach((td) => {
      const tr = td.parentNode;

      if (tr !== prevTR) {  // Ganti baris
        if (prevTR) value.push(row);

        row = [];
      }

      prevTR = tr;
    });

    return value;
  }
  set value(data) {
    console.log('SETVALUE', data, this);
    const parsed = this.parseData(data);

    this.cellsBuild(parsed);
  }

  /**
   * 
   */
  get nRows() { return this._nRows; }
  get nCols() { return this._nCols; }
}

customElements.define("input-table", InputTable);

export default InputTable;