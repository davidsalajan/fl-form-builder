import FormComponent from '../FormComponent';

/**
 * @class TextBox
 * @extends FormComponent
 */
export default function TextBox(name) {
  if (!(this instanceof TextBox)) { return new TextBox(); }

  this.init(name);
}

TextBox.prototype = new FormComponent(); //Inheritance part
TextBox.prototype.componentType = 'TextBox';

/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
TextBox.prototype.init = function init(name) {
  this.constructor.prototype.init.call(this, name); // parent class init.

  //Create the text box
  var labelEl = document.createElement('div');
  labelEl.classList.add('full-width');

  var box = document.createElement('input');
  box.setAttribute('type', 'text');
  box.setAttribute('name', name);
  box.classList.add('fl-editable', 'fl-text-box', 'form-control');
  labelEl.appendChild(box);

  this.content.appendChild(labelEl);
  this.focusElement = box;
};

TextBox.prototype.setLabel = function setLabel(desc) {
  if (!desc || !this.title) { return; }

  this.title.innerText = desc;
};