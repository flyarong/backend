import utils from 'hey-utils';

export default utils.extend({}, utils, {
  getClass(elem) {
    return (elem.getAttribute && elem.getAttribute('class')) || '';
  },
  hasClass(elem, selector) {
    let className;
    className = ` ${selector} `;
    if (elem.nodeType === 1 && (` ${this.getClass(elem)} `)
      .replace(/[\t\r\n\f]/g, ' ')
      .indexOf(className) > -1) {
      return true;
    }

    return false;
  },
  exportExcel(data, filename, sheetName) {
    const XLSX = require('xlsx');
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, filename);
  },
  currentDate() {
    return Manba().format('YYYY/MM/DD, h:mm:ss');
  },
  uuid() {
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var chars = CHARS; var uuid = new Array(36); var rnd = 0; var r;
    for (var i = 0; i < 36; i++) {
      if (i == 8 || i == 13 || i == 18 || i == 23) {
        uuid[i] = '-';
      } else if (i == 14) {
        uuid[i] = '4';
      } else {
        if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
        r = rnd & 0xf;
        rnd = rnd >> 4;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
    return uuid.join('');
  }
});
