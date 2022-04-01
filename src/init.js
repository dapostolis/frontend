/**
 * Truncate a String using a specific size
 *
 * @param {size} - the size of text we want to truncate (default: 5)
 * @returns String
 */
String.prototype.truncate = function (size) {
  if (!size || isNaN(size)) {
    if (isNaN(size)) console.warn('You have to use a number as a truncate size');
    size = 5;
  }

  if (this.length > size)
    return this.substring(0, size) + '...';
  else
    return this + "";
};