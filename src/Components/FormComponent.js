import ViewController from '../ViewController';
import utils from '../utils/utils';
import assert from 'fl-assert';

/**
 * @abstract @class FormComponent
 */
export default class FormComponent extends ViewController {
  constructor(modulePrefix) {
    super(modulePrefix);
    this.cssPrefix = `${modulePrefix}-FormComponent`;
    this.html.container.classList.add(`${modulePrefix}-FormComponent`);

    this.editables = new Set();
    this.isRequired = false;
    this.isConfigVisible = false;
    this.isDetroyed = false;
    this.listeners = {
      destroy: new Set(),
      change: new Set(),
    };

    // Focused on config show
    this.focusElement = null;
    this.buildHtml();
    this.setRequired(false);
  }

  buildHtml() {
    const frag = document.createDocumentFragment();

    // -- Content --
    this.html.content = document.createElement('div');
    this.html.content.classList.add(`${this.cssPrefix}-content`);
    frag.appendChild(this.html.content);

    this.html.title = document.createElement('h3');
    this.html.title.innerText = 'Add a title';
    this.addEditable(this.html.title);
    this.html.content.appendChild(this.html.title);

    // -- Configuration --
    this.html.configuration = document.createElement('div');
    const configurationCssClass = `${this.cssPrefix}-configuration`;
    this.html.configuration.classList.add(configurationCssClass);
    frag.appendChild(this.html.configuration);

    const configurationButtons = document.createElement('div');
    configurationButtons.classList.add(`${this.cssPrefix}-configuration-buttons`);
    this.html.configuration.appendChild(configurationButtons);

    this.html.requiredSwitch = utils.createSwitch('Required', this.modulePrefix);
    this.html.requiredSwitch.classList.add(`${configurationCssClass}-switch-required`);
    this.html.requiredSwitch.addEventListener('change', () => {
      const checked = this.html.requiredSwitch;
      this.setRequired(checked);
    });
    configurationButtons.appendChild(this.html.requiredSwitch);

    const okBtn = document.createElement('button');
    okBtn.classList.add(
      `${configurationCssClass}-btn-ok`,
      'btn', // Bootstrap
      'btn-sm',
      'btn-default',
      'glyphicon', // Font-awesome
      'glyphicon-ok'
    );
    okBtn.type = 'button';
    okBtn.addEventListener('click', () => this.configToggle());
    configurationButtons.appendChild(okBtn);

    // -- Sidebar --
    this.html.sidebar = document.createElement('div');
    const sidebarCssClass = `${this.cssPrefix}-sidebar`;
    this.html.sidebar.classList.add(sidebarCssClass);
    frag.appendChild(this.html.sidebar);

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add(
      'glyphicon',
      'glyphicon-trash'
    );
    deleteBtn.type = 'button';
    deleteBtn.addEventListener('click', () => this.destroy());
    this.addSidebarButton(deleteBtn, 'delete');

    const showConfigBtn = document.createElement('button');
    showConfigBtn.type = 'button';
    showConfigBtn.classList.add(
      'glyphicon', // Font-awesome
      'glyphicon-cog'
    );
    showConfigBtn.title = 'Configure form group';
    this.addSidebarButton(showConfigBtn, 'config');

    showConfigBtn.addEventListener('click', () => {
      this.configToggle();
    });

    this.html.container.appendChild(frag);
  }

  addSidebarButton(button, elementName) {
    const className = elementName
      ? `${this.cssPrefix}-sidebar-btn-${elementName}`
      : `${this.cssPrefix}-sidebar-btn`;
    button.classList.add(className);
    this.html.sidebar.insertBefore(button, this.html.sidebar.children[0]);
  }

  /**
   * @method addEditable
   * @param  {HTMLElement} element
   */
  addEditable(element) {
    element.classList.add(`${this.cssPrefix}-editable`);
    this.editables.add(element);
    if (this.isConfigVisible) {
      this.enableEditing(true);
    }
  }

  /**
   * @method enableEditing
   * @param  {Boolean} enable - Whether to enable editing or not.
   * @return {void}
   */
  enableEditing(enable = true) {
    this.editables.forEach(element => {
      element.setAttribute('contenteditable', enable);
    });
  }

  /**
   * @method configToggle
   * @param  {Boolean} forceState Optional parameter to force a state.
   * @return {void}
   */
  configToggle(newState = !this.isConfigVisible) {
    this.isConfigVisible = newState;
    if (!newState) {
      // hide
      this.html.container.classList.remove(`${this.cssPrefix}--configuration-visible`);
      this.enableEditing(false);
    } else {
      // show
      this.html.container.classList.add(`${this.cssPrefix}--configuration-visible`);
      this.enableEditing(true);

      // hide on clickOut
      utils.onClickOut(
        [this.html.container, this.html.configuration],
        () => {
          if (this.isConfigVisible && !this.isDetroyed) { this.configToggle(); }
        }
      );
      this.focus();
    }
  }

  // Focus on the appropriate element
  focus() {
    if (this.focusElement) {
      // NOTE: There is a bug that for some reason it doesn't focus if you just
      // call focus() straight away. setTimeout solves it.
      // see http:// goo.gl/UjKOk5
      setTimeout(() => { this.focusElement.focus(); }, 15);
    }
  }

  /**
   * @method on
   * @param  {function} fn
   * @param {String} event
   * @return {void}
   */
  on(event, fn) {
    assert(this.listeners[event], `Trying to listen to invalid event: ${event}`);
    this.listeners[event].add(fn);
  }

  /**
   * @method removeListener
   * @param  {String} event
   * @param  {Function} fn
   * @return {void}
   */
  removeListener(event, fn) {
    assert(this.listeners[event], `Trying to remove listener from invalid event: ${event}`);
    this.listeners[event].delete(fn);
  }

  /**
   * @method trigger
   * @param  {String} event
   */
  trigger(event) {
    this.listeners[event].forEach(fn => fn(this));
  }

  destroy() {
    if (this.isDetroyed) { return; }
    this.isDetroyed = true;
    this.trigger('destroy');
    super.destroy();
  }

  /**
   * @method setRequired
   * @param  {Boolean} required
   */
  setRequired(required) {
    this.isRequired = required;
    this.html.requiredSwitch = required;
  }

  /**
   * Exports the information of a component in one object
   * @method exportState
   * @return {[type]} [description]
   */
  exportState() {
    return {
      required: this.isRequired,
      title: this.html.title.textContent,
      type: this.constructor.name,
    };
  }

  /**
   * Sets the component state the the options specified in the
   * state object
   * @method importState
   * @param  {Object} state
   * @return {void}
   */
  importState(state) {
    assert(state.type === this.constructor.name,
      `Importing incompatible state. Expected ${this.constructor.name}, got ${state.type}`);
    this.html.title.textContent = state.title;
    this.setRequired(state.required);
  }
}
