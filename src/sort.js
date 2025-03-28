import InputSelect from './select';
import Sortable from 'sortablejs/modular/sortable.core.esm.js';

/**
 * 
 */
class InputSort extends InputSelect {
  /**
   * 
   */
  constructor() {
    super();

    this._dragged = null;
    this._dropTo = null;
    this.nstate = 1;
  }

  /**
   * 
   */
  initEvents() {
    super.initEvents();

    Sortable.create(this, {
      animation: 150,
      ghostClass: 'drag-over',
    });

    /*
    this.addEventListener('mousemove', (e) => {
      if (this._dragged) this._itemDrag(e.offsetX, e.offsetY);
    });

    this.addEventListener('mouseout', () => {
      if (this._dragged) this._itemDragStop();
    });

    this.addEventListener('dragstart', (e) => {
      this._itemDragStart(e.target);
    });

    this.addEventListener('drop', (e) => {
      let item = e.target;
      if (e.target.tagName !== 'input-item') {
        e.target.closest('input-item');
      }

      item.classList.add('drag-over');
      if (this._dragged) this._itemDrop(item);  
    });
    */

    /*this.addEventListener('touchmove', (e) => {
      if (this._dragged) this._dragged.pos = {
        x: e.touches[0].pageX,
        y: e.touches[0].pageY,
        target: document.elementFromPoint(
          e.touches[0].pageX,
          e.touches[0].pageY
        ),
      };
      console.log('MOVE', e.touches[0].clientX, e.touches[0].clientY, this._dragged, e);
    });*/

    /*this.addEventListener('touchcancel', (e) => {
      console.log('CANCEL', e);
    });*/

    /*
    const items = this.querySelectorAll('input-item');    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      item.setAttribute('draggable', true);

      item.addEventListener('dragover', (e) => {
        this._dropTo = e.target;
        e.target.classList.add('drag-over');
        e.preventDefault();
      });
      item.addEventListener('dragleave', (e) => {
        this._dropTo = null;
        e.target.classList.remove('drag-over');
        e.preventDefault();
      });
      item.addEventListener('touchstart', (e) => {
        if (this._dragged) {
          this._itemDrop(item);
        } 
        else
          this._itemDragStart(item);
      });
    };*/

  }


  /**
   * 
   */
  /*_itemDragStart(item) {
    //console.log('DRAGSTART', item);
    this._dragged = {
      item: item,
    };
  }*/

  /**
   * 
   */
  /*_itemDragStop() {
    //console.log('DRAGSTOP', this._dragged);
    this._dragged = null;

    const items = this.querySelectorAll('input-item');
    for (let i = 0; i < items.length; i++)
      items[i].classList.remove('drag-over');
  }*/

  /**
   * 
   */
  /*_itemDrag(x, y) {
  }*/

  /**
   * 
   */
  /*_itemDrop(item) {
    if (item.tagName !== 'input-item') {
      item = item.closest('input-item');
    }
    //console.log('DROP', this._dragged.item, 'TO', item);
    this._itemSwap(this._dragged.item, item);
    item.classList.remove('drag-over');
    this._itemDragStop();
  }*/

  /**
   * 
   */
  /*_itemSwap(A, B) {
    this.insertBefore(A, B);
  }*/

  /**
   * 
   */
  get value() {
    const items = this.querySelectorAll('input-item');
    let order = [];

    for (let i = 0; i < items.length; i++) {
      order.push(items[i].getAttribute('value'));
    }

    return order;
  }

  set value(order) {
    if (! order) return this.value;

    const itemElements = this.querySelectorAll('input-item');
    const items = {};
    for (let i = 0; i < itemElements.length; i++)
      items[itemElements[i].value] = itemElements[i];

    const temp = document.createElement('div');
    for (let i = 0; i < order.length; i++) {
      const value = order[i];
      temp.append(items[value]);
    }

    while(temp.childNodes.length) {
      this.append(temp.childNodes[0]);
    }
    
    return this.value;
  }
}

customElements.define("input-sort", InputSort);

export default InputSort;