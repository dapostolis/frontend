export default function () {
  for (let prop in console) {
    if (typeof console[prop] === 'function') {
      console[prop] = function () {
      };
    }
  }
}