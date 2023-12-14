export default function hasProperty(element, property) {
  return Object.prototype.hasOwnProperty.call(element, property);
}