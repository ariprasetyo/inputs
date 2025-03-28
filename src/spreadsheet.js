import InputBase from './base';
//import Handsontable from 'handsontable';
//import 'handsontable/dist/handsontable.min.css';

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
class InputSpreadsheet extends InputBase {
  /**
   * 
   */
  constructor() {
    super();

    this._nRows = 0;
    this._nCols = 0;

    this.innerHTML = this.$content;

    this.initTable();

    this.readAttributes();
    this.initCells();

    this.initEvents();
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
      'disabled',
      'allow-modify-cells', // Boleh menambah baris/kolom & menghapusnya
      'auto-add',     // Menambah baris/kolom dengan enter
      'auto-remove',  // Menghapus baris/kolom ekstra yang kosong ketika backspace ditekan
      'nav-backspace' // Kalau kosong, backspace akan kembali ke kolom sebelumnya
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
   * 
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
  readAllowance() {
    this.getAttribute('allow-insert');
    this.getAttribute('allow-remove');
  }

  /**
   * 
   */
  initEvents() {
    const $toolbar = this.$toolbar;

    for (let action in $toolbar) {
      const button = this.querySelector(`[action="input-table-${action}"]`);

      if (button)
        button.addEventListener('click', (e) => {
          $toolbar[action].click();
          e.preventDefault();
        });
    }
  }

  /**
   * 
   */
  initNavigation() {

  }

  /**
   * 
   */
  initTable() {
    const cells = this.cellsTemplate(this._nRows, this._nCols);

    this._table = new Handsontable(this.querySelector('.table'), {
      ... this.$tableSettings,
      data: cells,
    });
  }

  /**
   * 
   */
  initCells() {
    console.log('INIT-CELLS');
  }

  /**
   * 
   */
  alter(what) {

    const sel = this._table.getSelected();
    if (sel) {
      if (what == 'row-insert-before')
        this._table.alter('insert_row', sel[0][0]);
      else if (what == 'row-insert-after')
        this._table.alter('insert_row', sel[0][0] + 1);
      else if (what == 'col-insert-before')
        this._table.alter('insert_col', sel[0][1]);
      else if (what == 'col-insert-after')
        this._table.alter('insert_col', sel[0][1] + 1);
      else if (what == 'row-remove')
        this._table.alter('remove_row', sel[0][0]);
      else if (what == 'col-remove')
        this._table.alter('remove_col', sel[0][1]);
    }
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
  parse(cells) {
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
      
      if (parsed) {
        console.log('JSON', cells, parsed);
        this._cells = parsed;
      }
      else isJSON = false;
    }

    // Parse CSV
    // Betul, ini memang dipisah (tidak pakai else)
    if (typeof cells == 'string' && ! isJSON) {
      parsed = cells.split(';');
      for (let r = 0; r < parsed.length; r++) {
        parsed[r] = parsed[r].split(',');
      }

      console.log('CSV', cells, parsed);
    }
    else parsed = this.cellsTemplate(this._nRows, this._nCols);

    return parsed;
  }

  /**
   * Menyamakan jumlah kolom.
   */
  equalizeColumns(data, minCols) {
    // Cek jumlah kolom terbanyak
    let maxCols = 0;
    for (let i in data) if (data[i].length > maxCols) maxCols = data[i].length;
    if (minCols && maxCols < minCols) maxCols = minCols;

    // Samakan jumlah kolomnya
    for (let i in data) {
      const row = data[i];
      if (row.length < maxCols)
        for (let j = row.length; j <= maxCols; j++) row.push('');
    }
  }

  /**
   * 
   */
  cellsTemplate(R, C) {
    const cells = [];
    for (let r = 0; r < R; r++) {
      const row = [];
      for (let c = 0; c < C; c++) {
        row.push('');
      }
      cells.push(row);
    }

    return cells;
  }

  /**
   * 
   */
  cellTemplate(value) {
    let input = '';
    if (this._input == 'short')
      input = `<input-short>${value}</input-short>`;
    else if (this._input == 'math')
      input = `<input-math>${value}</input-math>`;

    return `<td>${input}</td>`;
  }

  /**
   * 
   */
  get $content() {
    if (! this._$content) {
      let toolbar = '';
      const $toolbar = this.$toolbar;
      for (let name in $toolbar) {
        toolbar += `<button action="input-table-${name}" class="mdi mdi-${$toolbar[name].icon}" title="${$toolbar[name].tooltip}"></button>`;
      }
      this._$content = `
        <nav class="toolbar">${toolbar}</nav>
        <div class="table"></div>
      `;
    }

    return this._$content;
  }

  /**
   * 
   */
  get $toolbar() {
    return {
      'row-insert-before': {
        icon: 'table-row-plus-before',
        click: () => this.alter('row-insert-before'),
      },
      'row-insert-after': {
        icon: 'table-row-plus-after',
        click: () => this.alter('row-insert-after'),
      },
      'col-insert-before': {
        icon: 'table-column-plus-before',
        click: () => this.alter('col-insert-before'),
      },
      'col-insert-after': {
        icon: 'table-column-plus-after',
        click: () => this.alter('col-insert-after'),
      },
      'row-remove': {
        icon: 'table-row-remove',
        click: () => this.alter('row-remove'),
      },
      'col-remove': {
        icon: 'table-column-remove',
        click: () => this.alter('col-remove'),
      },
    };
  }

  /**
   * 
   */
  get $tableSettings() {
    return {
      outsideClickDeselects: false,
      contextMenu: [
        'undo', 'redo',
        'cut', 'copy',
        '---------',
        'row_above', 'row_below', 'col_left', 'col_right',
        'remove_row', 'clear_column',
        '---------',
      ],
      licenseKey: 'non-commercial-and-evaluation',
    };
  }

  /**
   * 
   */
  get value() {
    return this._table.getData();
  }
  set value(cells) {
    if (! this._table) this._initialValue = cells;
    else
      this._table.updateData(this.parse(cells));
  }

  /**
   * 
   */
  get nRows() { return this._nRows; }
  get nCols() { return this._nCols; }
}

customElements.define("input-spreadsheet", InputSpreadsheet);

export default InputSpreadsheet;