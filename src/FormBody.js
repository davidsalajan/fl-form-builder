/*globals utils*/

function FormBody() {
  if (!(this instanceof FormBody)) {
    return new FormBody();
  }

  var form;
  var submitBtn;
  var components = [];

  function addReorderButton(comp) {
    var controls = comp.element.querySelector('.fl-component-side-control');
    if (!controls) {
      throw new Error('FormBody.addReorderButton(): No side control bar defined');
    }

    var dragBtn = document.createElement('i');
    dragBtn.classList.add('glyphicon');
    dragBtn.classList.add('glyphicon-menu-hamburger');
    dragBtn.setAttribute('draggable', true);

    dragBtn.addEventListener('dragstart', function (e) {
      e.dataTransfer.setDragImage(document.createElement('img'), 0, 0);
      comp.element.dataset.yStart = e.pageY;
    });

    var throttleDelay = 50;
    dragBtn.addEventListener('dragend', function (e) {
      setTimeout(function () {
        comp.element.style.transform = 'translate3d(0, 0, 0)';
        comp.element.dataset.yStart = e.pageY;
      }, throttleDelay);
    });

    dragBtn.addEventListener('drag', utils.throttle(throttleDelay, function dragging(e) {
      console.log('dragging');
      console.log(comp.element);

      var yStart = comp.element.dataset.yStart;
      var currY = e.pageY;
      if (currY === 0) { return; } //correct weird behaviour when mouse goes up

      var diff = currY - yStart;
      comp.element.style.transform = 'translate3d(0, ' + diff + 'px, 0)';
    }));

    //prepend to side control bar
    if (controls.children.length > 0) {
      controls.insertBefore(dragBtn, controls.children[0]);
    } else {
      controls.appendChild(dragBtn);
    }
  }

  this.addComponent = function addComponent(comp) {
    if (!form) {
      console.error('FormBody: Form not initialised.');
      return;
    } else if (!comp) {
      console.error('FormBody: No element to be added included.');
      return;
    } else {
      addReorderButton(comp);
      components.push(comp);
      form.insertBefore(comp.element, submitBtn);
      comp.configToggle(true);
    }
  };

  this.init = function () {
    form = document.createElement('form');
    form.classList.add('form-horizontal');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      console.log('Submit button clicked.');
      console.dir(components);
    });

    var _this = this;
    form.addEventListener('newElement', function (e) {
      if (!e.detail) {
        console.error('No data in "newElement" event.');
        return;
      }

      _this.addComponent(e.detail.comp);
    });

    submitBtn = document.createElement('input');
    submitBtn.setAttribute('type', 'submit');
    submitBtn.classList.add('btn');
    submitBtn.classList.add('col-sm-12');
    form.appendChild(submitBtn);
    this.element = form;
  };

  this.init();
}
