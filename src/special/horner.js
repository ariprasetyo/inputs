import InputTable from '../spreadsheet';

class InputHorner extends InputTable {
  /**
   * 
   */
  updateCellSettings() {
    for (let i = 0; i < this._table.countRows(); i++) {
      if (i % 2 == 0)
        this._table.getCellMeta(i, 0).readOnly = true;
    }
  }

  /**
   * 
   */
  get $tableSettings() {
    const settings = super.$tableSettings;

    //settings.minRows = 3;
    //settings.minCols = 3;

    settings.contextMenu = [
      'undo', 'redo',
      'cut', 'copy', 'paste',
    ];
    delete settings.contextMenu;

    return settings;
  }

  /**
   * 
   */
  get $toolbar() {
    return {
      'row-add': {
        icon: 'table-row-plus-after',
        tooltip: 'Tambah langkah',
        click: () => {
          this._table.alter('insert_row', this._table.countSourceRows(), 2);
          this.updateCellSettings();
        },
      },
      'row-remove': {
        icon: 'table-row-remove',
        tooltip: 'Hapus langkah',
        click: () => {
          if (this._table.countSourceRows() > 3) {
            this._table.alter('remove_row', this._table.countSourceRows() - 2, 2);
            this.updateCellSettings();
          }
        },
      },
      'col-insert-before': {
        icon: 'table-column-plus-before',
        tooltip: 'Tambah kolom di sebelah kiri',
        click: () => this.alter('col-insert-before'),
      },
      'col-insert-after': {
        icon: 'table-column-plus-after',
        tooltip: 'Tambah kolom di sebelah kanan',
        click: () => this.alter('col-insert-after'),
      },
      'col-remove': {
        icon: 'table-column-remove',
        tooltip: 'Hapus kolom',
        click: () => {
          if (this._table.countSourceCols() > 3)
            this.alter('col-remove');
        },
      },
    };
  }

  /**
   * 
   */
  get value() { return this._table.getData(); }
  set value(value) {
    const data = this.parse(value);
    const nRows = data.length;
    let targetNRows = 2 * Math.floor(nRows / 2) + 1;

    if (targetNRows < 3) targetNRows = 3;

    if (nRows % 2 == 0 || nRows < 3) {
      for (let i = nRows; i < targetNRows; i++)
        data.push([]);
    }

    this.equalizeColumns(data, 3);

    for (let i in data) 
      if (i % 2 == 0) 
        data[i][0] = '';
   
    this._table.updateData(data);
    this.updateCellSettings();
  }
};

customElements.define("input-horner", InputHorner);

export default InputHorner;