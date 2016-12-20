(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

//
//    ACTION CREATORS
//

const undo = _ => ({
  type: "undo"
});

const importState = newFieldsState => ({
  type: "importState",
  newFieldsState
});

const createField = fieldType => ({
  type: "createField",
  fieldType
});

const fieldCreated = createdFieldState => ({
  type: "fieldCreated",
  createdFieldState
});

const toggleConfig = fieldState => ({
  type: "toggleConfig",
  fieldState
});

/* eslint-env jasmine */

describe("Action", () => {
  describe("undo", () => {
    it("returns the correct action type", () => {
      const action = undo();
      expect(action.type).toEqual("undo");
    });
  });

  describe("importState", () => {
    const mockStateToImport = ["a", "b"];

    it("returns the correct action type", () => {
      const action = importState(mockStateToImport);
      expect(action.type).toEqual("importState");
    });

    it("Creates the correct variables", () => {
      const action = importState(mockStateToImport);
      expect(action.newFieldsState).toEqual(mockStateToImport);
    });
  });

  describe("createField", () => {
    const fieldType = "testField";

    it("returns the correct action type", () => {
      const action = createField(fieldType);
      expect(action.type).toEqual("createField");
    });

    it("Creates the correct variables", () => {
      const action = createField(fieldType);
      expect(action.fieldType).toEqual(fieldType);
    });
  });

  describe("fieldCreated", () => {
    const createdFieldState = {};

    it("returns the correct action type", () => {
      const action = fieldCreated(createdFieldState);
      expect(action.type).toEqual("fieldCreated");
    });

    it("Creates the correct variables", () => {
      const action = fieldCreated(createdFieldState);
      expect(action.createdFieldState).toEqual(createdFieldState);
    });
  });

  describe("toggleConfig", () => {
    const fieldState = {};

    it("returns the correct action type", () => {
      const action = toggleConfig(fieldState);
      expect(action.type).toEqual("toggleConfig");
    });

    it("Creates the correct variables", () => {
      const action = toggleConfig(fieldState);
      expect(action.fieldState).toEqual(fieldState);
    });
  });
});

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var seamlessImmutable = createCommonjsModule(function (module, exports) {
(function() {
  "use strict";

function immutableInit(config) {

  // https://github.com/facebook/react/blob/v15.0.1/src/isomorphic/classic/element/ReactElement.js#L21
  var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element');
  var REACT_ELEMENT_TYPE_FALLBACK = 0xeac7;

  var globalConfig = {
    use_static: false
  };
  if (isObject(config)) {
      if (config.use_static !== undefined) {
          globalConfig.use_static = Boolean(config.use_static);
      }
  }

  function isObject(data) {
    return (
      typeof data === 'object' &&
      !Array.isArray(data) &&
      data !== null
    );
  }

  function instantiateEmptyObject(obj) {
      var prototype = Object.getPrototypeOf(obj);
      if (!prototype) {
          return {};
      } else {
          return Object.create(prototype);
      }
  }

  function addPropertyTo(target, methodName, value) {
    Object.defineProperty(target, methodName, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: value
    });
  }

  function banProperty(target, methodName) {
    addPropertyTo(target, methodName, function() {
      throw new ImmutableError("The " + methodName +
        " method cannot be invoked on an Immutable data structure.");
    });
  }

  var immutabilityTag = "__immutable_invariants_hold";

  function addImmutabilityTag(target) {
    addPropertyTo(target, immutabilityTag, true);
  }

  function isImmutable(target) {
    if (typeof target === "object") {
      return target === null || Boolean(
        Object.getOwnPropertyDescriptor(target, immutabilityTag)
      );
    } else {
      // In JavaScript, only objects are even potentially mutable.
      // strings, numbers, null, and undefined are all naturally immutable.
      return true;
    }
  }

  function isEqual(a, b) {
    // Avoid false positives due to (NaN !== NaN) evaluating to true
    return (a === b || (a !== a && b !== b));
  }

  function isMergableObject(target) {
    return target !== null && typeof target === "object" && !(Array.isArray(target)) && !(target instanceof Date);
  }

  var mutatingObjectMethods = [
    "setPrototypeOf"
  ];

  var nonMutatingObjectMethods = [
    "keys"
  ];

  var mutatingArrayMethods = mutatingObjectMethods.concat([
    "push", "pop", "sort", "splice", "shift", "unshift", "reverse"
  ]);

  var nonMutatingArrayMethods = nonMutatingObjectMethods.concat([
    "map", "filter", "slice", "concat", "reduce", "reduceRight"
  ]);

  var mutatingDateMethods = mutatingObjectMethods.concat([
    "setDate", "setFullYear", "setHours", "setMilliseconds", "setMinutes", "setMonth", "setSeconds",
    "setTime", "setUTCDate", "setUTCFullYear", "setUTCHours", "setUTCMilliseconds", "setUTCMinutes",
    "setUTCMonth", "setUTCSeconds", "setYear"
  ]);

  function ImmutableError(message) {
    var err       = new Error(message);
    // TODO: Consider `Object.setPrototypeOf(err, ImmutableError);`
    err.__proto__ = ImmutableError;

    return err;
  }
  ImmutableError.prototype = Error.prototype;

  function makeImmutable(obj, bannedMethods) {
    // Tag it so we can quickly tell it's immutable later.
    addImmutabilityTag(obj);

    {
      // Make all mutating methods throw exceptions.
      for (var index in bannedMethods) {
        if (bannedMethods.hasOwnProperty(index)) {
          banProperty(obj, bannedMethods[index]);
        }
      }

      // Freeze it and return it.
      Object.freeze(obj);
    }

    return obj;
  }

  function makeMethodReturnImmutable(obj, methodName) {
    var currentMethod = obj[methodName];

    addPropertyTo(obj, methodName, function() {
      return Immutable(currentMethod.apply(obj, arguments));
    });
  }

  function arraySet(idx, value, config) {
    var deep          = config && config.deep;

    if (idx in this) {
      if (deep && this[idx] !== value && isMergableObject(value) && isMergableObject(this[idx])) {
        value = Immutable.merge(this[idx], value, {deep: true, mode: 'replace'});
      }
      if (isEqual(this[idx], value)) {
        return this;
      }
    }

    var mutable = asMutableArray.call(this);
    mutable[idx] = Immutable(value);
    return makeImmutableArray(mutable);
  }

  var immutableEmptyArray = Immutable([]);

  function arraySetIn(pth, value, config) {
    var head = pth[0];

    if (pth.length === 1) {
      return arraySet.call(this, head, value, config);
    } else {
      var tail = pth.slice(1);
      var thisHead = this[head];
      var newValue;

      if (typeof(thisHead) === "object" && thisHead !== null) {
        // Might (validly) be object or array
        newValue = Immutable.setIn(thisHead, tail, value);
      } else {
        var nextHead = tail[0];
        // If the next path part is a number, then we are setting into an array, else an object.
        if (nextHead !== '' && isFinite(nextHead)) {
          newValue = arraySetIn.call(immutableEmptyArray, tail, value);
        } else {
          newValue = objectSetIn.call(immutableEmptyObject, tail, value);
        }
      }

      if (head in this && thisHead === newValue) {
        return this;
      }

      var mutable = asMutableArray.call(this);
      mutable[head] = newValue;
      return makeImmutableArray(mutable);
    }
  }

  function makeImmutableArray(array) {
    // Don't change their implementations, but wrap these functions to make sure
    // they always return an immutable value.
    for (var index in nonMutatingArrayMethods) {
      if (nonMutatingArrayMethods.hasOwnProperty(index)) {
        var methodName = nonMutatingArrayMethods[index];
        makeMethodReturnImmutable(array, methodName);
      }
    }

    if (!globalConfig.use_static) {
      addPropertyTo(array, "flatMap",  flatMap);
      addPropertyTo(array, "asObject", asObject);
      addPropertyTo(array, "asMutable", asMutableArray);
      addPropertyTo(array, "set", arraySet);
      addPropertyTo(array, "setIn", arraySetIn);
      addPropertyTo(array, "update", update);
      addPropertyTo(array, "updateIn", updateIn);
    }

    for(var i = 0, length = array.length; i < length; i++) {
      array[i] = Immutable(array[i]);
    }

    return makeImmutable(array, mutatingArrayMethods);
  }

  function makeImmutableDate(date) {
    if (!globalConfig.use_static) {
      addPropertyTo(date, "asMutable", asMutableDate);
    }

    return makeImmutable(date, mutatingDateMethods);
  }

  function asMutableDate() {
    return new Date(this.getTime());
  }

  /**
   * Effectively performs a map() over the elements in the array, using the
   * provided iterator, except that whenever the iterator returns an array, that
   * array's elements are added to the final result instead of the array itself.
   *
   * @param {function} iterator - The iterator function that will be invoked on each element in the array. It will receive three arguments: the current value, the current index, and the current object.
   */
  function flatMap(iterator) {
    // Calling .flatMap() with no arguments is a no-op. Don't bother cloning.
    if (arguments.length === 0) {
      return this;
    }

    var result = [],
        length = this.length,
        index;

    for (index = 0; index < length; index++) {
      var iteratorResult = iterator(this[index], index, this);

      if (Array.isArray(iteratorResult)) {
        // Concatenate Array results into the return value we're building up.
        result.push.apply(result, iteratorResult);
      } else {
        // Handle non-Array results the same way map() does.
        result.push(iteratorResult);
      }
    }

    return makeImmutableArray(result);
  }

  /**
   * Returns an Immutable copy of the object without the given keys included.
   *
   * @param {array} keysToRemove - A list of strings representing the keys to exclude in the return value. Instead of providing a single array, this method can also be called by passing multiple strings as separate arguments.
   */
  function without(remove) {
    // Calling .without() with no arguments is a no-op. Don't bother cloning.
    if (typeof remove === "undefined" && arguments.length === 0) {
      return this;
    }

    if (typeof remove !== "function") {
      // If we weren't given an array, use the arguments list.
      var keysToRemoveArray = (Array.isArray(remove)) ?
         remove.slice() : Array.prototype.slice.call(arguments);

      // Convert numeric keys to strings since that's how they'll
      // come from the enumeration of the object.
      keysToRemoveArray.forEach(function(el, idx, arr) {
        if(typeof(el) === "number") {
          arr[idx] = el.toString();
        }
      });

      remove = function(val, key) {
        return keysToRemoveArray.indexOf(key) !== -1;
      };
    }

    var result = instantiateEmptyObject(this);

    for (var key in this) {
      if (this.hasOwnProperty(key) && remove(this[key], key) === false) {
        result[key] = this[key];
      }
    }

    return makeImmutableObject(result);
  }

  function asMutableArray(opts) {
    var result = [], i, length;

    if(opts && opts.deep) {
      for(i = 0, length = this.length; i < length; i++) {
        result.push(asDeepMutable(this[i]));
      }
    } else {
      for(i = 0, length = this.length; i < length; i++) {
        result.push(this[i]);
      }
    }

    return result;
  }

  /**
   * Effectively performs a [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) over the elements in the array, expecting that the iterator function
   * will return an array of two elements - the first representing a key, the other
   * a value. Then returns an Immutable Object constructed of those keys and values.
   *
   * @param {function} iterator - A function which should return an array of two elements - the first representing the desired key, the other the desired value.
   */
  function asObject(iterator) {
    // If no iterator was provided, assume the identity function
    // (suggesting this array is already a list of key/value pairs.)
    if (typeof iterator !== "function") {
      iterator = function(value) { return value; };
    }

    var result = {},
        length = this.length,
        index;

    for (index = 0; index < length; index++) {
      var pair  = iterator(this[index], index, this),
          key   = pair[0],
          value = pair[1];

      result[key] = value;
    }

    return makeImmutableObject(result);
  }

  function asDeepMutable(obj) {
    if (
      (!obj) ||
      (typeof obj !== 'object') ||
      (!Object.getOwnPropertyDescriptor(obj, immutabilityTag)) ||
      (obj instanceof Date)
    ) { return obj; }
    return Immutable.asMutable(obj, {deep: true});
  }

  function quickCopy(src, dest) {
    for (var key in src) {
      if (Object.getOwnPropertyDescriptor(src, key)) {
        dest[key] = src[key];
      }
    }

    return dest;
  }

  /**
   * Returns an Immutable Object containing the properties and values of both
   * this object and the provided object, prioritizing the provided object's
   * values whenever the same key is present in both objects.
   *
   * @param {object} other - The other object to merge. Multiple objects can be passed as an array. In such a case, the later an object appears in that list, the higher its priority.
   * @param {object} config - Optional config object that contains settings. Supported settings are: {deep: true} for deep merge and {merger: mergerFunc} where mergerFunc is a function
   *                          that takes a property from both objects. If anything is returned it overrides the normal merge behaviour.
   */
  function merge(other, config) {
    // Calling .merge() with no arguments is a no-op. Don't bother cloning.
    if (arguments.length === 0) {
      return this;
    }

    if (other === null || (typeof other !== "object")) {
      throw new TypeError("Immutable#merge can only be invoked with objects or arrays, not " + JSON.stringify(other));
    }

    var receivedArray = (Array.isArray(other)),
        deep          = config && config.deep,
        mode          = config && config.mode || 'merge',
        merger        = config && config.merger,
        result;

    // Use the given key to extract a value from the given object, then place
    // that value in the result object under the same key. If that resulted
    // in a change from this object's value at that key, set anyChanges = true.
    function addToResult(currentObj, otherObj, key) {
      var immutableValue = Immutable(otherObj[key]);
      var mergerResult = merger && merger(currentObj[key], immutableValue, config);
      var currentValue = currentObj[key];

      if ((result !== undefined) ||
        (mergerResult !== undefined) ||
        (!currentObj.hasOwnProperty(key)) ||
        !isEqual(immutableValue, currentValue)) {

        var newValue;

        if (mergerResult) {
          newValue = mergerResult;
        } else if (deep && isMergableObject(currentValue) && isMergableObject(immutableValue)) {
          newValue = Immutable.merge(currentValue, immutableValue, config);
        } else {
          newValue = immutableValue;
        }

        if (!isEqual(currentValue, newValue) || !currentObj.hasOwnProperty(key)) {
          if (result === undefined) {
            // Make a shallow clone of the current object.
            result = quickCopy(currentObj, instantiateEmptyObject(currentObj));
          }

          result[key] = newValue;
        }
      }
    }

    function clearDroppedKeys(currentObj, otherObj) {
      for (var key in currentObj) {
        if (!otherObj.hasOwnProperty(key)) {
          if (result === undefined) {
            // Make a shallow clone of the current object.
            result = quickCopy(currentObj, instantiateEmptyObject(currentObj));
          }
          delete result[key];
        }
      }
    }

    var key;

    // Achieve prioritization by overriding previous values that get in the way.
    if (!receivedArray) {
      // The most common use case: just merge one object into the existing one.
      for (key in other) {
        if (Object.getOwnPropertyDescriptor(other, key)) {
          addToResult(this, other, key);
        }
      }
      if (mode === 'replace') {
        clearDroppedKeys(this, other);
      }
    } else {
      // We also accept an Array
      for (var index = 0, length = other.length; index < length; index++) {
        var otherFromArray = other[index];

        for (key in otherFromArray) {
          if (otherFromArray.hasOwnProperty(key)) {
            addToResult(result !== undefined ? result : this, otherFromArray, key);
          }
        }
      }
    }

    if (result === undefined) {
      return this;
    } else {
      return makeImmutableObject(result);
    }
  }

  function objectReplace(value, config) {
    var deep          = config && config.deep;

    // Calling .replace() with no arguments is a no-op. Don't bother cloning.
    if (arguments.length === 0) {
      return this;
    }

    if (value === null || typeof value !== "object") {
      throw new TypeError("Immutable#replace can only be invoked with objects or arrays, not " + JSON.stringify(value));
    }

    return Immutable.merge(this, value, {deep: deep, mode: 'replace'});
  }

  var immutableEmptyObject = Immutable({});

  function objectSetIn(path, value, config) {
    if (!(path instanceof Array) || path.length === 0) {
      throw new TypeError("The first argument to Immutable#setIn must be an array containing at least one \"key\" string.");
    }

    var head = path[0];
    if (path.length === 1) {
      return objectSet.call(this, head, value, config);
    }

    var tail = path.slice(1);
    var newValue;
    var thisHead = this[head];

    if (this.hasOwnProperty(head) && typeof(thisHead) === "object" && thisHead !== null) {
      // Might (validly) be object or array
      newValue = Immutable.setIn(thisHead, tail, value);
    } else {
      newValue = objectSetIn.call(immutableEmptyObject, tail, value);
    }

    if (this.hasOwnProperty(head) && thisHead === newValue) {
      return this;
    }

    var mutable = quickCopy(this, instantiateEmptyObject(this));
    mutable[head] = newValue;
    return makeImmutableObject(mutable);
  }

  function objectSet(property, value, config) {
    var deep          = config && config.deep;

    if (this.hasOwnProperty(property)) {
      if (deep && this[property] !== value && isMergableObject(value) && isMergableObject(this[property])) {
        value = Immutable.merge(this[property], value, {deep: true, mode: 'replace'});
      }
      if (isEqual(this[property], value)) {
        return this;
      }
    }

    var mutable = quickCopy(this, instantiateEmptyObject(this));
    mutable[property] = Immutable(value);
    return makeImmutableObject(mutable);
  }

  function update(property, updater) {
    var restArgs = Array.prototype.slice.call(arguments, 2);
    var initialVal = this[property];
    return Immutable.set(this, property, updater.apply(initialVal, [initialVal].concat(restArgs)));
  }

  function getInPath(obj, path) {
    /*jshint eqnull:true */
    for (var i = 0, l = path.length; obj != null && i < l; i++) {
      obj = obj[path[i]];
    }

    return (i && i == l) ? obj : undefined;
  }

  function updateIn(path, updater) {
    var restArgs = Array.prototype.slice.call(arguments, 2);
    var initialVal = getInPath(this, path);

    return Immutable.setIn(this, path, updater.apply(initialVal, [initialVal].concat(restArgs)));
  }

  function asMutableObject(opts) {
    var result = instantiateEmptyObject(this), key;

    if(opts && opts.deep) {
      for (key in this) {
        if (this.hasOwnProperty(key)) {
          result[key] = asDeepMutable(this[key]);
        }
      }
    } else {
      for (key in this) {
        if (this.hasOwnProperty(key)) {
          result[key] = this[key];
        }
      }
    }

    return result;
  }

  // Creates plain object to be used for cloning
  function instantiatePlainObject() {
    return {};
  }

  // Finalizes an object with immutable methods, freezes it, and returns it.
  function makeImmutableObject(obj) {
    if (!globalConfig.use_static) {
      addPropertyTo(obj, "merge", merge);
      addPropertyTo(obj, "replace", objectReplace);
      addPropertyTo(obj, "without", without);
      addPropertyTo(obj, "asMutable", asMutableObject);
      addPropertyTo(obj, "set", objectSet);
      addPropertyTo(obj, "setIn", objectSetIn);
      addPropertyTo(obj, "update", update);
      addPropertyTo(obj, "updateIn", updateIn);
    }

    return makeImmutable(obj, mutatingObjectMethods);
  }

  // Returns true if object is a valid react element
  // https://github.com/facebook/react/blob/v15.0.1/src/isomorphic/classic/element/ReactElement.js#L326
  function isReactElement(obj) {
    return typeof obj === 'object' &&
           obj !== null &&
           (obj.$$typeof === REACT_ELEMENT_TYPE_FALLBACK || obj.$$typeof === REACT_ELEMENT_TYPE);
  }

  function isFileObject(obj) {
    return typeof File !== 'undefined' &&
           obj instanceof File;
  }

  function Immutable(obj, options, stackRemaining) {
    if (isImmutable(obj) || isReactElement(obj) || isFileObject(obj)) {
      return obj;
    } else if (Array.isArray(obj)) {
      return makeImmutableArray(obj.slice());
    } else if (obj instanceof Date) {
      return makeImmutableDate(new Date(obj.getTime()));
    } else {
      // Don't freeze the object we were given; make a clone and use that.
      var prototype = options && options.prototype;
      var instantiateEmptyObject =
        (!prototype || prototype === Object.prototype) ?
          instantiatePlainObject : (function() { return Object.create(prototype); });
      var clone = instantiateEmptyObject();

      {
        /*jshint eqnull:true */
        if (stackRemaining == null) {
          stackRemaining = 64;
        }
        if (stackRemaining <= 0) {
          throw new ImmutableError("Attempt to construct Immutable from a deeply nested object was detected." +
            " Have you tried to wrap an object with circular references (e.g. React element)?" +
            " See https://github.com/rtfeldman/seamless-immutable/wiki/Deeply-nested-object-was-detected for details.");
        }
        stackRemaining -= 1;
      }

      for (var key in obj) {
        if (Object.getOwnPropertyDescriptor(obj, key)) {
          clone[key] = Immutable(obj[key], undefined, stackRemaining);
        }
      }

      return makeImmutableObject(clone);
    }
  }

  // Wrapper to allow the use of object methods as static methods of Immutable.
  function toStatic(fn) {
    function staticWrapper() {
      var args = [].slice.call(arguments);
      var self = args.shift();
      return fn.apply(self, args);
    }

    return staticWrapper;
  }

  // Wrapper to allow the use of object methods as static methods of Immutable.
  // with the additional condition of choosing which function to call depending
  // if argument is an array or an object.
  function toStaticObjectOrArray(fnObject, fnArray) {
    function staticWrapper() {
      var args = [].slice.call(arguments);
      var self = args.shift();
      if (Array.isArray(self)) {
          return fnArray.apply(self, args);
      } else {
          return fnObject.apply(self, args);
      }
    }

    return staticWrapper;
  }

  // Wrapper to allow the use of object methods as static methods of Immutable.
  // with the additional condition of choosing which function to call depending
  // if argument is an array or an object or a date.
  function toStaticObjectOrDateOrArray(fnObject, fnArray, fnDate) {
    function staticWrapper() {
      var args = [].slice.call(arguments);
      var self = args.shift();
      if (Array.isArray(self)) {
          return fnArray.apply(self, args);
      } else if (self instanceof Date) {
          return fnDate.apply(self, args);
      } else {
          return fnObject.apply(self, args);
      }
    }

    return staticWrapper;
  }

  // Export the library
  Immutable.from           = Immutable;
  Immutable.isImmutable    = isImmutable;
  Immutable.ImmutableError = ImmutableError;
  Immutable.merge          = toStatic(merge);
  Immutable.replace        = toStatic(objectReplace);
  Immutable.without        = toStatic(without);
  Immutable.asMutable      = toStaticObjectOrDateOrArray(asMutableObject, asMutableArray, asMutableDate);
  Immutable.set            = toStaticObjectOrArray(objectSet, arraySet);
  Immutable.setIn          = toStaticObjectOrArray(objectSetIn, arraySetIn);
  Immutable.update         = toStatic(update);
  Immutable.updateIn       = toStatic(updateIn);
  Immutable.flatMap        = toStatic(flatMap);
  Immutable.asObject       = toStatic(asObject);
  if (!globalConfig.use_static) {
      Immutable.static = immutableInit({
          use_static: true
      });
  }

  Object.freeze(Immutable);

  return Immutable;
}

  var Immutable = immutableInit();
  /* istanbul ignore if */
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return Immutable;
    });
  } else if (typeof module === "object") {
    module.exports = Immutable;
  } else if (typeof exports === "object") {
    exports.Immutable = Immutable;
  } else if (typeof window === "object") {
    window.Immutable = Immutable;
  } else if (typeof commonjsGlobal === "object") {
    commonjsGlobal.Immutable = Immutable;
  }
})();
});

/* eslint-disable new-cap */
// This middleware will just add the property "async dispatch"
// to actions with the "async" propperty set to true
const asyncDispatchMiddleware = store => next => action => {
  let syncActivityFinished = false;
  let actionQueue = [];

  function flushQueue() {
    actionQueue.forEach(a => store.dispatch(a)); // flush queue
    actionQueue = [];
  }

  function asyncDispatch(asyncAction) {
    actionQueue = actionQueue.concat([asyncAction]);

    if (syncActivityFinished) {
      flushQueue();
    }
  }

  const actionWithAsyncDispatch = seamlessImmutable(action).merge({ asyncDispatch });

  next(actionWithAsyncDispatch);
  syncActivityFinished = true;
  flushQueue();
};

/* eslint-env jasmine */
const fakeAction = { type: "fake action" };

describe("The asyncDispatchMiddleware", () => {
  it("calls next with asyncDispatch property", done => {
    const next = returnedAction => {
      expect(returnedAction.asyncDispatch).not.toEqual(undefined);
      expect(typeof returnedAction.asyncDispatch).toEqual("function");
      done();
    };

    asyncDispatchMiddleware("fakeStore")(next)(fakeAction);
  });

  it("asyncDispatch triggers a store dispatch", done => {
    const fakeAsyncAction = { type: "fakeAsyncAction" };

    const fakeStore = {
      dispatch: action => {
        expect(action.type).toEqual(fakeAsyncAction.type);
        done();
      }
    };

    const next = returnedAction => returnedAction.asyncDispatch(fakeAsyncAction);

    asyncDispatchMiddleware(fakeStore)(next)(fakeAction);
  });
});

// Bug checking function that will throw an error whenever
// the condition sent to it is evaluated to false
/**
 * Processes the message and outputs the correct message if the condition
 * is false. Otherwise it outputs null.
 * @api private
 * @method processCondition
 * @param  {Boolean} condition - Result of the evaluated condition
 * @param  {String} errorMessage - Message explainig the error in case it is thrown
 * @return {String | null}  - Error message if there is an error, nul otherwise.
 */
function processCondition(condition, errorMessage) {
  if (!condition) {
    var completeErrorMessage = '';
    var re = /at ([^\s]+)\s\(/g;
    var stackTrace = new Error().stack;
    var stackFunctions = [];

    var funcName = re.exec(stackTrace);
    while (funcName && funcName[1]) {
      stackFunctions.push(funcName[1]);
      funcName = re.exec(stackTrace);
    }

    // Number 0 is processCondition itself,
    // Number 1 is assert,
    // Number 2 is the caller function.
    if (stackFunctions[2]) {
      completeErrorMessage = stackFunctions[2] + ': ' + completeErrorMessage;
    }

    completeErrorMessage += errorMessage;
    return completeErrorMessage;
  }

  return null;
}

/**
 * Throws an error if the boolean passed to it evaluates to false.
 * To be used like this:
 * 		assert(myDate !== undefined, "Date cannot be undefined.");
 * @api public
 * @method assert
 * @param  {Boolean} condition - Result of the evaluated condition
 * @param  {String} errorMessage - Message explainig the error in case it is thrown
 * @return void
 */
function assert(condition, errorMessage) {
  var error = processCondition(condition, errorMessage);
  if (typeof error === 'string') {
    throw new Error(error);
  }
}

/**
 * Logs a warning if the boolean passed to it evaluates to false.
 * To be used like this:
 * 		assert.warn(myDate !== undefined, "No date provided.");
 * @api public
 * @method warn
 * @param  {Boolean} condition - Result of the evaluated condition
 * @param  {String} errorMessage - Message explainig the error in case it is thrown
 * @return void
 */
assert.warn = function warn(condition, errorMessage) {
  var error = processCondition(condition, errorMessage);
  if (typeof error === 'string') {
    console.warn(error);
  }
};

/**
 * Tests whether or not an object is an array.
 *
 * @private
 * @param {*} val The object to test.
 * @return {Boolean} `true` if `val` is an array, `false` otherwise.
 * @example
 *
 *      _isArray([]); //=> true
 *      _isArray(null); //=> false
 *      _isArray({}); //=> false
 */
var _isArray$1 = Array.isArray || function _isArray$1(val) {
  return (val != null &&
          val.length >= 0 &&
          Object.prototype.toString.call(val) === '[object Array]');
};

/**
 * An optimized, private array `slice` implementation.
 *
 * @private
 * @param {Arguments|Array} args The array or arguments object to consider.
 * @param {Number} [from=0] The array index to slice from, inclusive.
 * @param {Number} [to=args.length] The array index to slice to, exclusive.
 * @return {Array} A new, sliced array.
 * @example
 *
 *      _slice([1, 2, 3, 4, 5], 1, 3); //=> [2, 3]
 *
 *      var firstThreeArgs = function(a, b, c, d) {
 *        return _slice(arguments, 0, 3);
 *      };
 *      firstThreeArgs(1, 2, 3, 4); //=> [1, 2, 3]
 */
var _slice$1 = function _slice$1(args, from, to) {
  switch (arguments.length) {
    case 1: return _slice$1(args, 0, args.length);
    case 2: return _slice$1(args, from, args.length);
    default:
      var list = [];
      var idx = 0;
      var len = Math.max(0, Math.min(args.length, to) - from);
      while (idx < len) {
        list[idx] = args[from + idx];
        idx += 1;
      }
      return list;
  }
};

var _isArray = _isArray$1;
var _slice = _slice$1;


/**
 * Similar to hasMethod, this checks whether a function has a [methodname]
 * function. If it isn't an array it will execute that function otherwise it
 * will default to the ramda implementation.
 *
 * @private
 * @param {Function} fn ramda implemtation
 * @param {String} methodname property to check for a custom implementation
 * @return {Object} Whatever the return value of the method is.
 */
var _checkForMethod$1 = function _checkForMethod$1(methodname, fn) {
  return function() {
    var length = arguments.length;
    if (length === 0) {
      return fn();
    }
    var obj = arguments[length - 1];
    return (_isArray(obj) || typeof obj[methodname] !== 'function') ?
      fn.apply(this, arguments) :
      obj[methodname].apply(obj, _slice(arguments, 0, length - 1));
  };
};

var _isPlaceholder$2 = function _isPlaceholder$2(a) {
  return a != null &&
         typeof a === 'object' &&
         a['@@functional/placeholder'] === true;
};

var _isPlaceholder$1 = _isPlaceholder$2;


/**
 * Optimized internal one-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
var _curry1$1 = function _curry1$1(fn) {
  return function f1(a) {
    if (arguments.length === 0 || _isPlaceholder$1(a)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
};

var _curry1$3 = _curry1$1;
var _isPlaceholder$4 = _isPlaceholder$2;


/**
 * Optimized internal two-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
var _curry2$1 = function _curry2$1(fn) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;
      case 1:
        return _isPlaceholder$4(a) ? f2
             : _curry1$3(function(_b) { return fn(a, _b); });
      default:
        return _isPlaceholder$4(a) && _isPlaceholder$4(b) ? f2
             : _isPlaceholder$4(a) ? _curry1$3(function(_a) { return fn(_a, b); })
             : _isPlaceholder$4(b) ? _curry1$3(function(_b) { return fn(a, _b); })
             : fn(a, b);
    }
  };
};

var _curry1 = _curry1$1;
var _curry2 = _curry2$1;
var _isPlaceholder = _isPlaceholder$2;


/**
 * Optimized internal three-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
var _curry3$1 = function _curry3$1(fn) {
  return function f3(a, b, c) {
    switch (arguments.length) {
      case 0:
        return f3;
      case 1:
        return _isPlaceholder(a) ? f3
             : _curry2(function(_b, _c) { return fn(a, _b, _c); });
      case 2:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f3
             : _isPlaceholder(a) ? _curry2(function(_a, _c) { return fn(_a, b, _c); })
             : _isPlaceholder(b) ? _curry2(function(_b, _c) { return fn(a, _b, _c); })
             : _curry1(function(_c) { return fn(a, b, _c); });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3
             : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function(_a, _b) { return fn(_a, _b, c); })
             : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function(_a, _c) { return fn(_a, b, _c); })
             : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function(_b, _c) { return fn(a, _b, _c); })
             : _isPlaceholder(a) ? _curry1(function(_a) { return fn(_a, b, c); })
             : _isPlaceholder(b) ? _curry1(function(_b) { return fn(a, _b, c); })
             : _isPlaceholder(c) ? _curry1(function(_c) { return fn(a, b, _c); })
             : fn(a, b, c);
    }
  };
};

var _checkForMethod = _checkForMethod$1;
var _curry3 = _curry3$1;


/**
 * Returns the elements of the given list or string (or object with a `slice`
 * method) from `fromIndex` (inclusive) to `toIndex` (exclusive).
 *
 * Dispatches to the `slice` method of the third argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.4
 * @category List
 * @sig Number -> Number -> [a] -> [a]
 * @sig Number -> Number -> String -> String
 * @param {Number} fromIndex The start index (inclusive).
 * @param {Number} toIndex The end index (exclusive).
 * @param {*} list
 * @return {*}
 * @example
 *
 *      R.slice(1, 3, ['a', 'b', 'c', 'd']);        //=> ['b', 'c']
 *      R.slice(1, Infinity, ['a', 'b', 'c', 'd']); //=> ['b', 'c', 'd']
 *      R.slice(0, -1, ['a', 'b', 'c', 'd']);       //=> ['a', 'b', 'c']
 *      R.slice(-3, -1, ['a', 'b', 'c', 'd']);      //=> ['b', 'c']
 *      R.slice(0, 3, 'ramda');                     //=> 'ram'
 */
var slice = _curry3(_checkForMethod('slice', function slice(fromIndex, toIndex, list) {
  return Array.prototype.slice.call(list, fromIndex, toIndex);
}));

var _curry3$3 = _curry3$1;


/**
 * Returns the result of "setting" the portion of the given data structure
 * focused by the given lens to the result of applying the given function to
 * the focused value.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category Object
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig Lens s a -> (a -> a) -> s -> s
 * @param {Lens} lens
 * @param {*} v
 * @param {*} x
 * @return {*}
 * @see R.prop, R.lensIndex, R.lensProp
 * @example
 *
 *      var headLens = R.lensIndex(0);
 *
 *      R.over(headLens, R.toUpper, ['foo', 'bar', 'baz']); //=> ['FOO', 'bar', 'baz']
 */
var over = (function() {
  // `Identity` is a functor that holds a single value, where `map` simply
  // transforms the held value with the provided function.
  var Identity = function(x) {
    return {value: x, map: function(f) { return Identity(f(x)); }};
  };

  return _curry3$3(function over(lens, f, x) {
    // The value returned by the getter function is first transformed with `f`,
    // then set as the value of an `Identity`. This is then mapped over with the
    // setter function of the lens.
    return lens(function(y) { return Identity(f(y)); })(x).value;
  });
}());

var _curry1$4 = _curry1$1;


/**
 * Returns a function that always returns the given value. Note that for
 * non-primitives the value returned is a reference to the original value.
 *
 * This function is known as `const`, `constant`, or `K` (for K combinator) in
 * other languages and libraries.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig a -> (* -> a)
 * @param {*} val The value to wrap in a function
 * @return {Function} A Function :: * -> val.
 * @example
 *
 *      var t = R.always('Tee');
 *      t(); //=> 'Tee'
 */
var always$1 = _curry1$4(function always$1(val) {
  return function() {
    return val;
  };
});

var _curry3$4 = _curry3$1;
var always = always$1;
var over$1 = over;


/**
 * Returns the result of "setting" the portion of the given data structure
 * focused by the given lens to the given value.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category Object
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig Lens s a -> a -> s -> s
 * @param {Lens} lens
 * @param {*} v
 * @param {*} x
 * @return {*}
 * @see R.prop, R.lensIndex, R.lensProp
 * @example
 *
 *      var xLens = R.lensProp('x');
 *
 *      R.set(xLens, 4, {x: 1, y: 2});  //=> {x: 4, y: 2}
 *      R.set(xLens, 8, {x: 1, y: 2});  //=> {x: 8, y: 2}
 */
var set = _curry3$4(function set(lens, v, x) {
  return over$1(lens, always(v), x);
});

var _arity$1 = function _arity$1(n, fn) {
  /* eslint-disable no-unused-vars */
  switch (n) {
    case 0: return function() { return fn.apply(this, arguments); };
    case 1: return function(a0) { return fn.apply(this, arguments); };
    case 2: return function(a0, a1) { return fn.apply(this, arguments); };
    case 3: return function(a0, a1, a2) { return fn.apply(this, arguments); };
    case 4: return function(a0, a1, a2, a3) { return fn.apply(this, arguments); };
    case 5: return function(a0, a1, a2, a3, a4) { return fn.apply(this, arguments); };
    case 6: return function(a0, a1, a2, a3, a4, a5) { return fn.apply(this, arguments); };
    case 7: return function(a0, a1, a2, a3, a4, a5, a6) { return fn.apply(this, arguments); };
    case 8: return function(a0, a1, a2, a3, a4, a5, a6, a7) { return fn.apply(this, arguments); };
    case 9: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) { return fn.apply(this, arguments); };
    case 10: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) { return fn.apply(this, arguments); };
    default: throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
  }
};

var _pipe$1 = function _pipe$1(f, g) {
  return function() {
    return g.call(this, f.apply(this, arguments));
  };
};

var _xwrap$1 = (function() {
  function XWrap(fn) {
    this.f = fn;
  }
  XWrap.prototype['@@transducer/init'] = function() {
    throw new Error('init not implemented on XWrap');
  };
  XWrap.prototype['@@transducer/result'] = function(acc) { return acc; };
  XWrap.prototype['@@transducer/step'] = function(acc, x) {
    return this.f(acc, x);
  };

  return function _xwrap$1(fn) { return new XWrap(fn); };
}());

var _arity$3 = _arity$1;
var _curry2$3 = _curry2$1;


/**
 * Creates a function that is bound to a context.
 * Note: `R.bind` does not provide the additional argument-binding capabilities of
 * [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
 *
 * @func
 * @memberOf R
 * @since v0.6.0
 * @category Function
 * @category Object
 * @sig (* -> *) -> {*} -> (* -> *)
 * @param {Function} fn The function to bind to context
 * @param {Object} thisObj The context to bind `fn` to
 * @return {Function} A function that will execute in the context of `thisObj`.
 * @see R.partial
 * @example
 *
 *      var log = R.bind(console.log, console);
 *      R.pipe(R.assoc('a', 2), R.tap(log), R.assoc('a', 3))({a: 1}); //=> {a: 3}
 *      // logs {a: 2}
 */
var bind$1 = _curry2$3(function bind$1(fn, thisObj) {
  return _arity$3(fn.length, function() {
    return fn.apply(thisObj, arguments);
  });
});

var _isString$1 = function _isString$1(x) {
  return Object.prototype.toString.call(x) === '[object String]';
};

var _curry1$5 = _curry1$1;
var _isArray$3 = _isArray$1;
var _isString = _isString$1;


/**
 * Tests whether or not an object is similar to an array.
 *
 * @func
 * @memberOf R
 * @since v0.5.0
 * @category Type
 * @category List
 * @sig * -> Boolean
 * @param {*} x The object to test.
 * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
 * @example
 *
 *      R.isArrayLike([]); //=> true
 *      R.isArrayLike(true); //=> false
 *      R.isArrayLike({}); //=> false
 *      R.isArrayLike({length: 10}); //=> false
 *      R.isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
 */
var isArrayLike$1 = _curry1$5(function isArrayLike$1(x) {
  if (_isArray$3(x)) { return true; }
  if (!x) { return false; }
  if (typeof x !== 'object') { return false; }
  if (_isString(x)) { return false; }
  if (x.nodeType === 1) { return !!x.length; }
  if (x.length === 0) { return true; }
  if (x.length > 0) {
    return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
  }
  return false;
});

var _xwrap = _xwrap$1;
var bind = bind$1;
var isArrayLike = isArrayLike$1;


var _reduce$1 = (function() {
  function _arrayReduce(xf, acc, list) {
    var idx = 0;
    var len = list.length;
    while (idx < len) {
      acc = xf['@@transducer/step'](acc, list[idx]);
      if (acc && acc['@@transducer/reduced']) {
        acc = acc['@@transducer/value'];
        break;
      }
      idx += 1;
    }
    return xf['@@transducer/result'](acc);
  }

  function _iterableReduce(xf, acc, iter) {
    var step = iter.next();
    while (!step.done) {
      acc = xf['@@transducer/step'](acc, step.value);
      if (acc && acc['@@transducer/reduced']) {
        acc = acc['@@transducer/value'];
        break;
      }
      step = iter.next();
    }
    return xf['@@transducer/result'](acc);
  }

  function _methodReduce(xf, acc, obj) {
    return xf['@@transducer/result'](obj.reduce(bind(xf['@@transducer/step'], xf), acc));
  }

  var symIterator = (typeof Symbol !== 'undefined') ? Symbol.iterator : '@@iterator';
  return function _reduce$1(fn, acc, list) {
    if (typeof fn === 'function') {
      fn = _xwrap(fn);
    }
    if (isArrayLike(list)) {
      return _arrayReduce(fn, acc, list);
    }
    if (typeof list.reduce === 'function') {
      return _methodReduce(fn, acc, list);
    }
    if (list[symIterator] != null) {
      return _iterableReduce(fn, acc, list[symIterator]());
    }
    if (typeof list.next === 'function') {
      return _iterableReduce(fn, acc, list);
    }
    throw new TypeError('reduce: list must be array or iterable');
  };
}());

var _curry3$5 = _curry3$1;
var _reduce = _reduce$1;


/**
 * Returns a single item by iterating through the list, successively calling
 * the iterator function and passing it an accumulator value and the current
 * value from the array, and then passing the result to the next call.
 *
 * The iterator function receives two values: *(acc, value)*. It may use
 * `R.reduced` to shortcut the iteration.
 *
 * Note: `R.reduce` does not skip deleted or unassigned indices (sparse
 * arrays), unlike the native `Array.prototype.reduce` method. For more details
 * on this behavior, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
 *
 * Dispatches to the `reduce` method of the third argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig ((a, b) -> a) -> a -> [b] -> a
 * @param {Function} fn The iterator function. Receives two values, the accumulator and the
 *        current element from the array.
 * @param {*} acc The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.reduced, R.addIndex
 * @example
 *
 *      var numbers = [1, 2, 3];
 *      var plus = (a, b) => a + b;
 *
 *      R.reduce(plus, 10, numbers); //=> 16
 */
var reduce$1 = _curry3$5(_reduce);

var _checkForMethod$3 = _checkForMethod$1;
var slice$1 = slice;


/**
 * Returns all but the first element of the given list or string (or object
 * with a `tail` method).
 *
 * Dispatches to the `slice` method of the first argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [a]
 * @sig String -> String
 * @param {*} list
 * @return {*}
 * @see R.head, R.init, R.last
 * @example
 *
 *      R.tail([1, 2, 3]);  //=> [2, 3]
 *      R.tail([1, 2]);     //=> [2]
 *      R.tail([1]);        //=> []
 *      R.tail([]);         //=> []
 *
 *      R.tail('abc');  //=> 'bc'
 *      R.tail('ab');   //=> 'b'
 *      R.tail('a');    //=> ''
 *      R.tail('');     //=> ''
 */
var tail$1 = _checkForMethod$3('tail', slice$1(1, Infinity));

var _arity = _arity$1;
var _pipe = _pipe$1;
var reduce = reduce$1;
var tail = tail$1;


/**
 * Performs left-to-right function composition. The leftmost function may have
 * any arity; the remaining functions must be unary.
 *
 * In some libraries this function is named `sequence`.
 *
 * **Note:** The result of pipe is not automatically curried.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)) -> ((a, b, ..., n) -> z)
 * @param {...Function} functions
 * @return {Function}
 * @see R.compose
 * @example
 *
 *      var f = R.pipe(Math.pow, R.negate, R.inc);
 *
 *      f(3, 4); // -(3^4) + 1
 */
var pipe = function pipe() {
  if (arguments.length === 0) {
    throw new Error('pipe requires at least one argument');
  }
  return _arity(arguments[0].length,
                reduce(_pipe, arguments[0], tail(arguments)));
};

/**
 * Private `concat` function to merge two array-like objects.
 *
 * @private
 * @param {Array|Arguments} [set1=[]] An array-like object.
 * @param {Array|Arguments} [set2=[]] An array-like object.
 * @return {Array} A new, merged array.
 * @example
 *
 *      _concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
 */
var _concat$2 = function _concat$2(set1, set2) {
  set1 = set1 || [];
  set2 = set2 || [];
  var idx;
  var len1 = set1.length;
  var len2 = set2.length;
  var result = [];

  idx = 0;
  while (idx < len1) {
    result[result.length] = set1[idx];
    idx += 1;
  }
  idx = 0;
  while (idx < len2) {
    result[result.length] = set2[idx];
    idx += 1;
  }
  return result;
};

var _concat$1 = _concat$2;
var _curry2$4 = _curry2$1;


/**
 * Returns a new list with the given element at the front, followed by the
 * contents of the list.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig a -> [a] -> [a]
 * @param {*} el The item to add to the head of the output list.
 * @param {Array} list The array to add to the tail of the output list.
 * @return {Array} A new array.
 * @see R.append
 * @example
 *
 *      R.prepend('fee', ['fi', 'fo', 'fum']); //=> ['fee', 'fi', 'fo', 'fum']
 */
var prepend = _curry2$4(function prepend(el, list) {
  return _concat$1([el], list);
});

var _curry2$5 = _curry2$1;


/**
 * Returns a function that when supplied an object returns the indicated
 * property of that object, if it exists.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig s -> {s: a} -> a | Undefined
 * @param {String} p The property name
 * @param {Object} obj The object to query
 * @return {*} The value at `obj.p`.
 * @see R.path
 * @example
 *
 *      R.prop('x', {x: 100}); //=> 100
 *      R.prop('x', {}); //=> undefined
 */
var prop$1 = _curry2$5(function prop$1(p, obj) { return obj[p]; });

var _isTransformer$1 = function _isTransformer$1(obj) {
  return typeof obj['@@transducer/step'] === 'function';
};

var _isArray$4 = _isArray$1;
var _isTransformer = _isTransformer$1;
var _slice$3 = _slice$1;


/**
 * Returns a function that dispatches with different strategies based on the
 * object in list position (last argument). If it is an array, executes [fn].
 * Otherwise, if it has a function with [methodname], it will execute that
 * function (functor case). Otherwise, if it is a transformer, uses transducer
 * [xf] to return a new transformer (transducer case). Otherwise, it will
 * default to executing [fn].
 *
 * @private
 * @param {String} methodname property to check for a custom implementation
 * @param {Function} xf transducer to initialize if object is transformer
 * @param {Function} fn default ramda implementation
 * @return {Function} A function that dispatches on object in list position
 */
var _dispatchable$1 = function _dispatchable$1(methodname, xf, fn) {
  return function() {
    var length = arguments.length;
    if (length === 0) {
      return fn();
    }
    var obj = arguments[length - 1];
    if (!_isArray$4(obj)) {
      var args = _slice$3(arguments, 0, length - 1);
      if (typeof obj[methodname] === 'function') {
        return obj[methodname].apply(obj, args);
      }
      if (_isTransformer(obj)) {
        var transducer = xf.apply(null, args);
        return transducer(obj);
      }
    }
    return fn.apply(this, arguments);
  };
};

var _map$2 = function _map$2(fn, functor) {
  var idx = 0;
  var len = functor.length;
  var result = Array(len);
  while (idx < len) {
    result[idx] = fn(functor[idx]);
    idx += 1;
  }
  return result;
};

var _xfBase$1 = {
  init: function() {
    return this.xf['@@transducer/init']();
  },
  result: function(result) {
    return this.xf['@@transducer/result'](result);
  }
};

var _curry2$8 = _curry2$1;
var _xfBase = _xfBase$1;


var _xmap$1 = (function() {
  function XMap(f, xf) {
    this.xf = xf;
    this.f = f;
  }
  XMap.prototype['@@transducer/init'] = _xfBase.init;
  XMap.prototype['@@transducer/result'] = _xfBase.result;
  XMap.prototype['@@transducer/step'] = function(result, input) {
    return this.xf['@@transducer/step'](result, this.f(input));
  };

  return _curry2$8(function _xmap$1(f, xf) { return new XMap(f, xf); });
}());

var _arity$5 = _arity$1;
var _isPlaceholder$5 = _isPlaceholder$2;


/**
 * Internal curryN function.
 *
 * @private
 * @category Function
 * @param {Number} length The arity of the curried function.
 * @param {Array} received An array of arguments received thus far.
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
var _curryN$1 = function _curryN$1(length, received, fn) {
  return function() {
    var combined = [];
    var argsIdx = 0;
    var left = length;
    var combinedIdx = 0;
    while (combinedIdx < received.length || argsIdx < arguments.length) {
      var result;
      if (combinedIdx < received.length &&
          (!_isPlaceholder$5(received[combinedIdx]) ||
           argsIdx >= arguments.length)) {
        result = received[combinedIdx];
      } else {
        result = arguments[argsIdx];
        argsIdx += 1;
      }
      combined[combinedIdx] = result;
      if (!_isPlaceholder$5(result)) {
        left -= 1;
      }
      combinedIdx += 1;
    }
    return left <= 0 ? fn.apply(this, combined)
                     : _arity$5(left, _curryN$1(length, combined, fn));
  };
};

var _arity$4 = _arity$1;
var _curry1$6 = _curry1$1;
var _curry2$9 = _curry2$1;
var _curryN = _curryN$1;


/**
 * Returns a curried equivalent of the provided function, with the specified
 * arity. The curried function has two unusual capabilities. First, its
 * arguments needn't be provided one at a time. If `g` is `R.curryN(3, f)`, the
 * following are equivalent:
 *
 *   - `g(1)(2)(3)`
 *   - `g(1)(2, 3)`
 *   - `g(1, 2)(3)`
 *   - `g(1, 2, 3)`
 *
 * Secondly, the special placeholder value `R.__` may be used to specify
 * "gaps", allowing partial application of any combination of arguments,
 * regardless of their positions. If `g` is as above and `_` is `R.__`, the
 * following are equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @func
 * @memberOf R
 * @since v0.5.0
 * @category Function
 * @sig Number -> (* -> a) -> (* -> a)
 * @param {Number} length The arity for the returned function.
 * @param {Function} fn The function to curry.
 * @return {Function} A new, curried function.
 * @see R.curry
 * @example
 *
 *      var sumArgs = (...args) => R.sum(args);
 *
 *      var curriedAddFourNumbers = R.curryN(4, sumArgs);
 *      var f = curriedAddFourNumbers(1, 2);
 *      var g = f(3);
 *      g(4); //=> 10
 */
var curryN$1 = _curry2$9(function curryN$1(length, fn) {
  if (length === 1) {
    return _curry1$6(fn);
  }
  return _arity$4(length, _curryN(length, [], fn));
});

var _has$1 = function _has$1(prop, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};

var _has$3 = _has$1;


var _isArguments$1 = (function() {
  var toString = Object.prototype.toString;
  return toString.call(arguments) === '[object Arguments]' ?
    function _isArguments$1(x) { return toString.call(x) === '[object Arguments]'; } :
    function _isArguments$1(x) { return _has$3('callee', x); };
}());

var _curry1$7 = _curry1$1;
var _has = _has$1;
var _isArguments = _isArguments$1;


/**
 * Returns a list containing the names of all the enumerable own properties of
 * the supplied object.
 * Note that the order of the output array is not guaranteed to be consistent
 * across different JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig {k: v} -> [k]
 * @param {Object} obj The object to extract properties from
 * @return {Array} An array of the object's own properties.
 * @example
 *
 *      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
 */
var keys$1 = (function() {
  // cover IE < 9 keys issues
  var hasEnumBug = !({toString: null}).propertyIsEnumerable('toString');
  var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString',
                            'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
  // Safari bug
  var hasArgsEnumBug = (function() {
    'use strict';
    return arguments.propertyIsEnumerable('length');
  }());

  var contains = function contains(list, item) {
    var idx = 0;
    while (idx < list.length) {
      if (list[idx] === item) {
        return true;
      }
      idx += 1;
    }
    return false;
  };

  return typeof Object.keys === 'function' && !hasArgsEnumBug ?
    _curry1$7(function keys$1(obj) {
      return Object(obj) !== obj ? [] : Object.keys(obj);
    }) :
    _curry1$7(function keys$1(obj) {
      if (Object(obj) !== obj) {
        return [];
      }
      var prop, nIdx;
      var ks = [];
      var checkArgsLength = hasArgsEnumBug && _isArguments(obj);
      for (prop in obj) {
        if (_has(prop, obj) && (!checkArgsLength || prop !== 'length')) {
          ks[ks.length] = prop;
        }
      }
      if (hasEnumBug) {
        nIdx = nonEnumerableProps.length - 1;
        while (nIdx >= 0) {
          prop = nonEnumerableProps[nIdx];
          if (_has(prop, obj) && !contains(ks, prop)) {
            ks[ks.length] = prop;
          }
          nIdx -= 1;
        }
      }
      return ks;
    });
}());

var _curry2$7 = _curry2$1;
var _dispatchable = _dispatchable$1;
var _map$1 = _map$2;
var _reduce$3 = _reduce$1;
var _xmap = _xmap$1;
var curryN = curryN$1;
var keys = keys$1;


/**
 * Takes a function and
 * a [functor](https://github.com/fantasyland/fantasy-land#functor),
 * applies the function to each of the functor's values, and returns
 * a functor of the same shape.
 *
 * Ramda provides suitable `map` implementations for `Array` and `Object`,
 * so this function may be applied to `[1, 2, 3]` or `{x: 1, y: 2, z: 3}`.
 *
 * Dispatches to the `map` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * Also treats functions as functors and will compose them together.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Functor f => (a -> b) -> f a -> f b
 * @param {Function} fn The function to be called on every element of the input `list`.
 * @param {Array} list The list to be iterated over.
 * @return {Array} The new list.
 * @see R.transduce, R.addIndex
 * @example
 *
 *      var double = x => x * 2;
 *
 *      R.map(double, [1, 2, 3]); //=> [2, 4, 6]
 *
 *      R.map(double, {x: 1, y: 2, z: 3}); //=> {x: 2, y: 4, z: 6}
 */
var map$1 = _curry2$7(_dispatchable('map', _xmap, function map$1(fn, functor) {
  switch (Object.prototype.toString.call(functor)) {
    case '[object Function]':
      return curryN(functor.length, function() {
        return fn.call(this, functor.apply(this, arguments));
      });
    case '[object Object]':
      return _reduce$3(function(acc, key) {
        acc[key] = fn(functor[key]);
        return acc;
      }, {}, keys(functor));
    default:
      return _map$1(fn, functor);
  }
}));

var _curry2$6 = _curry2$1;
var map = map$1;


/**
 * Returns a lens for the given getter and setter functions. The getter "gets"
 * the value of the focus; the setter "sets" the value of the focus. The setter
 * should not mutate the data structure.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Object
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig (s -> a) -> ((a, s) -> s) -> Lens s a
 * @param {Function} getter
 * @param {Function} setter
 * @return {Lens}
 * @see R.view, R.set, R.over, R.lensIndex, R.lensProp
 * @example
 *
 *      var xLens = R.lens(R.prop('x'), R.assoc('x'));
 *
 *      R.view(xLens, {x: 1, y: 2});            //=> 1
 *      R.set(xLens, 4, {x: 1, y: 2});          //=> {x: 4, y: 2}
 *      R.over(xLens, R.negate, {x: 1, y: 2});  //=> {x: -1, y: 2}
 */
var lens$1 = _curry2$6(function lens$1(getter, setter) {
  return function(toFunctorFn) {
    return function(target) {
      return map(
        function(focus) {
          return setter(focus, target);
        },
        toFunctorFn(getter(target))
      );
    };
  };
});

var _curry1$8 = _curry1$1;
var curryN$3 = curryN$1;


/**
 * Returns a curried equivalent of the provided function. The curried function
 * has two unusual capabilities. First, its arguments needn't be provided one
 * at a time. If `f` is a ternary function and `g` is `R.curry(f)`, the
 * following are equivalent:
 *
 *   - `g(1)(2)(3)`
 *   - `g(1)(2, 3)`
 *   - `g(1, 2)(3)`
 *   - `g(1, 2, 3)`
 *
 * Secondly, the special placeholder value `R.__` may be used to specify
 * "gaps", allowing partial application of any combination of arguments,
 * regardless of their positions. If `g` is as above and `_` is `R.__`, the
 * following are equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (* -> a) -> (* -> a)
 * @param {Function} fn The function to curry.
 * @return {Function} A new, curried function.
 * @see R.curryN
 * @example
 *
 *      var addFourNumbers = (a, b, c, d) => a + b + c + d;
 *
 *      var curriedAddFourNumbers = R.curry(addFourNumbers);
 *      var f = curriedAddFourNumbers(1, 2);
 *      var g = f(3);
 *      g(4); //=> 10
 */
var curry$1 = _curry1$8(function curry$1(fn) {
  return curryN$3(fn.length, fn);
});

/* eslint-disable new-cap */

const updateAt = curry$1((keyArray, newVal, obj) => {
  const deepNewVal = keyArray.reduceRight((result, key) => ({ [key]: result }), newVal);

  return seamlessImmutable(obj).merge(deepNewVal, { deep: true });
});

// State lenses
const StateLenses = {
  fieldTypes: lens$1(prop$1("fieldTypes"), updateAt(["fieldTypes"])),
  fieldsState: lens$1(prop$1("fieldsState"), updateAt(["fieldsState"])),
  fieldsStateHistory: lens$1(prop$1("fieldsStateHistory"), updateAt(["fieldsStateHistory"]))
};

// _ => String
const createId = _ => Date.now().toString();

// State -> [fieldsState] -> State
const pushHistoryState = curry$1((state, newHistoryState) => pipe(
// Add current state to history
over(StateLenses.fieldsStateHistory, prepend(state.fieldsState)),
// Make new State the current
set(StateLenses.fieldsState, newHistoryState))(state));

// State -> State
const hideConfigs = state => set(StateLenses.fieldsState, state.fieldsState.map(s => Object.assign({}, s, { configShowing: false })), state);

const lastHistoryState = state => state.fieldsStateHistory[0] || [];

const undo$1 = (state, _) => pipe(
// Make last history last state the current one
set(StateLenses.fieldsState, lastHistoryState(state)),
// Remove last history state from the history array
over(StateLenses.fieldsStateHistory, slice(1, Infinity)))(state);

var _identity$1 = function _identity$1(x) { return x; };

var _curry1$9 = _curry1$1;
var _identity = _identity$1;


/**
 * A function that does nothing but return the parameter supplied to it. Good
 * as a default or placeholder function.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig a -> a
 * @param {*} x The value to return.
 * @return {*} The input value, `x`.
 * @example
 *
 *      R.identity(1); //=> 1
 *
 *      var obj = {};
 *      R.identity(obj) === obj; //=> true
 */
var identity = _curry1$9(_identity);

var _curry2$10 = _curry2$1;


/**
 * Retrieve the value at a given path.
 *
 * @func
 * @memberOf R
 * @since v0.2.0
 * @category Object
 * @sig [String] -> {k: v} -> v | Undefined
 * @param {Array} path The path to use.
 * @param {Object} obj The object to retrieve the nested property from.
 * @return {*} The data at `path`.
 * @see R.prop
 * @example
 *
 *      R.path(['a', 'b'], {a: {b: 2}}); //=> 2
 *      R.path(['a', 'b'], {c: {b: 2}}); //=> undefined
 */
var path = _curry2$10(function path(paths, obj) {
  var val = obj;
  var idx = 0;
  while (idx < paths.length) {
    if (val == null) {
      return;
    }
    val = val[paths[idx]];
    idx += 1;
  }
  return val;
});

var _concat$4 = _concat$2;
var _curry2$12 = _curry2$1;
var _reduce$4 = _reduce$1;
var map$5 = map$1;


/**
 * ap applies a list of functions to a list of values.
 *
 * Dispatches to the `ap` method of the second argument, if present. Also
 * treats curried functions as applicatives.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category Function
 * @sig [a -> b] -> [a] -> [b]
 * @sig Apply f => f (a -> b) -> f a -> f b
 * @param {Array} fns An array of functions
 * @param {Array} vs An array of values
 * @return {Array} An array of results of applying each of `fns` to all of `vs` in turn.
 * @example
 *
 *      R.ap([R.multiply(2), R.add(3)], [1,2,3]); //=> [2, 4, 6, 4, 5, 6]
 */
var ap$1 = _curry2$12(function ap$1(applicative, fn) {
  return (
    typeof applicative.ap === 'function' ?
      applicative.ap(fn) :
    typeof applicative === 'function' ?
      function(x) { return applicative(x)(fn(x)); } :
    // else
      _reduce$4(function(acc, f) { return _concat$4(acc, map$5(f, fn)); }, [], applicative)
  );
});

var _curry3$7 = _curry3$1;


/**
 * Returns a single item by iterating through the list, successively calling
 * the iterator function and passing it an accumulator value and the current
 * value from the array, and then passing the result to the next call.
 *
 * Similar to `reduce`, except moves through the input list from the right to
 * the left.
 *
 * The iterator function receives two values: *(acc, value)*
 *
 * Note: `R.reduceRight` does not skip deleted or unassigned indices (sparse
 * arrays), unlike the native `Array.prototype.reduce` method. For more details
 * on this behavior, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight#Description
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig (a,b -> a) -> a -> [b] -> a
 * @param {Function} fn The iterator function. Receives two values, the accumulator and the
 *        current element from the array.
 * @param {*} acc The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.addIndex
 * @example
 *
 *      var pairs = [ ['a', 1], ['b', 2], ['c', 3] ];
 *      var flattenPairs = (acc, pair) => acc.concat(pair);
 *
 *      R.reduceRight(flattenPairs, [], pairs); //=> [ 'c', 3, 'b', 2, 'a', 1 ]
 */
var reduceRight$1 = _curry3$7(function reduceRight$1(fn, acc, list) {
  var idx = list.length - 1;
  while (idx >= 0) {
    acc = fn(acc, list[idx]);
    idx -= 1;
  }
  return acc;
});

var _curry2$11 = _curry2$1;
var ap = ap$1;
var map$4 = map$1;
var prepend$1 = prepend;
var reduceRight = reduceRight$1;


/**
 * Transforms a [Traversable](https://github.com/fantasyland/fantasy-land#traversable)
 * of [Applicative](https://github.com/fantasyland/fantasy-land#applicative) into an
 * Applicative of Traversable.
 *
 * Dispatches to the `sequence` method of the second argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category List
 * @sig (Applicative f, Traversable t) => (a -> f a) -> t (f a) -> f (t a)
 * @param {Function} of
 * @param {*} traversable
 * @return {*}
 * @see R.traverse
 * @example
 *
 *      R.sequence(Maybe.of, [Just(1), Just(2), Just(3)]);   //=> Just([1, 2, 3])
 *      R.sequence(Maybe.of, [Just(1), Just(2), Nothing()]); //=> Nothing()
 *
 *      R.sequence(R.of, Just([1, 2, 3])); //=> [Just(1), Just(2), Just(3)]
 *      R.sequence(R.of, Nothing());       //=> [Nothing()]
 */
var sequence$1 = _curry2$11(function sequence$1(of, traversable) {
  return typeof traversable.sequence === 'function' ?
    traversable.sequence(of) :
    reduceRight(function(acc, x) { return ap(map$4(prepend$1, x), acc); },
                of([]),
                traversable);
});

var _curry3$6 = _curry3$1;
var map$3 = map$1;
var sequence = sequence$1;


/**
 * Maps an [Applicative](https://github.com/fantasyland/fantasy-land#applicative)-returning
 * function over a [Traversable](https://github.com/fantasyland/fantasy-land#traversable),
 * then uses [`sequence`](#sequence) to transform the resulting Traversable of Applicative
 * into an Applicative of Traversable.
 *
 * Dispatches to the `sequence` method of the third argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category List
 * @sig (Applicative f, Traversable t) => (a -> f a) -> (a -> f b) -> t a -> f (t b)
 * @param {Function} of
 * @param {Function} f
 * @param {*} traversable
 * @return {*}
 * @see R.sequence
 * @example
 *
 *      // Returns `Nothing` if the given divisor is `0`
 *      safeDiv = n => d => d === 0 ? Nothing() : Just(n / d)
 *
 *      R.traverse(Maybe.of, safeDiv(10), [2, 4, 5]); //=> Just([5, 2.5, 2])
 *      R.traverse(Maybe.of, safeDiv(10), [2, 0, 5]); //=> Nothing
 */
var traverse = _curry3$6(function traverse(of, f, traversable) {
  return sequence(of, map$3(f, traversable));
});

var _arrayFromIterator$1 = function _arrayFromIterator$1(iter) {
  var list = [];
  var next;
  while (!(next = iter.next()).done) {
    list.push(next.value);
  }
  return list;
};

var _functionName$1 = function _functionName$1(f) {
  // String(x => x) evaluates to "x => x", so the pattern may not match.
  var match = String(f).match(/^function (\w*)/);
  return match == null ? '' : match[1];
};

var _curry2$14 = _curry2$1;


/**
 * Returns true if its arguments are identical, false otherwise. Values are
 * identical if they reference the same memory. `NaN` is identical to `NaN`;
 * `0` and `-0` are not identical.
 *
 * @func
 * @memberOf R
 * @since v0.15.0
 * @category Relation
 * @sig a -> a -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @example
 *
 *      var o = {};
 *      R.identical(o, o); //=> true
 *      R.identical(1, 1); //=> true
 *      R.identical(1, '1'); //=> false
 *      R.identical([], []); //=> false
 *      R.identical(0, -0); //=> false
 *      R.identical(NaN, NaN); //=> true
 */
var identical$1 = _curry2$14(function identical$1(a, b) {
  // SameValue algorithm
  if (a === b) { // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    return a !== 0 || 1 / a === 1 / b;
  } else {
    // Step 6.a: NaN == NaN
    return a !== a && b !== b;
  }
});

var _curry1$10 = _curry1$1;


/**
 * Gives a single-word string description of the (native) type of a value,
 * returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not
 * attempt to distinguish user Object types any further, reporting them all as
 * 'Object'.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Type
 * @sig (* -> {*}) -> String
 * @param {*} val The value to test
 * @return {String}
 * @example
 *
 *      R.type({}); //=> "Object"
 *      R.type(1); //=> "Number"
 *      R.type(false); //=> "Boolean"
 *      R.type('s'); //=> "String"
 *      R.type(null); //=> "Null"
 *      R.type([]); //=> "Array"
 *      R.type(/[A-z]/); //=> "RegExp"
 */
var type$1 = _curry1$10(function type$1(val) {
  return val === null      ? 'Null'      :
         val === undefined ? 'Undefined' :
         Object.prototype.toString.call(val).slice(8, -1);
});

var _arrayFromIterator = _arrayFromIterator$1;
var _functionName = _functionName$1;
var _has$4 = _has$1;
var identical = identical$1;
var keys$3 = keys$1;
var type = type$1;


var _equals$1 = function _equals$1(a, b, stackA, stackB) {
  if (identical(a, b)) {
    return true;
  }

  if (type(a) !== type(b)) {
    return false;
  }

  if (a == null || b == null) {
    return false;
  }

  if (typeof a.equals === 'function' || typeof b.equals === 'function') {
    return typeof a.equals === 'function' && a.equals(b) &&
           typeof b.equals === 'function' && b.equals(a);
  }

  switch (type(a)) {
    case 'Arguments':
    case 'Array':
    case 'Object':
      if (typeof a.constructor === 'function' &&
          _functionName(a.constructor) === 'Promise') {
        return a === b;
      }
      break;
    case 'Boolean':
    case 'Number':
    case 'String':
      if (!(typeof a === typeof b && identical(a.valueOf(), b.valueOf()))) {
        return false;
      }
      break;
    case 'Date':
      if (!identical(a.valueOf(), b.valueOf())) {
        return false;
      }
      break;
    case 'Error':
      return a.name === b.name && a.message === b.message;
    case 'RegExp':
      if (!(a.source === b.source &&
            a.global === b.global &&
            a.ignoreCase === b.ignoreCase &&
            a.multiline === b.multiline &&
            a.sticky === b.sticky &&
            a.unicode === b.unicode)) {
        return false;
      }
      break;
    case 'Map':
    case 'Set':
      if (!_equals$1(_arrayFromIterator(a.entries()), _arrayFromIterator(b.entries()), stackA, stackB)) {
        return false;
      }
      break;
    case 'Int8Array':
    case 'Uint8Array':
    case 'Uint8ClampedArray':
    case 'Int16Array':
    case 'Uint16Array':
    case 'Int32Array':
    case 'Uint32Array':
    case 'Float32Array':
    case 'Float64Array':
      break;
    case 'ArrayBuffer':
      break;
    default:
      // Values of other types are only equal if identical.
      return false;
  }

  var keysA = keys$3(a);
  if (keysA.length !== keys$3(b).length) {
    return false;
  }

  var idx = stackA.length - 1;
  while (idx >= 0) {
    if (stackA[idx] === a) {
      return stackB[idx] === b;
    }
    idx -= 1;
  }

  stackA.push(a);
  stackB.push(b);
  idx = keysA.length - 1;
  while (idx >= 0) {
    var key = keysA[idx];
    if (!(_has$4(key, b) && _equals$1(b[key], a[key], stackA, stackB))) {
      return false;
    }
    idx -= 1;
  }
  stackA.pop();
  stackB.pop();
  return true;
};

var _curry2$13 = _curry2$1;
var _equals = _equals$1;


/**
 * Returns `true` if its arguments are equivalent, `false` otherwise. Handles
 * cyclical data structures.
 *
 * Dispatches symmetrically to the `equals` methods of both arguments, if
 * present.
 *
 * @func
 * @memberOf R
 * @since v0.15.0
 * @category Relation
 * @sig a -> b -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @example
 *
 *      R.equals(1, 1); //=> true
 *      R.equals(1, '1'); //=> false
 *      R.equals([1, 2, 3], [1, 2, 3]); //=> true
 *
 *      var a = {}; a.v = a;
 *      var b = {}; b.v = b;
 *      R.equals(a, b); //=> true
 */
var equals = _curry2$13(function equals(a, b) {
  return _equals(a, b, [], []);
});

// Copyright (c) 2013-2014 Quildreen Motta <quildreen@gmail.com>
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/**
 * @module lib/either
 */
var either = Either$1;

// -- Aliases ----------------------------------------------------------
var clone         = Object.create;
var unimplemented = function(){ throw new Error('Not implemented.') };
var noop          = function(){ return this                         };


// -- Implementation ---------------------------------------------------

/**
 * The `Either(a, b)` structure represents the logical disjunction between `a`
 * and `b`. In other words, `Either` may contain either a value of type `a` or
 * a value of type `b`, at any given time. This particular implementation is
 * biased on the right value (`b`), thus projections will take the right value
 * over the left one.
 *
 * This class models two different cases: `Left a` and `Right b`, and can hold
 * one of the cases at any given time. The projections are, none the less,
 * biased for the `Right` case, thus a common use case for this structure is to
 * hold the results of computations that may fail, when you want to store
 * additional information on the failure (instead of throwing an exception).
 *
 * Furthermore, the values of `Either(a, b)` can be combined and manipulated by
 * using the expressive monadic operations. This allows safely sequencing
 * operations that may fail, and safely composing values that you don't know
 * whether they're present or not, failing early (returning a `Left a`) if any
 * of the operations fail.
 *
 * While this class can certainly model input validations, the [Validation][]
 * structure lends itself better to that use case, since it can naturally
 * aggregate failures — monads shortcut on the first failure.
 *
 * [Validation]: https://github.com/folktale/data.validation
 *
 *
 * @class
 * @summary
 * Either[α, β] <: Applicative[β]
 *               , Functor[β]
 *               , Chain[β]
 *               , Show
 *               , Eq
 */
function Either$1() { }

Left.prototype = clone(Either$1.prototype);
function Left(a) {
  this.value = a;
}

Right.prototype = clone(Either$1.prototype);
function Right(a) {
  this.value = a;
}

// -- Constructors -----------------------------------------------------

/**
 * Constructs a new `Either[α, β]` structure holding a `Left` value. This
 * usually represents a failure due to the right-bias of this structure.
 *
 * @summary a → Either[α, β]
 */
Either$1.Left = function(a) {
  return new Left(a)
};
Either$1.prototype.Left = Either$1.Left;

/**
 * Constructs a new `Either[α, β]` structure holding a `Right` value. This
 * usually represents a successful value due to the right bias of this
 * structure.
 *
 * @summary β → Either[α, β]
 */
Either$1.Right = function(a) {
  return new Right(a)
};
Either$1.prototype.Right = Either$1.Right;


// -- Conversions ------------------------------------------------------

/**
 * Constructs a new `Either[α, β]` structure from a nullable type.
 *
 * Takes the `Left` case if the value is `null` or `undefined`. Takes the
 * `Right` case otherwise.
 *
 * @summary α → Either[α, α]
 */
Either$1.fromNullable = function(a) {
  return a != null?       new Right(a)
  :      /* otherwise */  new Left(a)
};
Either$1.prototype.fromNullable = Either$1.fromNullable;

/**
 * Constructs a new `Either[α, β]` structure from a `Validation[α, β]` type.
 *
 * @summary Validation[α, β] → Either[α, β]
 */
Either$1.fromValidation = function(a) {
  return a.fold(Either$1.Left, Either$1.Right)
};

/**
 * Executes a synchronous computation that may throw and converts it to an
 * Either type.
 *
 * @summary (α₁, α₂, ..., αₙ -> β :: throws γ) -> (α₁, α₂, ..., αₙ -> Either[γ, β])
 */
Either$1.try = function(f) {
  return function() {
    try {
      return new Right(f.apply(null, arguments))
    } catch(e) {
      return new Left(e)
    }
  }
};


// -- Predicates -------------------------------------------------------

/**
 * True if the `Either[α, β]` contains a `Left` value.
 *
 * @summary Boolean
 */
Either$1.prototype.isLeft = false;
Left.prototype.isLeft   = true;

/**
 * True if the `Either[α, β]` contains a `Right` value.
 *
 * @summary Boolean
 */
Either$1.prototype.isRight = false;
Right.prototype.isRight  = true;


// -- Applicative ------------------------------------------------------

/**
 * Creates a new `Either[α, β]` instance holding the `Right` value `b`.
 *
 * `b` can be any value, including `null`, `undefined` or another
 * `Either[α, β]` structure.
 *
 * @summary β → Either[α, β]
 */
Either$1.of = function(a) {
  return new Right(a)
};
Either$1.prototype.of = Either$1.of;


/**
 * Applies the function inside the `Right` case of the `Either[α, β]` structure
 * to another applicative type.
 *
 * The `Either[α, β]` should contain a function value, otherwise a `TypeError`
 * is thrown.
 *
 * @method
 * @summary (@Either[α, β → γ], f:Applicative[_]) => f[β] → f[γ]
 */
Either$1.prototype.ap = unimplemented;

Left.prototype.ap = function(b) {
  return this
};

Right.prototype.ap = function(b) {
  return b.map(this.value)
};


// -- Functor ----------------------------------------------------------

/**
 * Transforms the `Right` value of the `Either[α, β]` structure using a regular
 * unary function.
 *
 * @method
 * @summary (@Either[α, β]) => (β → γ) → Either[α, γ]
 */
Either$1.prototype.map = unimplemented;
Left.prototype.map   = noop;

Right.prototype.map = function(f) {
  return this.of(f(this.value))
};


// -- Chain ------------------------------------------------------------

/**
 * Transforms the `Right` value of the `Either[α, β]` structure using an unary
 * function to monads.
 *
 * @method
 * @summary (@Either[α, β], m:Monad[_]) => (β → m[γ]) → m[γ]
 */
Either$1.prototype.chain = unimplemented;
Left.prototype.chain   = noop;

Right.prototype.chain = function(f) {
  return f(this.value)
};


// -- Show -------------------------------------------------------------

/**
 * Returns a textual representation of the `Either[α, β]` structure.
 *
 * @method
 * @summary (@Either[α, β]) => Void → String
 */
Either$1.prototype.toString = unimplemented;

Left.prototype.toString = function() {
  return 'Either.Left(' + this.value + ')'
};

Right.prototype.toString = function() {
  return 'Either.Right(' + this.value + ')'
};


// -- Eq ---------------------------------------------------------------

/**
 * Tests if an `Either[α, β]` structure is equal to another `Either[α, β]`
 * structure.
 *
 * @method
 * @summary (@Either[α, β]) => Either[α, β] → Boolean
 */
Either$1.prototype.isEqual = unimplemented;

Left.prototype.isEqual = function(a) {
  return a.isLeft && (a.value === this.value)
};

Right.prototype.isEqual = function(a) {
  return a.isRight && (a.value === this.value)
};


// -- Extracting and recovering ----------------------------------------

/**
 * Extracts the `Right` value out of the `Either[α, β]` structure, if it
 * exists. Otherwise throws a `TypeError`.
 *
 * @method
 * @summary (@Either[α, β]) => Void → β         :: partial, throws
 * @see {@link module:lib/either~Either#getOrElse} — A getter that can handle failures.
 * @see {@link module:lib/either~Either#merge} — The convergence of both values.
 * @throws {TypeError} if the structure has no `Right` value.
 */
Either$1.prototype.get = unimplemented;

Left.prototype.get = function() {
  throw new TypeError("Can't extract the value of a Left(a).")
};

Right.prototype.get = function() {
  return this.value
};


/**
 * Extracts the `Right` value out of the `Either[α, β]` structure. If the
 * structure doesn't have a `Right` value, returns the given default.
 *
 * @method
 * @summary (@Either[α, β]) => β → β
 */
Either$1.prototype.getOrElse = unimplemented;

Left.prototype.getOrElse = function(a) {
  return a
};

Right.prototype.getOrElse = function(_) {
  return this.value
};


/**
 * Transforms a `Left` value into a new `Either[α, β]` structure. Does nothing
 * if the structure contain a `Right` value.
 *
 * @method
 * @summary (@Either[α, β]) => (α → Either[γ, β]) → Either[γ, β]
 */
Either$1.prototype.orElse = unimplemented;
Right.prototype.orElse  = noop;

Left.prototype.orElse = function(f) {
  return f(this.value)
};


/**
 * Returns the value of whichever side of the disjunction that is present.
 *
 * @summary (@Either[α, α]) => Void → α
 */
Either$1.prototype.merge = function() {
  return this.value
};


// -- Folds and Extended Transformations -------------------------------

/**
 * Applies a function to each case in this data structure.
 *
 * @method
 * @summary (@Either[α, β]) => (α → γ), (β → γ) → γ
 */
Either$1.prototype.fold = unimplemented;

Left.prototype.fold = function(f, _) {
  return f(this.value)
};

Right.prototype.fold = function(_, g) {
  return g(this.value)
};

/**
 * Catamorphism.
 * 
 * @method
 * @summary (@Either[α, β]) => { Left: α → γ, Right: β → γ } → γ
 */
Either$1.prototype.cata = unimplemented;

Left.prototype.cata = function(pattern) {
  return pattern.Left(this.value)
};

Right.prototype.cata = function(pattern) {
  return pattern.Right(this.value)
};


/**
 * Swaps the disjunction values.
 *
 * @method
 * @summary (@Either[α, β]) => Void → Either[β, α]
 */
Either$1.prototype.swap = unimplemented;

Left.prototype.swap = function() {
  return this.Right(this.value)
};

Right.prototype.swap = function() {
  return this.Left(this.value)
};


/**
 * Maps both sides of the disjunction.
 *
 * @method
 * @summary (@Either[α, β]) => (α → γ), (β → δ) → Either[γ, δ]
 */
Either$1.prototype.bimap = unimplemented;

Left.prototype.bimap = function(f, _) {
  return this.Left(f(this.value))
};

Right.prototype.bimap = function(_, g) {
  return this.Right(g(this.value))
};


/**
 * Maps the left side of the disjunction.
 *
 * @method
 * @summary (@Either[α, β]) => (α → γ) → Either[γ, β]
 */
Either$1.prototype.leftMap = unimplemented;
Right.prototype.leftMap  = noop;

Left.prototype.leftMap = function(f) {
  return this.Left(f(this.value))
};

// Copyright (c) 2013-2014 Quildreen Motta <quildreen@gmail.com>
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var index = either;

/*  weak */
/* eslint-disable new-cap */
// [a] => Either String [a]
const isArray = arr => Array.isArray(arr) ? index.Right(arr) : index.Left(`Invalid states sent with importState. Expected Array but received ${ typeof arr }`); // eslint-disable-line max-len

const fieldTypeIsValid = curry$1((validTypes, field) => validTypes.find(equals(field.type)) ? index.Right(field) : index.Left(`Invalid field type ${ field.type }`));

const validFieldTypes = curry$1((validTypes, fieldsState) => traverse(index.of, fieldTypeIsValid(validTypes), fieldsState));

// [a] -> [a] -> Either String [a]
const validateFieldsState = curry$1((fieldsState, state) => index.of(fieldsState).chain(isArray).chain(validFieldTypes(state.fieldTypes.map(path(["info", "type"])))));

// Add required properties that are not managed by the field
// component but by the FormBuilder component itself, so may
// not be there.
// [a] => [a]
const addRequiredProperties = fieldStates => fieldStates.map(s => Object.assign({
  configShowing: false,
  id: createId(),
  required: false
}, s));

// If there are any problems with the import, the same state
// will be returned
var importState$1 = ((state, { newFieldsState }) => validateFieldsState(newFieldsState, state).map(addRequiredProperties).map(pushHistoryState(state)).bimap(console.error, identity).getOrElse(state));

var _reduced$1 = function _reduced$1(x) {
  return x && x['@@transducer/reduced'] ? x :
    {
      '@@transducer/value': x,
      '@@transducer/reduced': true
    };
};

var _curry2$16 = _curry2$1;
var _reduced = _reduced$1;
var _xfBase$3 = _xfBase$1;


var _xfind$1 = (function() {
  function XFind(f, xf) {
    this.xf = xf;
    this.f = f;
    this.found = false;
  }
  XFind.prototype['@@transducer/init'] = _xfBase$3.init;
  XFind.prototype['@@transducer/result'] = function(result) {
    if (!this.found) {
      result = this.xf['@@transducer/step'](result, void 0);
    }
    return this.xf['@@transducer/result'](result);
  };
  XFind.prototype['@@transducer/step'] = function(result, input) {
    if (this.f(input)) {
      this.found = true;
      result = _reduced(this.xf['@@transducer/step'](result, input));
    }
    return result;
  };

  return _curry2$16(function _xfind$1(f, xf) { return new XFind(f, xf); });
}());

var _curry2$15 = _curry2$1;
var _dispatchable$3 = _dispatchable$1;
var _xfind = _xfind$1;


/**
 * Returns the first element of the list which matches the predicate, or
 * `undefined` if no element matches.
 *
 * Dispatches to the `find` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> a | undefined
 * @param {Function} fn The predicate function used to determine if the element is the
 *        desired one.
 * @param {Array} list The array to consider.
 * @return {Object} The element found, or `undefined`.
 * @see R.transduce
 * @example
 *
 *      var xs = [{a: 1}, {a: 2}, {a: 3}];
 *      R.find(R.propEq('a', 2))(xs); //=> {a: 2}
 *      R.find(R.propEq('a', 4))(xs); //=> undefined
 */
var find = _curry2$15(_dispatchable$3('find', _xfind, function find(fn, list) {
  var idx = 0;
  var len = list.length;
  while (idx < len) {
    if (fn(list[idx])) {
      return list[idx];
    }
    idx += 1;
  }
}));

/**
 * A helper for delaying the execution of a function.
 * @private
 * @summary (Any... -> Any) -> Void
 */
var delayed = typeof setImmediate !== 'undefined'?  setImmediate
            : typeof process !== 'undefined'?       process.nextTick
            : /* otherwise */                       setTimeout;

/**
 * @module lib/task
 */
var task = Task$1;

// -- Implementation ---------------------------------------------------

/**
 * The `Task[α, β]` structure represents values that depend on time. This
 * allows one to model time-based effects explicitly, such that one can have
 * full knowledge of when they're dealing with delayed computations, latency,
 * or anything that can not be computed immediately.
 *
 * A common use for this structure is to replace the usual Continuation-Passing
 * Style form of programming, in order to be able to compose and sequence
 * time-dependent effects using the generic and powerful monadic operations.
 *
 * @class
 * @summary
 * ((α → Void), (β → Void) → Void), (Void → Void) → Task[α, β]
 *
 * Task[α, β] <: Chain[β]
 *               , Monad[β]
 *               , Functor[β]
 *               , Applicative[β]
 *               , Semigroup[β]
 *               , Monoid[β]
 *               , Show
 */
function Task$1(computation, cleanup) {
  this.fork = computation;

  this.cleanup = cleanup || function() {};
}

/**
 * Constructs a new `Task[α, β]` containing the single value `β`.
 *
 * `β` can be any value, including `null`, `undefined`, or another
 * `Task[α, β]` structure.
 *
 * @summary β → Task[α, β]
 */
Task$1.prototype.of = function _of(b) {
  return new Task$1(function(_, resolve) {
    return resolve(b);
  });
};

Task$1.of = Task$1.prototype.of;

/**
 * Constructs a new `Task[α, β]` containing the single value `α`.
 *
 * `α` can be any value, including `null`, `undefined`, or another
 * `Task[α, β]` structure.
 *
 * @summary α → Task[α, β]
 */
Task$1.prototype.rejected = function _rejected(a) {
  return new Task$1(function(reject) {
    return reject(a);
  });
};

Task$1.rejected = Task$1.prototype.rejected;

// -- Functor ----------------------------------------------------------

/**
 * Transforms the successful value of the `Task[α, β]` using a regular unary
 * function.
 *
 * @summary @Task[α, β] => (β → γ) → Task[α, γ]
 */
Task$1.prototype.map = function _map(f) {
  var fork = this.fork;
  var cleanup = this.cleanup;

  return new Task$1(function(reject, resolve) {
    return fork(function(a) {
      return reject(a);
    }, function(b) {
      return resolve(f(b));
    });
  }, cleanup);
};

// -- Chain ------------------------------------------------------------

/**
 * Transforms the succesful value of the `Task[α, β]` using a function to a
 * monad.
 *
 * @summary @Task[α, β] => (β → Task[α, γ]) → Task[α, γ]
 */
Task$1.prototype.chain = function _chain(f) {
  var fork = this.fork;
  var cleanup = this.cleanup;

  return new Task$1(function(reject, resolve) {
    return fork(function(a) {
      return reject(a);
    }, function(b) {
      return f(b).fork(reject, resolve);
    });
  }, cleanup);
};

// -- Apply ------------------------------------------------------------

/**
 * Applys the successful value of the `Task[α, (β → γ)]` to the successful
 * value of the `Task[α, β]`
 *
 * @summary @Task[α, (β → γ)] => Task[α, β] → Task[α, γ]
 */

Task$1.prototype.ap = function _ap(that) {
  var forkThis = this.fork;
  var forkThat = that.fork;
  var cleanupThis = this.cleanup;
  var cleanupThat = that.cleanup;

  function cleanupBoth(state) {
    cleanupThis(state[0]);
    cleanupThat(state[1]);
  }

  return new Task$1(function(reject, resolve) {
    var func, funcLoaded = false;
    var val, valLoaded = false;
    var rejected = false;
    var allState;

    var thisState = forkThis(guardReject, guardResolve(function(x) {
      funcLoaded = true;
      func = x;
    }));

    var thatState = forkThat(guardReject, guardResolve(function(x) {
      valLoaded = true;
      val = x;
    }));

    function guardResolve(setter) {
      return function(x) {
        if (rejected) {
          return;
        }

        setter(x);
        if (funcLoaded && valLoaded) {
          delayed(function(){ cleanupBoth(allState); });
          return resolve(func(val));
        } else {
          return x;
        }
      }
    }

    function guardReject(x) {
      if (!rejected) {
        rejected = true;
        return reject(x);
      }
    }

    return allState = [thisState, thatState];
  }, cleanupBoth);
};

// -- Semigroup ------------------------------------------------------------

/**
 * Selects the earlier of the two tasks `Task[α, β]`
 *
 * @summary @Task[α, β] => Task[α, β] → Task[α, β]
 */

Task$1.prototype.concat = function _concat(that) {
  var forkThis = this.fork;
  var forkThat = that.fork;
  var cleanupThis = this.cleanup;
  var cleanupThat = that.cleanup;

  function cleanupBoth(state) {
    cleanupThis(state[0]);
    cleanupThat(state[1]);
  }

  return new Task$1(function(reject, resolve) {
    var done = false;
    var allState;
    var thisState = forkThis(guard(reject), guard(resolve));
    var thatState = forkThat(guard(reject), guard(resolve));

    return allState = [thisState, thatState];

    function guard(f) {
      return function(x) {
        if (!done) {
          done = true;
          delayed(function(){ cleanupBoth(allState); });
          return f(x);
        }
      };
    }
  }, cleanupBoth);

};

// -- Monoid ------------------------------------------------------------

/**
 * Returns a Task that will never resolve
 *
 * @summary Void → Task[α, _]
 */
Task$1.empty = function _empty() {
  return new Task$1(function() {});
};

Task$1.prototype.empty = Task$1.empty;

// -- Show -------------------------------------------------------------

/**
 * Returns a textual representation of the `Task[α, β]`
 *
 * @summary @Task[α, β] => Void → String
 */
Task$1.prototype.toString = function _toString() {
  return 'Task';
};

// -- Extracting and recovering ----------------------------------------

/**
 * Transforms a failure value into a new `Task[α, β]`. Does nothing if the
 * structure already contains a successful value.
 *
 * @summary @Task[α, β] => (α → Task[γ, β]) → Task[γ, β]
 */
Task$1.prototype.orElse = function _orElse(f) {
  var fork = this.fork;
  var cleanup = this.cleanup;

  return new Task$1(function(reject, resolve) {
    return fork(function(a) {
      return f(a).fork(reject, resolve);
    }, function(b) {
      return resolve(b);
    });
  }, cleanup);
};

// -- Folds and extended transformations -------------------------------

/**
 * Catamorphism. Takes two functions, applies the leftmost one to the failure
 * value, and the rightmost one to the successful value, depending on which one
 * is present.
 *
 * @summary @Task[α, β] => (α → γ), (β → γ) → Task[δ, γ]
 */
Task$1.prototype.fold = function _fold(f, g) {
  var fork = this.fork;
  var cleanup = this.cleanup;

  return new Task$1(function(reject, resolve) {
    return fork(function(a) {
      return resolve(f(a));
    }, function(b) {
      return resolve(g(b));
    });
  }, cleanup);
};

/**
 * Catamorphism.
 *
 * @summary @Task[α, β] => { Rejected: α → γ, Resolved: β → γ } → Task[δ, γ]
 */
Task$1.prototype.cata = function _cata(pattern) {
  return this.fold(pattern.Rejected, pattern.Resolved);
};

/**
 * Swaps the disjunction values.
 *
 * @summary @Task[α, β] => Void → Task[β, α]
 */
Task$1.prototype.swap = function _swap() {
  var fork = this.fork;
  var cleanup = this.cleanup;

  return new Task$1(function(reject, resolve) {
    return fork(function(a) {
      return resolve(a);
    }, function(b) {
      return reject(b);
    });
  }, cleanup);
};

/**
 * Maps both sides of the disjunction.
 *
 * @summary @Task[α, β] => (α → γ), (β → δ) → Task[γ, δ]
 */
Task$1.prototype.bimap = function _bimap(f, g) {
  var fork = this.fork;
  var cleanup = this.cleanup;

  return new Task$1(function(reject, resolve) {
    return fork(function(a) {
      return reject(f(a));
    }, function(b) {
      return resolve(g(b));
    });
  }, cleanup);
};

/**
 * Maps the left side of the disjunction (failure).
 *
 * @summary @Task[α, β] => (α → γ) → Task[γ, β]
 */
Task$1.prototype.rejectedMap = function _rejectedMap(f) {
  var fork = this.fork;
  var cleanup = this.cleanup;

  return new Task$1(function(reject, resolve) {
    return fork(function(a) {
      return reject(f(a));
    }, function(b) {
      return resolve(b);
    });
  }, cleanup);
};

var index$1 = task;

// State -> String -> Either String Function
const typeConstructor = (state, fieldType) => {
  return index.of(state).map(prop$1("fieldTypes")).map(find(v => v.info.type === fieldType)).chain(index.fromNullable).bimap(_ => `Field "${ fieldType }" does not exist.`, identity);
};

// { initialState: Function } -> Task String Object
const createField$1 = constr => new index$1((reject, resolve) => {
  // Make sure the promise is only resolved once
  let called = false;
  const fieldState = constr.initialState();

  if (!(fieldState instanceof Promise)) {
    resolve(fieldState);
  } else {
    fieldState.then(v => {
      if (called) {
        return;
      }
      called = true;
      resolve(v);
    }).catch(v => {
      if (called) {
        throw v;
      }
      called = true;
      reject(v);
    });
  }
});

// Object -> Object
const insertRequiredProps = field => seamlessImmutable(field).merge({
  id: createId(),
  configShowing: true
}, {
  deep: true
});

const createFieldAsynchronously = (state, fieldType, asyncDispatch) => typeConstructor(state, fieldType).map(createField$1) // Either String (Task String Object)
.leftMap(index$1.rejected).merge() // Task String Object
.map(insertRequiredProps).fork( // execute task
err => console.error("Task rejected", err), pipe(fieldCreated, asyncDispatch));

// This is an async action. When it is finished it will trigger the
// field created action
var createField$2 = ((state, { fieldType, asyncDispatch }) => {
  createFieldAsynchronously(state, fieldType, asyncDispatch);
  return state;
});

var _concat$5 = _concat$2;
var _curry2$17 = _curry2$1;


/**
 * Returns a new list containing the contents of the given list, followed by
 * the given element.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig a -> [a] -> [a]
 * @param {*} el The element to add to the end of the new list.
 * @param {Array} list The list whose contents will be added to the beginning of the output
 *        list.
 * @return {Array} A new list containing the contents of the old list followed by `el`.
 * @see R.prepend
 * @example
 *
 *      R.append('tests', ['write', 'more']); //=> ['write', 'more', 'tests']
 *      R.append('tests', []); //=> ['tests']
 *      R.append(['tests'], ['write', 'more']); //=> ['write', 'more', ['tests']]
 */
var append = _curry2$17(function append(el, list) {
  return _concat$5(list, [el]);
});

// Copyright (c) 2013-2014 Quildreen Motta <quildreen@gmail.com>
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/**
 * @module lib/maybe
 */
var maybe = Maybe$1;

// -- Aliases ----------------------------------------------------------
var clone$1         = Object.create;
var unimplemented$1 = function(){ throw new Error('Not implemented.') };
var noop$1          = function(){ return this                         };

// -- Implementation ---------------------------------------------------

/**
 * A structure for values that may not be present, or computations that may
 * fail. `Maybe(a)` explicitly models the effects that are implicit in
 * `Nullable` types, thus has none of the problems associated with
 * `null` or `undefined` — like `NullPointerExceptions`.
 *
 * The class models two different cases:
 *
 *  + `Just a` — represents a `Maybe(a)` that contains a value. `a` may
 *     be any value, including `null` or `undefined`.
 *
 *  + `Nothing` — represents a `Maybe(a)` that has no values. Or a
 *     failure that needs no additional information.
 *
 * Common uses of this structure includes modelling values that may or may
 * not be present in a collection, thus instead of needing a
 * `collection.has(a)`, the `collection.get(a)` operation gives you all
 * the information you need — `collection.get(a).is-nothing` being
 * equivalent to `collection.has(a)`; Similarly the same reasoning may
 * be applied to computations that may fail to provide a value, e.g.:
 * `collection.find(predicate)` can safely return a `Maybe(a)` instance,
 * even if the collection contains nullable values.
 *
 * Furthermore, the values of `Maybe(a)` can be combined and manipulated
 * by using the expressive monadic operations. This allows safely
 * sequencing operations that may fail, and safely composing values that
 * you don't know whether they're present or not, failing early
 * (returning a `Nothing`) if any of the operations fail.
 *
 * If one wants to store additional information about failures, the
 * [Either][] and [Validation][] structures provide such a capability, and
 * should be used instead of the `Maybe(a)` structure.
 *
 * [Either]: https://github.com/folktale/data.either
 * [Validation]: https://github.com/folktale/data.validation
 *
 *
 * @class
 */
function Maybe$1() {}

// The case for successful values
Just.prototype = clone$1(Maybe$1.prototype);
function Just(a){
  this.value = a;
}

// The case for failure values
Nothing.prototype = clone$1(Maybe$1.prototype);
function Nothing(){}


// -- Constructors -----------------------------------------------------

/**
 * Constructs a new `Maybe[α]` structure with an absent value. Commonly used
 * to represent a failure.
 *
 * @summary Void → Maybe[α]
 */
Maybe$1.Nothing = function() {
  return new Nothing
};
Maybe$1.prototype.Nothing = Maybe$1.Nothing;

/**
 * Constructs a new `Maybe[α]` structure that holds the single value
 * `α`. Commonly used to represent a success.
 *
 * `α` can be any value, including `null`, `undefined` or another
 * `Maybe[α]` structure.
 *
 * @summary α → Maybe[α]
 */
Maybe$1.Just = function(a) {
  return new Just(a)
};
Maybe$1.prototype.Just = Maybe$1.Just;


// -- Conversions ------------------------------------------------------

/**
 * Constructs a new `Maybe[α]` structure from a nullable type.
 *
 * If the value is either `null` or `undefined`, this function returns a
 * `Nothing`, otherwise the value is wrapped in a `Just(α)`.
 *
 * @summary α → Maybe[α]
 */
Maybe$1.fromNullable = function(a) {
  return a != null?       new Just(a)
  :      /* otherwise */  new Nothing
};
Maybe$1.prototype.fromNullable = Maybe$1.fromNullable;

/**
 * Constructs a new `Maybe[β]` structure from an `Either[α, β]` type.
 *
 * The left side of the `Either` becomes `Nothing`, and the right side
 * is wrapped in a `Just(β)`.
 *
 * @summary Either[α, β] → Maybe[β]
 */
Maybe$1.fromEither = function(a) {
  return a.fold(Maybe$1.Nothing, Maybe$1.Just)
};
Maybe$1.prototype.fromEither = Maybe$1.fromEither;

/**
 * Constructs a new `Maybe[β]` structure from a `Validation[α, β]` type.
 *
 * The failure side of the `Validation` becomes `Nothing`, and the right
 * side is wrapped in a `Just(β)`.
 *
 * @method
 * @summary Validation[α, β] → Maybe[β]
 */
Maybe$1.fromValidation           = Maybe$1.fromEither;
Maybe$1.prototype.fromValidation = Maybe$1.fromEither;


// -- Predicates -------------------------------------------------------

/**
 * True if the `Maybe[α]` structure contains a failure (i.e.: `Nothing`).
 *
 * @summary Boolean
 */
Maybe$1.prototype.isNothing   = false;
Nothing.prototype.isNothing = true;


/**
 * True if the `Maybe[α]` structure contains a single value (i.e.: `Just(α)`).
 *
 * @summary Boolean
 */
Maybe$1.prototype.isJust = false;
Just.prototype.isJust  = true;


// -- Applicative ------------------------------------------------------

/**
 * Creates a new `Maybe[α]` structure holding the single value `α`.
 *
 * `α` can be any value, including `null`, `undefined`, or another
 * `Maybe[α]` structure.
 *
 * @summary α → Maybe[α]
 */
Maybe$1.of = function(a) {
  return new Just(a)
};
Maybe$1.prototype.of = Maybe$1.of;


/**
 * Applies the function inside the `Maybe[α]` structure to another
 * applicative type.
 *
 * The `Maybe[α]` structure should contain a function value, otherwise a
 * `TypeError` is thrown.
 *
 * @method
 * @summary (@Maybe[α → β], f:Applicative[_]) => f[α] → f[β]
 */
Maybe$1.prototype.ap = unimplemented$1;

Nothing.prototype.ap = noop$1;

Just.prototype.ap = function(b) {
  return b.map(this.value)
};




// -- Functor ----------------------------------------------------------

/**
 * Transforms the value of the `Maybe[α]` structure using a regular unary
 * function.
 *
 * @method
 * @summary @Maybe[α] => (α → β) → Maybe[β]
 */
Maybe$1.prototype.map   = unimplemented$1;
Nothing.prototype.map = noop$1;

Just.prototype.map = function(f) {
  return this.of(f(this.value))
};


// -- Chain ------------------------------------------------------------

/**
 * Transforms the value of the `Maybe[α]` structure using an unary function
 * to monads.
 *
 * @method
 * @summary (@Maybe[α], m:Monad[_]) => (α → m[β]) → m[β]
 */
Maybe$1.prototype.chain   = unimplemented$1;
Nothing.prototype.chain = noop$1;

Just.prototype.chain = function(f) {
  return f(this.value)
};


// -- Show -------------------------------------------------------------

/**
 * Returns a textual representation of the `Maybe[α]` structure.
 *
 * @method
 * @summary @Maybe[α] => Void → String
 */
Maybe$1.prototype.toString = unimplemented$1;

Nothing.prototype.toString = function() {
  return 'Maybe.Nothing'
};

Just.prototype.toString = function() {
  return 'Maybe.Just(' + this.value + ')'
};


// -- Eq ---------------------------------------------------------------

/**
 * Tests if a `Maybe[α]` structure is equal to another `Maybe[α]` structure.
 *
 * @method
 * @summary @Maybe[α] => Maybe[α] → Boolean
 */
Maybe$1.prototype.isEqual = unimplemented$1;

Nothing.prototype.isEqual = function(b) {
  return b.isNothing
};

Just.prototype.isEqual = function(b) {
  return b.isJust
  &&     b.value === this.value
};


// -- Extracting and recovering ----------------------------------------

/**
 * Extracts the value out of the `Maybe[α]` structure, if it
 * exists. Otherwise throws a `TypeError`.
 *
 * @method
 * @summary @Maybe[α] => Void → a,      :: partial, throws
 * @see {@link module:lib/maybe~Maybe#getOrElse} — A getter that can handle failures
 * @throws {TypeError} if the structure has no value (`Nothing`).
 */
Maybe$1.prototype.get = unimplemented$1;

Nothing.prototype.get = function() {
  throw new TypeError("Can't extract the value of a Nothing.")
};

Just.prototype.get = function() {
  return this.value
};


/**
 * Extracts the value out of the `Maybe[α]` structure. If there is no value,
 * returns the given default.
 *
 * @method
 * @summary @Maybe[α] => α → α
 */
Maybe$1.prototype.getOrElse = unimplemented$1;

Nothing.prototype.getOrElse = function(a) {
  return a
};

Just.prototype.getOrElse = function(_) {
  return this.value
};


/**
 * Transforms a failure into a new `Maybe[α]` structure. Does nothing if the
 * structure already contains a value.
 *
 * @method
 * @summary @Maybe[α] => (Void → Maybe[α]) → Maybe[α]
 */
Maybe$1.prototype.orElse = unimplemented$1;

Nothing.prototype.orElse = function(f) {
  return f()
};

Just.prototype.orElse = function(_) {
  return this
};


/**
 * Catamorphism.
 * 
 * @method
 * @summary @Maybe[α] => { Nothing: Void → β, Just: α → β } → β
 */
Maybe$1.prototype.cata = unimplemented$1;

Nothing.prototype.cata = function(pattern) {
  return pattern.Nothing()
};

Just.prototype.cata = function(pattern) {
  return pattern.Just(this.value);
};


/**
 * JSON serialisation
 *
 * @method
 * @summary @Maybe[α] => Void → Object
 */
Maybe$1.prototype.toJSON = unimplemented$1;

Nothing.prototype.toJSON = function() {
  return { '#type': 'folktale:Maybe.Nothing' }
};

Just.prototype.toJSON = function() {
  return { '#type': 'folktale:Maybe.Just'
         , value: this.value }
};

// Copyright (c) 2013-2014 Quildreen Motta <quildreen@gmail.com>
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var index$2 = maybe;

// State -> Object -> State
const historyStateWithNewField = curry$1((state, newField) => pipe(hideConfigs, over(StateLenses.fieldsState, append(newField)))(state));

var fieldCreated$1 = ((state, { createdFieldState }) => index$2.fromNullable(createdFieldState).map(historyStateWithNewField(state)).map(prop$1("fieldsState")).map(pushHistoryState(state)).getOrElse(state));

const toggleConfig$1 = fieldState => seamlessImmutable(fieldState).set("configShowing", !fieldState.configShowing);

const replaceFieldState = curry$1((state, fieldState) => state.fieldsState.map(aField => aField.id === fieldState.id ? fieldState : aField));

var toggleConfig$2 = ((state, { fieldState }) => index$2.fromNullable(fieldState).map(toggleConfig$1).map(replaceFieldState(state)).map(pushHistoryState(state)).getOrElse(state));

/* eslint-disable no-nested-ternary */
const actionHandlers = {
  undo: undo$1,
  importState: importState$1,
  createField: createField$2,
  fieldCreated: fieldCreated$1,
  toggleConfig: toggleConfig$2
};

const isExpectedAction = a => a && a.type && actionHandlers[a.type];
const isReduxAction = a => a && a.type && a.type.includes("@@redux");

const update = (state, action) => isExpectedAction(action) ? actionHandlers[action.type](state, action) : isReduxAction(action) ? state : assert(false, `Invalid action type: ${ action.type }`);

/* eslint-env jasmine */

const currentFieldsState = ["current"];
const oldFieldsState = ["old"];
const mockState = {
  fieldTypes: [],
  fieldsState: currentFieldsState,
  fieldsStateHistory: [oldFieldsState]
};

const emptyMockState = {
  fieldTypes: [],
  fieldsState: [],
  fieldsStateHistory: []
};

const emptyHistoryMockState = {
  fieldTypes: [],
  fieldsState: currentFieldsState,
  fieldsStateHistory: []
};

describe("Update.undo", () => {
  it("removes first old state from history", () => {
    const modifiedState = update(mockState, undo());
    expect(modifiedState.fieldsStateHistory.length).toEqual(0);
  });

  it("sets first old state as current state", () => {
    const modifiedState = update(mockState, undo());
    expect(modifiedState.fieldsState).toEqual(oldFieldsState);
  });

  it("doesn't modify the state if there aren't more history states to undo", () => {
    const modifiedState = update(emptyMockState, undo());
    expect(modifiedState).toEqual(emptyMockState);
  });

  it("set's the current state to empty if there are no more history states", () => {
    const modifiedState = update(emptyHistoryMockState, undo());
    expect(modifiedState.fieldsState.length).toEqual(0);
  });
});

/* eslint-env jasmine */
/* eslint-disable quote-props */

const typesArray = [{
  "info": {
    "type": "RadioButtons"
  }
}, {
  "info": {
    "type": "Checkboxes"
  }
}, {
  "info": {
    "type": "Dropdown"
  }
}, {
  "info": {
    "type": "TextBox"
  }
}, {
  "info": {
    "type": "EmailBox"
  }
}, {
  "info": {
    "type": "TelephoneBox"
  }
}, {
  "info": {
    "type": "NumberBox"
  }
}, {
  "info": {
    "type": "TextArea"
  }
}, {
  "info": {
    "type": "DateField"
  }
}];

const mockCurrentState = ["a", "b"];
const mockHistory = [];
const mockState$1 = {
  fieldTypes: typesArray,
  fieldsState: mockCurrentState,
  fieldsStateHistory: mockHistory
};

const newValidState = [{
  "type": "Checkboxes",
  "displayName": "Checkboxes",
  "group": "Options Components",
  "htmlInputType": "checkbox",
  "title": "Add a title",
  "options": [{
    "caption": "Insert an option"
  }],
  "newOptionCaption": ""
}];

const newInvalidState = [{
  "type": "Invalid type",
  "displayName": "Checkboxes",
  "group": "Options Components",
  "htmlInputType": "checkbox",
  "title": "Add a title",
  "options": [{
    "caption": "Insert an option"
  }],
  "newOptionCaption": ""
}];

describe("Update.importState", () => {
  it("Returns an unchanged array if the new state is invalid", () => {
    expect(update(mockState$1, importState({}))).toEqual(mockState$1);
    expect(update(mockState$1, importState(null))).toEqual(mockState$1);
  });

  it("Returns an unchanged array if the a field's type is not in fieldTypes", () => {
    expect(update(mockState$1, importState(newInvalidState))).toEqual(mockState$1);
  });

  it("Sends the last current state to the history", () => {
    const updated = update(mockState$1, importState(newValidState));
    expect(updated.fieldsStateHistory[0].toString()).toEqual(mockCurrentState.toString());
    expect(updated.fieldsStateHistory.length).toEqual(mockHistory.length + 1);
  });

  it("Sets the new state as current", () => {
    const updated = update(mockState$1, importState(newValidState));
    expect(updated.fieldsState[0].type).toEqual(newValidState[0].type);
    expect(updated.fieldsState[0].type).not.toEqual(undefined);
    expect(updated.fieldsState[0].displayName).toEqual(newValidState[0].displayName);
    expect(updated.fieldsState[0].displayName).not.toEqual(undefined);
    expect(updated.fieldsState[0].group).toEqual(newValidState[0].group);
    expect(updated.fieldsState[0].group).not.toEqual(undefined);
  });
});

/* eslint-env jasmine */
/* eslint-disable quote-props */

const promiseTypeInstance = { type: "promise-instance" };
const promiseType = {
  info: { type: "PromiseType" },
  initialState: () => Promise.resolve(promiseTypeInstance)
};

const syncTypeInstance = { type: "sync-instance" };
const syncType = {
  info: { type: "SyncType" },
  initialState: () => syncTypeInstance
};

const typesArray$1 = [promiseType, syncType];
const mockCurrentState$1 = ["a", "b"];
const mockHistory$1 = [];
const mockState$2 = {
  fieldTypes: typesArray$1,
  fieldsState: mockCurrentState$1,
  fieldsStateHistory: mockHistory$1
};

describe("Update.createField", () => {
  it("creates fields asynchronously", done => {
    const asyncDispatch = v => {
      expect(v).not.toEqual(undefined);
      done();
    };

    const asyncAcion = Object.assign({ asyncDispatch }, createField(syncType.info.type));

    update(mockState$2, asyncAcion);
  });

  it("returns a 'fieldCreated' action when field is created", done => {
    const asyncDispatch = action => {
      expect(action.type).toEqual("fieldCreated");
      done();
    };

    const asyncAcion = Object.assign({ asyncDispatch }, createField(syncType.info.type));

    update(mockState$2, asyncAcion);
  });

  it("creates types with constructors that return a plain object", done => {
    const asyncDispatch = action => {
      expect(action.createdFieldState).not.toEqual(undefined);
      expect(action.createdFieldState.type).toEqual(syncTypeInstance.type);
      done();
    };

    const asyncAcion = Object.assign({ asyncDispatch }, createField(syncType.info.type));

    update(mockState$2, asyncAcion);
  });

  it("creates types with constructors that return a promise", done => {
    const asyncDispatch = action => {
      expect(action.createdFieldState).not.toEqual(undefined);
      expect(action.createdFieldState.type).toEqual(promiseTypeInstance.type);
      done();
    };

    const asyncAcion = Object.assign({ asyncDispatch }, createField(promiseType.info.type));

    update(mockState$2, asyncAcion);
  });

  it("adds required fields to instance", done => {
    const asyncDispatch = action => {
      expect(action.createdFieldState.id).not.toEqual(undefined);
      expect(typeof action.createdFieldState.configShowing).toEqual("boolean");
      done();
    };

    const asyncAcion = Object.assign({ asyncDispatch }, createField(promiseType.info.type));

    update(mockState$2, asyncAcion);
  });

  it("does not create a field if type is not in model.fieldTypes", done => {
    const asyncDispatch = jasmine.createSpy("asyncDispatch");

    const asyncAcion = Object.assign({ asyncDispatch }, createField("non-existing-type"));

    update(mockState$2, asyncAcion);

    setTimeout(() => {
      expect(asyncDispatch).not.toHaveBeenCalled();done();
    }, 50);
  });
});

/* eslint-env jasmine */
/* eslint-disable quote-props */

const createdFieldState = { type: "fictitious-instance" };
const mockCurrentState$2 = ["a", "b"];
const mockHistory$2 = [];
const mockState$3 = {
  fieldTypes: [{ info: { type: "fictitious-instance" } }],
  fieldsState: mockCurrentState$2,
  fieldsStateHistory: mockHistory$2
};

const fieldCreatedAction = fieldCreated(createdFieldState);
const newState = update(mockState$3, fieldCreatedAction);

describe("Update.fieldCreated", () => {
  it("outputs a field with the new state included", () => {
    expect(newState.fieldsState.length).toEqual(mockState$3.fieldsState.length + 1);
    expect(newState.fieldsState.find(v => v.type === createdFieldState.type)).not.toEqual(undefined);
  });

  it("sends the current state to history", () => {
    expect(newState.fieldsStateHistory[0][0]).toEqual(mockCurrentState$2[0]);
    expect(newState.fieldsStateHistory[0][1]).toEqual(mockCurrentState$2[1]);
  });

  it("Returns the current state if no new field is given to it", () => {
    const sameState = update(mockState$3, fieldCreated(null));
    expect(sameState.fieldTypes.length).toEqual(mockState$3.fieldTypes.length);
    expect(sameState.fieldsState.length).toEqual(mockState$3.fieldsState.length);
    expect(sameState.fieldsStateHistory.length).toEqual(mockState$3.fieldsStateHistory.length);
  });

  it("does not break the state after creating one object", () => {
    const changed1 = update(mockState$3, fieldCreated(createdFieldState));
    const changed2 = update(changed1, fieldCreated(createdFieldState));
    const changed3 = update(changed2, fieldCreated(createdFieldState));
    expect(changed3.fieldTypes.length).toEqual(mockState$3.fieldTypes.length);
    expect(changed3.fieldsState.length).toEqual(mockCurrentState$2.length + 3);
    expect(changed3.fieldsStateHistory.length).toEqual(3);
  });
});

/* eslint-env jasmine */

const fieldStateConfigShowing = {
  id: 123,
  configShowing: true
};

const fieldStateConfigNotShowing = {
  id: 321,
  configShowing: false
};

const mockState$4 = {
  fieldTypes: [],
  fieldsState: [fieldStateConfigShowing, fieldStateConfigNotShowing],
  fieldsStateHistory: []
};

describe("Update.toggleConfig", () => {
  it("turns the config option to false when needed", () => {
    const modifiedState = update(mockState$4, toggleConfig(fieldStateConfigShowing));
    expect(modifiedState.fieldsState.find(f => f.id === fieldStateConfigShowing.id).configShowing).toEqual(false);
  });

  it("turns the config option to true when needed", () => {
    const modifiedState = update(mockState$4, toggleConfig(fieldStateConfigNotShowing));
    expect(modifiedState.fieldsState.find(f => f.id === fieldStateConfigShowing.id).configShowing).toEqual(true);
  });

  it("adds the last state to the history", () => {
    const modifiedState = update(mockState$4, toggleConfig(fieldStateConfigShowing));
    expect(modifiedState.fieldsStateHistory.length).toEqual(1);
    expect(modifiedState.fieldsStateHistory[0][0].id).toEqual(mockState$4.fieldsState[0].id);
    expect(modifiedState.fieldsStateHistory[0][1].id).toEqual(mockState$4.fieldsState[1].id);
  });
});

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvc3JjL2pzL0FjdGlvbnMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy90ZXN0cy9hY3Rpb25zLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvc2VhbWxlc3MtaW1tdXRhYmxlL3NyYy9zZWFtbGVzcy1pbW11dGFibGUuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy9qcy91dGlscy9hc3luY0Rpc3BhdGNoTWlkZGxld2FyZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvc3JjL3Rlc3RzL3V0aWxzLmFzeW5jRGlzcGF0Y2hNaWRkbGV3YXJlLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvZmwtYXNzZXJ0L2Rpc3QvYXNzZXJ0LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19pc0FycmF5LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19zbGljZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9fY2hlY2tGb3JNZXRob2QuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX2lzUGxhY2Vob2xkZXIuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX2N1cnJ5MS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9fY3VycnkyLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19jdXJyeTMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvc2xpY2UuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvb3Zlci5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9hbHdheXMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvc2V0LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19hcml0eS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9fcGlwZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9feHdyYXAuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvYmluZC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9faXNTdHJpbmcuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaXNBcnJheUxpa2UuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX3JlZHVjZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9yZWR1Y2UuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvdGFpbC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9waXBlLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19jb25jYXQuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvcHJlcGVuZC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9wcm9wLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19pc1RyYW5zZm9ybWVyLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19kaXNwYXRjaGFibGUuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX21hcC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9feGZCYXNlLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL194bWFwLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19jdXJyeU4uanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvY3VycnlOLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19oYXMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX2lzQXJndW1lbnRzLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2tleXMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvbWFwLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2xlbnMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvY3VycnkuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy9qcy9VcGRhdGUvdXRpbHMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy9qcy9VcGRhdGUvdW5kby5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9faWRlbnRpdHkuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaWRlbnRpdHkuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvcGF0aC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9hcC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9yZWR1Y2VSaWdodC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9zZXF1ZW5jZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy90cmF2ZXJzZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9fYXJyYXlGcm9tSXRlcmF0b3IuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX2Z1bmN0aW9uTmFtZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pZGVudGljYWwuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvdHlwZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9fZXF1YWxzLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2VxdWFscy5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL2RhdGEuZWl0aGVyL2xpYi9laXRoZXIuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9kYXRhLmVpdGhlci9saWIvaW5kZXguanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy9qcy9VcGRhdGUvaW1wb3J0U3RhdGUuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX3JlZHVjZWQuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX3hmaW5kLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ZpbmQuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9kYXRhLnRhc2svbGliL3Rhc2suanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9kYXRhLnRhc2svbGliL2luZGV4LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9zcmMvanMvVXBkYXRlL2NyZWF0ZUZpZWxkLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2FwcGVuZC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL2RhdGEubWF5YmUvbGliL21heWJlLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvZGF0YS5tYXliZS9saWIvaW5kZXguanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy9qcy9VcGRhdGUvZmllbGRDcmVhdGVkLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9zcmMvanMvVXBkYXRlL2ZpZWxkLnRvZ2dsZUNvbmZpZy5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvc3JjL2pzL1VwZGF0ZS9pbmRleC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvc3JjL3Rlc3RzL3VwZGF0ZS91bmRvLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9zcmMvdGVzdHMvdXBkYXRlL2ltcG9ydFN0YXRlLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9zcmMvdGVzdHMvdXBkYXRlL2NyZWF0ZUZpZWxkLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9zcmMvdGVzdHMvdXBkYXRlL2ZpZWxkQ3JlYXRlZC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvc3JjL3Rlc3RzL3VwZGF0ZS9maWVsZC50b2dnbGVDb25maWcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy9cbi8vICAgIEFDVElPTiBDUkVBVE9SU1xuLy9cblxuZXhwb3J0IGNvbnN0IHVuZG8gPSBfID0+XG4oe1xuICB0eXBlOiBcInVuZG9cIixcbn0pO1xuXG5leHBvcnQgY29uc3QgaW1wb3J0U3RhdGUgPSBuZXdGaWVsZHNTdGF0ZSA9PlxuKHtcbiAgdHlwZTogXCJpbXBvcnRTdGF0ZVwiLFxuICBuZXdGaWVsZHNTdGF0ZSxcbn0pO1xuXG5leHBvcnQgY29uc3QgY3JlYXRlRmllbGQgPSBmaWVsZFR5cGUgPT5cbih7XG4gIHR5cGU6IFwiY3JlYXRlRmllbGRcIixcbiAgZmllbGRUeXBlLFxufSk7XG5cbmV4cG9ydCBjb25zdCBmaWVsZENyZWF0ZWQgPSBjcmVhdGVkRmllbGRTdGF0ZSA9PlxuKHtcbiAgdHlwZTogXCJmaWVsZENyZWF0ZWRcIixcbiAgY3JlYXRlZEZpZWxkU3RhdGUsXG59KTtcblxuZXhwb3J0IGNvbnN0IHRvZ2dsZUNvbmZpZyA9IGZpZWxkU3RhdGUgPT5cbih7XG4gIHR5cGU6IFwidG9nZ2xlQ29uZmlnXCIsXG4gIGZpZWxkU3RhdGUsXG59KTtcbiIsIi8qIGVzbGludC1lbnYgamFzbWluZSAqL1xuXG5pbXBvcnQge1xuICB1bmRvLFxuICBpbXBvcnRTdGF0ZSxcbiAgY3JlYXRlRmllbGQsXG4gIGZpZWxkQ3JlYXRlZCxcbiAgdG9nZ2xlQ29uZmlnLFxufSBmcm9tIFwiLi4vanMvQWN0aW9uc1wiO1xuXG5kZXNjcmliZShcIkFjdGlvblwiLCAoKSA9PiB7XG4gIGRlc2NyaWJlKFwidW5kb1wiLCAoKSA9PiB7XG4gICAgaXQoXCJyZXR1cm5zIHRoZSBjb3JyZWN0IGFjdGlvbiB0eXBlXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IHVuZG8oKTtcbiAgICAgIGV4cGVjdChhY3Rpb24udHlwZSkudG9FcXVhbChcInVuZG9cIik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKFwiaW1wb3J0U3RhdGVcIiwgKCkgPT4ge1xuICAgIGNvbnN0IG1vY2tTdGF0ZVRvSW1wb3J0ID0gW1wiYVwiLCBcImJcIl07XG5cbiAgICBpdChcInJldHVybnMgdGhlIGNvcnJlY3QgYWN0aW9uIHR5cGVcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uID0gaW1wb3J0U3RhdGUobW9ja1N0YXRlVG9JbXBvcnQpO1xuICAgICAgZXhwZWN0KGFjdGlvbi50eXBlKS50b0VxdWFsKFwiaW1wb3J0U3RhdGVcIik7XG4gICAgfSk7XG5cbiAgICBpdChcIkNyZWF0ZXMgdGhlIGNvcnJlY3QgdmFyaWFibGVzXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IGltcG9ydFN0YXRlKG1vY2tTdGF0ZVRvSW1wb3J0KTtcbiAgICAgIGV4cGVjdChhY3Rpb24ubmV3RmllbGRzU3RhdGUpLnRvRXF1YWwobW9ja1N0YXRlVG9JbXBvcnQpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZShcImNyZWF0ZUZpZWxkXCIsICgpID0+IHtcbiAgICBjb25zdCBmaWVsZFR5cGUgPSBcInRlc3RGaWVsZFwiO1xuXG4gICAgaXQoXCJyZXR1cm5zIHRoZSBjb3JyZWN0IGFjdGlvbiB0eXBlXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IGNyZWF0ZUZpZWxkKGZpZWxkVHlwZSk7XG4gICAgICBleHBlY3QoYWN0aW9uLnR5cGUpLnRvRXF1YWwoXCJjcmVhdGVGaWVsZFwiKTtcbiAgICB9KTtcblxuICAgIGl0KFwiQ3JlYXRlcyB0aGUgY29ycmVjdCB2YXJpYWJsZXNcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uID0gY3JlYXRlRmllbGQoZmllbGRUeXBlKTtcbiAgICAgIGV4cGVjdChhY3Rpb24uZmllbGRUeXBlKS50b0VxdWFsKGZpZWxkVHlwZSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKFwiZmllbGRDcmVhdGVkXCIsICgpID0+IHtcbiAgICBjb25zdCBjcmVhdGVkRmllbGRTdGF0ZSA9IHt9O1xuXG4gICAgaXQoXCJyZXR1cm5zIHRoZSBjb3JyZWN0IGFjdGlvbiB0eXBlXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IGZpZWxkQ3JlYXRlZChjcmVhdGVkRmllbGRTdGF0ZSk7XG4gICAgICBleHBlY3QoYWN0aW9uLnR5cGUpLnRvRXF1YWwoXCJmaWVsZENyZWF0ZWRcIik7XG4gICAgfSk7XG5cbiAgICBpdChcIkNyZWF0ZXMgdGhlIGNvcnJlY3QgdmFyaWFibGVzXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IGZpZWxkQ3JlYXRlZChjcmVhdGVkRmllbGRTdGF0ZSk7XG4gICAgICBleHBlY3QoYWN0aW9uLmNyZWF0ZWRGaWVsZFN0YXRlKS50b0VxdWFsKGNyZWF0ZWRGaWVsZFN0YXRlKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoXCJ0b2dnbGVDb25maWdcIiwgKCkgPT4ge1xuICAgIGNvbnN0IGZpZWxkU3RhdGUgPSB7fTtcblxuICAgIGl0KFwicmV0dXJucyB0aGUgY29ycmVjdCBhY3Rpb24gdHlwZVwiLCAoKSA9PiB7XG4gICAgICBjb25zdCBhY3Rpb24gPSB0b2dnbGVDb25maWcoZmllbGRTdGF0ZSk7XG4gICAgICBleHBlY3QoYWN0aW9uLnR5cGUpLnRvRXF1YWwoXCJ0b2dnbGVDb25maWdcIik7XG4gICAgfSk7XG5cbiAgICBpdChcIkNyZWF0ZXMgdGhlIGNvcnJlY3QgdmFyaWFibGVzXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IHRvZ2dsZUNvbmZpZyhmaWVsZFN0YXRlKTtcbiAgICAgIGV4cGVjdChhY3Rpb24uZmllbGRTdGF0ZSkudG9FcXVhbChmaWVsZFN0YXRlKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiIsIihmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIGltbXV0YWJsZUluaXQoY29uZmlnKSB7XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2Jsb2IvdjE1LjAuMS9zcmMvaXNvbW9ycGhpYy9jbGFzc2ljL2VsZW1lbnQvUmVhY3RFbGVtZW50LmpzI0wyMVxuICB2YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuZm9yICYmIFN5bWJvbC5mb3IoJ3JlYWN0LmVsZW1lbnQnKTtcbiAgdmFyIFJFQUNUX0VMRU1FTlRfVFlQRV9GQUxMQkFDSyA9IDB4ZWFjNztcblxuICB2YXIgZ2xvYmFsQ29uZmlnID0ge1xuICAgIHVzZV9zdGF0aWM6IGZhbHNlXG4gIH07XG4gIGlmIChpc09iamVjdChjb25maWcpKSB7XG4gICAgICBpZiAoY29uZmlnLnVzZV9zdGF0aWMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGdsb2JhbENvbmZpZy51c2Vfc3RhdGljID0gQm9vbGVhbihjb25maWcudXNlX3N0YXRpYyk7XG4gICAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpc09iamVjdChkYXRhKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyAmJlxuICAgICAgIUFycmF5LmlzQXJyYXkoZGF0YSkgJiZcbiAgICAgIGRhdGEgIT09IG51bGxcbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5zdGFudGlhdGVFbXB0eU9iamVjdChvYmopIHtcbiAgICAgIHZhciBwcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKTtcbiAgICAgIGlmICghcHJvdG90eXBlKSB7XG4gICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShwcm90b3R5cGUpO1xuICAgICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYWRkUHJvcGVydHlUbyh0YXJnZXQsIG1ldGhvZE5hbWUsIHZhbHVlKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgbWV0aG9kTmFtZSwge1xuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHZhbHVlXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBiYW5Qcm9wZXJ0eSh0YXJnZXQsIG1ldGhvZE5hbWUpIHtcbiAgICBhZGRQcm9wZXJ0eVRvKHRhcmdldCwgbWV0aG9kTmFtZSwgZnVuY3Rpb24oKSB7XG4gICAgICB0aHJvdyBuZXcgSW1tdXRhYmxlRXJyb3IoXCJUaGUgXCIgKyBtZXRob2ROYW1lICtcbiAgICAgICAgXCIgbWV0aG9kIGNhbm5vdCBiZSBpbnZva2VkIG9uIGFuIEltbXV0YWJsZSBkYXRhIHN0cnVjdHVyZS5cIik7XG4gICAgfSk7XG4gIH1cblxuICB2YXIgaW1tdXRhYmlsaXR5VGFnID0gXCJfX2ltbXV0YWJsZV9pbnZhcmlhbnRzX2hvbGRcIjtcblxuICBmdW5jdGlvbiBhZGRJbW11dGFiaWxpdHlUYWcodGFyZ2V0KSB7XG4gICAgYWRkUHJvcGVydHlUbyh0YXJnZXQsIGltbXV0YWJpbGl0eVRhZywgdHJ1ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0ltbXV0YWJsZSh0YXJnZXQpIHtcbiAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gXCJvYmplY3RcIikge1xuICAgICAgcmV0dXJuIHRhcmdldCA9PT0gbnVsbCB8fCBCb29sZWFuKFxuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgaW1tdXRhYmlsaXR5VGFnKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSW4gSmF2YVNjcmlwdCwgb25seSBvYmplY3RzIGFyZSBldmVuIHBvdGVudGlhbGx5IG11dGFibGUuXG4gICAgICAvLyBzdHJpbmdzLCBudW1iZXJzLCBudWxsLCBhbmQgdW5kZWZpbmVkIGFyZSBhbGwgbmF0dXJhbGx5IGltbXV0YWJsZS5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzRXF1YWwoYSwgYikge1xuICAgIC8vIEF2b2lkIGZhbHNlIHBvc2l0aXZlcyBkdWUgdG8gKE5hTiAhPT0gTmFOKSBldmFsdWF0aW5nIHRvIHRydWVcbiAgICByZXR1cm4gKGEgPT09IGIgfHwgKGEgIT09IGEgJiYgYiAhPT0gYikpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNNZXJnYWJsZU9iamVjdCh0YXJnZXQpIHtcbiAgICByZXR1cm4gdGFyZ2V0ICE9PSBudWxsICYmIHR5cGVvZiB0YXJnZXQgPT09IFwib2JqZWN0XCIgJiYgIShBcnJheS5pc0FycmF5KHRhcmdldCkpICYmICEodGFyZ2V0IGluc3RhbmNlb2YgRGF0ZSk7XG4gIH1cblxuICB2YXIgbXV0YXRpbmdPYmplY3RNZXRob2RzID0gW1xuICAgIFwic2V0UHJvdG90eXBlT2ZcIlxuICBdO1xuXG4gIHZhciBub25NdXRhdGluZ09iamVjdE1ldGhvZHMgPSBbXG4gICAgXCJrZXlzXCJcbiAgXTtcblxuICB2YXIgbXV0YXRpbmdBcnJheU1ldGhvZHMgPSBtdXRhdGluZ09iamVjdE1ldGhvZHMuY29uY2F0KFtcbiAgICBcInB1c2hcIiwgXCJwb3BcIiwgXCJzb3J0XCIsIFwic3BsaWNlXCIsIFwic2hpZnRcIiwgXCJ1bnNoaWZ0XCIsIFwicmV2ZXJzZVwiXG4gIF0pO1xuXG4gIHZhciBub25NdXRhdGluZ0FycmF5TWV0aG9kcyA9IG5vbk11dGF0aW5nT2JqZWN0TWV0aG9kcy5jb25jYXQoW1xuICAgIFwibWFwXCIsIFwiZmlsdGVyXCIsIFwic2xpY2VcIiwgXCJjb25jYXRcIiwgXCJyZWR1Y2VcIiwgXCJyZWR1Y2VSaWdodFwiXG4gIF0pO1xuXG4gIHZhciBtdXRhdGluZ0RhdGVNZXRob2RzID0gbXV0YXRpbmdPYmplY3RNZXRob2RzLmNvbmNhdChbXG4gICAgXCJzZXREYXRlXCIsIFwic2V0RnVsbFllYXJcIiwgXCJzZXRIb3Vyc1wiLCBcInNldE1pbGxpc2Vjb25kc1wiLCBcInNldE1pbnV0ZXNcIiwgXCJzZXRNb250aFwiLCBcInNldFNlY29uZHNcIixcbiAgICBcInNldFRpbWVcIiwgXCJzZXRVVENEYXRlXCIsIFwic2V0VVRDRnVsbFllYXJcIiwgXCJzZXRVVENIb3Vyc1wiLCBcInNldFVUQ01pbGxpc2Vjb25kc1wiLCBcInNldFVUQ01pbnV0ZXNcIixcbiAgICBcInNldFVUQ01vbnRoXCIsIFwic2V0VVRDU2Vjb25kc1wiLCBcInNldFllYXJcIlxuICBdKTtcblxuICBmdW5jdGlvbiBJbW11dGFibGVFcnJvcihtZXNzYWdlKSB7XG4gICAgdmFyIGVyciAgICAgICA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICAvLyBUT0RPOiBDb25zaWRlciBgT2JqZWN0LnNldFByb3RvdHlwZU9mKGVyciwgSW1tdXRhYmxlRXJyb3IpO2BcbiAgICBlcnIuX19wcm90b19fID0gSW1tdXRhYmxlRXJyb3I7XG5cbiAgICByZXR1cm4gZXJyO1xuICB9XG4gIEltbXV0YWJsZUVycm9yLnByb3RvdHlwZSA9IEVycm9yLnByb3RvdHlwZTtcblxuICBmdW5jdGlvbiBtYWtlSW1tdXRhYmxlKG9iaiwgYmFubmVkTWV0aG9kcykge1xuICAgIC8vIFRhZyBpdCBzbyB3ZSBjYW4gcXVpY2tseSB0ZWxsIGl0J3MgaW1tdXRhYmxlIGxhdGVyLlxuICAgIGFkZEltbXV0YWJpbGl0eVRhZyhvYmopO1xuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAgICAgLy8gTWFrZSBhbGwgbXV0YXRpbmcgbWV0aG9kcyB0aHJvdyBleGNlcHRpb25zLlxuICAgICAgZm9yICh2YXIgaW5kZXggaW4gYmFubmVkTWV0aG9kcykge1xuICAgICAgICBpZiAoYmFubmVkTWV0aG9kcy5oYXNPd25Qcm9wZXJ0eShpbmRleCkpIHtcbiAgICAgICAgICBiYW5Qcm9wZXJ0eShvYmosIGJhbm5lZE1ldGhvZHNbaW5kZXhdKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBGcmVlemUgaXQgYW5kIHJldHVybiBpdC5cbiAgICAgIE9iamVjdC5mcmVlemUob2JqKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgZnVuY3Rpb24gbWFrZU1ldGhvZFJldHVybkltbXV0YWJsZShvYmosIG1ldGhvZE5hbWUpIHtcbiAgICB2YXIgY3VycmVudE1ldGhvZCA9IG9ialttZXRob2ROYW1lXTtcblxuICAgIGFkZFByb3BlcnR5VG8ob2JqLCBtZXRob2ROYW1lLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBJbW11dGFibGUoY3VycmVudE1ldGhvZC5hcHBseShvYmosIGFyZ3VtZW50cykpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gYXJyYXlTZXQoaWR4LCB2YWx1ZSwgY29uZmlnKSB7XG4gICAgdmFyIGRlZXAgICAgICAgICAgPSBjb25maWcgJiYgY29uZmlnLmRlZXA7XG5cbiAgICBpZiAoaWR4IGluIHRoaXMpIHtcbiAgICAgIGlmIChkZWVwICYmIHRoaXNbaWR4XSAhPT0gdmFsdWUgJiYgaXNNZXJnYWJsZU9iamVjdCh2YWx1ZSkgJiYgaXNNZXJnYWJsZU9iamVjdCh0aGlzW2lkeF0pKSB7XG4gICAgICAgIHZhbHVlID0gSW1tdXRhYmxlLm1lcmdlKHRoaXNbaWR4XSwgdmFsdWUsIHtkZWVwOiB0cnVlLCBtb2RlOiAncmVwbGFjZSd9KTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0VxdWFsKHRoaXNbaWR4XSwgdmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBtdXRhYmxlID0gYXNNdXRhYmxlQXJyYXkuY2FsbCh0aGlzKTtcbiAgICBtdXRhYmxlW2lkeF0gPSBJbW11dGFibGUodmFsdWUpO1xuICAgIHJldHVybiBtYWtlSW1tdXRhYmxlQXJyYXkobXV0YWJsZSk7XG4gIH1cblxuICB2YXIgaW1tdXRhYmxlRW1wdHlBcnJheSA9IEltbXV0YWJsZShbXSk7XG5cbiAgZnVuY3Rpb24gYXJyYXlTZXRJbihwdGgsIHZhbHVlLCBjb25maWcpIHtcbiAgICB2YXIgaGVhZCA9IHB0aFswXTtcblxuICAgIGlmIChwdGgubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gYXJyYXlTZXQuY2FsbCh0aGlzLCBoZWFkLCB2YWx1ZSwgY29uZmlnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHRhaWwgPSBwdGguc2xpY2UoMSk7XG4gICAgICB2YXIgdGhpc0hlYWQgPSB0aGlzW2hlYWRdO1xuICAgICAgdmFyIG5ld1ZhbHVlO1xuXG4gICAgICBpZiAodHlwZW9mKHRoaXNIZWFkKSA9PT0gXCJvYmplY3RcIiAmJiB0aGlzSGVhZCAhPT0gbnVsbCkge1xuICAgICAgICAvLyBNaWdodCAodmFsaWRseSkgYmUgb2JqZWN0IG9yIGFycmF5XG4gICAgICAgIG5ld1ZhbHVlID0gSW1tdXRhYmxlLnNldEluKHRoaXNIZWFkLCB0YWlsLCB2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbmV4dEhlYWQgPSB0YWlsWzBdO1xuICAgICAgICAvLyBJZiB0aGUgbmV4dCBwYXRoIHBhcnQgaXMgYSBudW1iZXIsIHRoZW4gd2UgYXJlIHNldHRpbmcgaW50byBhbiBhcnJheSwgZWxzZSBhbiBvYmplY3QuXG4gICAgICAgIGlmIChuZXh0SGVhZCAhPT0gJycgJiYgaXNGaW5pdGUobmV4dEhlYWQpKSB7XG4gICAgICAgICAgbmV3VmFsdWUgPSBhcnJheVNldEluLmNhbGwoaW1tdXRhYmxlRW1wdHlBcnJheSwgdGFpbCwgdmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1ZhbHVlID0gb2JqZWN0U2V0SW4uY2FsbChpbW11dGFibGVFbXB0eU9iamVjdCwgdGFpbCwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChoZWFkIGluIHRoaXMgJiYgdGhpc0hlYWQgPT09IG5ld1ZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICB2YXIgbXV0YWJsZSA9IGFzTXV0YWJsZUFycmF5LmNhbGwodGhpcyk7XG4gICAgICBtdXRhYmxlW2hlYWRdID0gbmV3VmFsdWU7XG4gICAgICByZXR1cm4gbWFrZUltbXV0YWJsZUFycmF5KG11dGFibGUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG1ha2VJbW11dGFibGVBcnJheShhcnJheSkge1xuICAgIC8vIERvbid0IGNoYW5nZSB0aGVpciBpbXBsZW1lbnRhdGlvbnMsIGJ1dCB3cmFwIHRoZXNlIGZ1bmN0aW9ucyB0byBtYWtlIHN1cmVcbiAgICAvLyB0aGV5IGFsd2F5cyByZXR1cm4gYW4gaW1tdXRhYmxlIHZhbHVlLlxuICAgIGZvciAodmFyIGluZGV4IGluIG5vbk11dGF0aW5nQXJyYXlNZXRob2RzKSB7XG4gICAgICBpZiAobm9uTXV0YXRpbmdBcnJheU1ldGhvZHMuaGFzT3duUHJvcGVydHkoaW5kZXgpKSB7XG4gICAgICAgIHZhciBtZXRob2ROYW1lID0gbm9uTXV0YXRpbmdBcnJheU1ldGhvZHNbaW5kZXhdO1xuICAgICAgICBtYWtlTWV0aG9kUmV0dXJuSW1tdXRhYmxlKGFycmF5LCBtZXRob2ROYW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWdsb2JhbENvbmZpZy51c2Vfc3RhdGljKSB7XG4gICAgICBhZGRQcm9wZXJ0eVRvKGFycmF5LCBcImZsYXRNYXBcIiwgIGZsYXRNYXApO1xuICAgICAgYWRkUHJvcGVydHlUbyhhcnJheSwgXCJhc09iamVjdFwiLCBhc09iamVjdCk7XG4gICAgICBhZGRQcm9wZXJ0eVRvKGFycmF5LCBcImFzTXV0YWJsZVwiLCBhc011dGFibGVBcnJheSk7XG4gICAgICBhZGRQcm9wZXJ0eVRvKGFycmF5LCBcInNldFwiLCBhcnJheVNldCk7XG4gICAgICBhZGRQcm9wZXJ0eVRvKGFycmF5LCBcInNldEluXCIsIGFycmF5U2V0SW4pO1xuICAgICAgYWRkUHJvcGVydHlUbyhhcnJheSwgXCJ1cGRhdGVcIiwgdXBkYXRlKTtcbiAgICAgIGFkZFByb3BlcnR5VG8oYXJyYXksIFwidXBkYXRlSW5cIiwgdXBkYXRlSW4pO1xuICAgIH1cblxuICAgIGZvcih2YXIgaSA9IDAsIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBhcnJheVtpXSA9IEltbXV0YWJsZShhcnJheVtpXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1ha2VJbW11dGFibGUoYXJyYXksIG11dGF0aW5nQXJyYXlNZXRob2RzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1ha2VJbW11dGFibGVEYXRlKGRhdGUpIHtcbiAgICBpZiAoIWdsb2JhbENvbmZpZy51c2Vfc3RhdGljKSB7XG4gICAgICBhZGRQcm9wZXJ0eVRvKGRhdGUsIFwiYXNNdXRhYmxlXCIsIGFzTXV0YWJsZURhdGUpO1xuICAgIH1cblxuICAgIHJldHVybiBtYWtlSW1tdXRhYmxlKGRhdGUsIG11dGF0aW5nRGF0ZU1ldGhvZHMpO1xuICB9XG5cbiAgZnVuY3Rpb24gYXNNdXRhYmxlRGF0ZSgpIHtcbiAgICByZXR1cm4gbmV3IERhdGUodGhpcy5nZXRUaW1lKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVmZmVjdGl2ZWx5IHBlcmZvcm1zIGEgbWFwKCkgb3ZlciB0aGUgZWxlbWVudHMgaW4gdGhlIGFycmF5LCB1c2luZyB0aGVcbiAgICogcHJvdmlkZWQgaXRlcmF0b3IsIGV4Y2VwdCB0aGF0IHdoZW5ldmVyIHRoZSBpdGVyYXRvciByZXR1cm5zIGFuIGFycmF5LCB0aGF0XG4gICAqIGFycmF5J3MgZWxlbWVudHMgYXJlIGFkZGVkIHRvIHRoZSBmaW5hbCByZXN1bHQgaW5zdGVhZCBvZiB0aGUgYXJyYXkgaXRzZWxmLlxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBpdGVyYXRvciAtIFRoZSBpdGVyYXRvciBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgaW52b2tlZCBvbiBlYWNoIGVsZW1lbnQgaW4gdGhlIGFycmF5LiBJdCB3aWxsIHJlY2VpdmUgdGhyZWUgYXJndW1lbnRzOiB0aGUgY3VycmVudCB2YWx1ZSwgdGhlIGN1cnJlbnQgaW5kZXgsIGFuZCB0aGUgY3VycmVudCBvYmplY3QuXG4gICAqL1xuICBmdW5jdGlvbiBmbGF0TWFwKGl0ZXJhdG9yKSB7XG4gICAgLy8gQ2FsbGluZyAuZmxhdE1hcCgpIHdpdGggbm8gYXJndW1lbnRzIGlzIGEgbm8tb3AuIERvbid0IGJvdGhlciBjbG9uaW5nLlxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0gW10sXG4gICAgICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoLFxuICAgICAgICBpbmRleDtcblxuICAgIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGl0ZXJhdG9yUmVzdWx0ID0gaXRlcmF0b3IodGhpc1tpbmRleF0sIGluZGV4LCB0aGlzKTtcblxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlcmF0b3JSZXN1bHQpKSB7XG4gICAgICAgIC8vIENvbmNhdGVuYXRlIEFycmF5IHJlc3VsdHMgaW50byB0aGUgcmV0dXJuIHZhbHVlIHdlJ3JlIGJ1aWxkaW5nIHVwLlxuICAgICAgICByZXN1bHQucHVzaC5hcHBseShyZXN1bHQsIGl0ZXJhdG9yUmVzdWx0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEhhbmRsZSBub24tQXJyYXkgcmVzdWx0cyB0aGUgc2FtZSB3YXkgbWFwKCkgZG9lcy5cbiAgICAgICAgcmVzdWx0LnB1c2goaXRlcmF0b3JSZXN1bHQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtYWtlSW1tdXRhYmxlQXJyYXkocmVzdWx0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIEltbXV0YWJsZSBjb3B5IG9mIHRoZSBvYmplY3Qgd2l0aG91dCB0aGUgZ2l2ZW4ga2V5cyBpbmNsdWRlZC5cbiAgICpcbiAgICogQHBhcmFtIHthcnJheX0ga2V5c1RvUmVtb3ZlIC0gQSBsaXN0IG9mIHN0cmluZ3MgcmVwcmVzZW50aW5nIHRoZSBrZXlzIHRvIGV4Y2x1ZGUgaW4gdGhlIHJldHVybiB2YWx1ZS4gSW5zdGVhZCBvZiBwcm92aWRpbmcgYSBzaW5nbGUgYXJyYXksIHRoaXMgbWV0aG9kIGNhbiBhbHNvIGJlIGNhbGxlZCBieSBwYXNzaW5nIG11bHRpcGxlIHN0cmluZ3MgYXMgc2VwYXJhdGUgYXJndW1lbnRzLlxuICAgKi9cbiAgZnVuY3Rpb24gd2l0aG91dChyZW1vdmUpIHtcbiAgICAvLyBDYWxsaW5nIC53aXRob3V0KCkgd2l0aCBubyBhcmd1bWVudHMgaXMgYSBuby1vcC4gRG9uJ3QgYm90aGVyIGNsb25pbmcuXG4gICAgaWYgKHR5cGVvZiByZW1vdmUgPT09IFwidW5kZWZpbmVkXCIgJiYgYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiByZW1vdmUgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgLy8gSWYgd2Ugd2VyZW4ndCBnaXZlbiBhbiBhcnJheSwgdXNlIHRoZSBhcmd1bWVudHMgbGlzdC5cbiAgICAgIHZhciBrZXlzVG9SZW1vdmVBcnJheSA9IChBcnJheS5pc0FycmF5KHJlbW92ZSkpID9cbiAgICAgICAgIHJlbW92ZS5zbGljZSgpIDogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgICAgLy8gQ29udmVydCBudW1lcmljIGtleXMgdG8gc3RyaW5ncyBzaW5jZSB0aGF0J3MgaG93IHRoZXknbGxcbiAgICAgIC8vIGNvbWUgZnJvbSB0aGUgZW51bWVyYXRpb24gb2YgdGhlIG9iamVjdC5cbiAgICAgIGtleXNUb1JlbW92ZUFycmF5LmZvckVhY2goZnVuY3Rpb24oZWwsIGlkeCwgYXJyKSB7XG4gICAgICAgIGlmKHR5cGVvZihlbCkgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICBhcnJbaWR4XSA9IGVsLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZW1vdmUgPSBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICByZXR1cm4ga2V5c1RvUmVtb3ZlQXJyYXkuaW5kZXhPZihrZXkpICE9PSAtMTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IGluc3RhbnRpYXRlRW1wdHlPYmplY3QodGhpcyk7XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcykge1xuICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiByZW1vdmUodGhpc1trZXldLCBrZXkpID09PSBmYWxzZSkge1xuICAgICAgICByZXN1bHRba2V5XSA9IHRoaXNba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbWFrZUltbXV0YWJsZU9iamVjdChyZXN1bHQpO1xuICB9XG5cbiAgZnVuY3Rpb24gYXNNdXRhYmxlQXJyYXkob3B0cykge1xuICAgIHZhciByZXN1bHQgPSBbXSwgaSwgbGVuZ3RoO1xuXG4gICAgaWYob3B0cyAmJiBvcHRzLmRlZXApIHtcbiAgICAgIGZvcihpID0gMCwgbGVuZ3RoID0gdGhpcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICByZXN1bHQucHVzaChhc0RlZXBNdXRhYmxlKHRoaXNbaV0pKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yKGkgPSAwLCBsZW5ndGggPSB0aGlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHRoaXNbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogRWZmZWN0aXZlbHkgcGVyZm9ybXMgYSBbbWFwXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9tYXApIG92ZXIgdGhlIGVsZW1lbnRzIGluIHRoZSBhcnJheSwgZXhwZWN0aW5nIHRoYXQgdGhlIGl0ZXJhdG9yIGZ1bmN0aW9uXG4gICAqIHdpbGwgcmV0dXJuIGFuIGFycmF5IG9mIHR3byBlbGVtZW50cyAtIHRoZSBmaXJzdCByZXByZXNlbnRpbmcgYSBrZXksIHRoZSBvdGhlclxuICAgKiBhIHZhbHVlLiBUaGVuIHJldHVybnMgYW4gSW1tdXRhYmxlIE9iamVjdCBjb25zdHJ1Y3RlZCBvZiB0aG9zZSBrZXlzIGFuZCB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGl0ZXJhdG9yIC0gQSBmdW5jdGlvbiB3aGljaCBzaG91bGQgcmV0dXJuIGFuIGFycmF5IG9mIHR3byBlbGVtZW50cyAtIHRoZSBmaXJzdCByZXByZXNlbnRpbmcgdGhlIGRlc2lyZWQga2V5LCB0aGUgb3RoZXIgdGhlIGRlc2lyZWQgdmFsdWUuXG4gICAqL1xuICBmdW5jdGlvbiBhc09iamVjdChpdGVyYXRvcikge1xuICAgIC8vIElmIG5vIGl0ZXJhdG9yIHdhcyBwcm92aWRlZCwgYXNzdW1lIHRoZSBpZGVudGl0eSBmdW5jdGlvblxuICAgIC8vIChzdWdnZXN0aW5nIHRoaXMgYXJyYXkgaXMgYWxyZWFkeSBhIGxpc3Qgb2Yga2V5L3ZhbHVlIHBhaXJzLilcbiAgICBpZiAodHlwZW9mIGl0ZXJhdG9yICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGl0ZXJhdG9yID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuICAgIH1cblxuICAgIHZhciByZXN1bHQgPSB7fSxcbiAgICAgICAgbGVuZ3RoID0gdGhpcy5sZW5ndGgsXG4gICAgICAgIGluZGV4O1xuXG4gICAgZm9yIChpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgcGFpciAgPSBpdGVyYXRvcih0aGlzW2luZGV4XSwgaW5kZXgsIHRoaXMpLFxuICAgICAgICAgIGtleSAgID0gcGFpclswXSxcbiAgICAgICAgICB2YWx1ZSA9IHBhaXJbMV07XG5cbiAgICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1ha2VJbW11dGFibGVPYmplY3QocmVzdWx0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFzRGVlcE11dGFibGUob2JqKSB7XG4gICAgaWYgKFxuICAgICAgKCFvYmopIHx8XG4gICAgICAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHx8XG4gICAgICAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBpbW11dGFiaWxpdHlUYWcpKSB8fFxuICAgICAgKG9iaiBpbnN0YW5jZW9mIERhdGUpXG4gICAgKSB7IHJldHVybiBvYmo7IH1cbiAgICByZXR1cm4gSW1tdXRhYmxlLmFzTXV0YWJsZShvYmosIHtkZWVwOiB0cnVlfSk7XG4gIH1cblxuICBmdW5jdGlvbiBxdWlja0NvcHkoc3JjLCBkZXN0KSB7XG4gICAgZm9yICh2YXIga2V5IGluIHNyYykge1xuICAgICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc3JjLCBrZXkpKSB7XG4gICAgICAgIGRlc3Rba2V5XSA9IHNyY1trZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkZXN0O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gSW1tdXRhYmxlIE9iamVjdCBjb250YWluaW5nIHRoZSBwcm9wZXJ0aWVzIGFuZCB2YWx1ZXMgb2YgYm90aFxuICAgKiB0aGlzIG9iamVjdCBhbmQgdGhlIHByb3ZpZGVkIG9iamVjdCwgcHJpb3JpdGl6aW5nIHRoZSBwcm92aWRlZCBvYmplY3Qnc1xuICAgKiB2YWx1ZXMgd2hlbmV2ZXIgdGhlIHNhbWUga2V5IGlzIHByZXNlbnQgaW4gYm90aCBvYmplY3RzLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gb3RoZXIgLSBUaGUgb3RoZXIgb2JqZWN0IHRvIG1lcmdlLiBNdWx0aXBsZSBvYmplY3RzIGNhbiBiZSBwYXNzZWQgYXMgYW4gYXJyYXkuIEluIHN1Y2ggYSBjYXNlLCB0aGUgbGF0ZXIgYW4gb2JqZWN0IGFwcGVhcnMgaW4gdGhhdCBsaXN0LCB0aGUgaGlnaGVyIGl0cyBwcmlvcml0eS5cbiAgICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZyAtIE9wdGlvbmFsIGNvbmZpZyBvYmplY3QgdGhhdCBjb250YWlucyBzZXR0aW5ncy4gU3VwcG9ydGVkIHNldHRpbmdzIGFyZToge2RlZXA6IHRydWV9IGZvciBkZWVwIG1lcmdlIGFuZCB7bWVyZ2VyOiBtZXJnZXJGdW5jfSB3aGVyZSBtZXJnZXJGdW5jIGlzIGEgZnVuY3Rpb25cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQgdGFrZXMgYSBwcm9wZXJ0eSBmcm9tIGJvdGggb2JqZWN0cy4gSWYgYW55dGhpbmcgaXMgcmV0dXJuZWQgaXQgb3ZlcnJpZGVzIHRoZSBub3JtYWwgbWVyZ2UgYmVoYXZpb3VyLlxuICAgKi9cbiAgZnVuY3Rpb24gbWVyZ2Uob3RoZXIsIGNvbmZpZykge1xuICAgIC8vIENhbGxpbmcgLm1lcmdlKCkgd2l0aCBubyBhcmd1bWVudHMgaXMgYSBuby1vcC4gRG9uJ3QgYm90aGVyIGNsb25pbmcuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGlmIChvdGhlciA9PT0gbnVsbCB8fCAodHlwZW9mIG90aGVyICE9PSBcIm9iamVjdFwiKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkltbXV0YWJsZSNtZXJnZSBjYW4gb25seSBiZSBpbnZva2VkIHdpdGggb2JqZWN0cyBvciBhcnJheXMsIG5vdCBcIiArIEpTT04uc3RyaW5naWZ5KG90aGVyKSk7XG4gICAgfVxuXG4gICAgdmFyIHJlY2VpdmVkQXJyYXkgPSAoQXJyYXkuaXNBcnJheShvdGhlcikpLFxuICAgICAgICBkZWVwICAgICAgICAgID0gY29uZmlnICYmIGNvbmZpZy5kZWVwLFxuICAgICAgICBtb2RlICAgICAgICAgID0gY29uZmlnICYmIGNvbmZpZy5tb2RlIHx8ICdtZXJnZScsXG4gICAgICAgIG1lcmdlciAgICAgICAgPSBjb25maWcgJiYgY29uZmlnLm1lcmdlcixcbiAgICAgICAgcmVzdWx0O1xuXG4gICAgLy8gVXNlIHRoZSBnaXZlbiBrZXkgdG8gZXh0cmFjdCBhIHZhbHVlIGZyb20gdGhlIGdpdmVuIG9iamVjdCwgdGhlbiBwbGFjZVxuICAgIC8vIHRoYXQgdmFsdWUgaW4gdGhlIHJlc3VsdCBvYmplY3QgdW5kZXIgdGhlIHNhbWUga2V5LiBJZiB0aGF0IHJlc3VsdGVkXG4gICAgLy8gaW4gYSBjaGFuZ2UgZnJvbSB0aGlzIG9iamVjdCdzIHZhbHVlIGF0IHRoYXQga2V5LCBzZXQgYW55Q2hhbmdlcyA9IHRydWUuXG4gICAgZnVuY3Rpb24gYWRkVG9SZXN1bHQoY3VycmVudE9iaiwgb3RoZXJPYmosIGtleSkge1xuICAgICAgdmFyIGltbXV0YWJsZVZhbHVlID0gSW1tdXRhYmxlKG90aGVyT2JqW2tleV0pO1xuICAgICAgdmFyIG1lcmdlclJlc3VsdCA9IG1lcmdlciAmJiBtZXJnZXIoY3VycmVudE9ialtrZXldLCBpbW11dGFibGVWYWx1ZSwgY29uZmlnKTtcbiAgICAgIHZhciBjdXJyZW50VmFsdWUgPSBjdXJyZW50T2JqW2tleV07XG5cbiAgICAgIGlmICgocmVzdWx0ICE9PSB1bmRlZmluZWQpIHx8XG4gICAgICAgIChtZXJnZXJSZXN1bHQgIT09IHVuZGVmaW5lZCkgfHxcbiAgICAgICAgKCFjdXJyZW50T2JqLmhhc093blByb3BlcnR5KGtleSkpIHx8XG4gICAgICAgICFpc0VxdWFsKGltbXV0YWJsZVZhbHVlLCBjdXJyZW50VmFsdWUpKSB7XG5cbiAgICAgICAgdmFyIG5ld1ZhbHVlO1xuXG4gICAgICAgIGlmIChtZXJnZXJSZXN1bHQpIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IG1lcmdlclJlc3VsdDtcbiAgICAgICAgfSBlbHNlIGlmIChkZWVwICYmIGlzTWVyZ2FibGVPYmplY3QoY3VycmVudFZhbHVlKSAmJiBpc01lcmdhYmxlT2JqZWN0KGltbXV0YWJsZVZhbHVlKSkge1xuICAgICAgICAgIG5ld1ZhbHVlID0gSW1tdXRhYmxlLm1lcmdlKGN1cnJlbnRWYWx1ZSwgaW1tdXRhYmxlVmFsdWUsIGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3VmFsdWUgPSBpbW11dGFibGVWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNFcXVhbChjdXJyZW50VmFsdWUsIG5ld1ZhbHVlKSB8fCAhY3VycmVudE9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBNYWtlIGEgc2hhbGxvdyBjbG9uZSBvZiB0aGUgY3VycmVudCBvYmplY3QuXG4gICAgICAgICAgICByZXN1bHQgPSBxdWlja0NvcHkoY3VycmVudE9iaiwgaW5zdGFudGlhdGVFbXB0eU9iamVjdChjdXJyZW50T2JqKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzdWx0W2tleV0gPSBuZXdWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFyRHJvcHBlZEtleXMoY3VycmVudE9iaiwgb3RoZXJPYmopIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBjdXJyZW50T2JqKSB7XG4gICAgICAgIGlmICghb3RoZXJPYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIGlmIChyZXN1bHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gTWFrZSBhIHNoYWxsb3cgY2xvbmUgb2YgdGhlIGN1cnJlbnQgb2JqZWN0LlxuICAgICAgICAgICAgcmVzdWx0ID0gcXVpY2tDb3B5KGN1cnJlbnRPYmosIGluc3RhbnRpYXRlRW1wdHlPYmplY3QoY3VycmVudE9iaikpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZWxldGUgcmVzdWx0W2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIga2V5O1xuXG4gICAgLy8gQWNoaWV2ZSBwcmlvcml0aXphdGlvbiBieSBvdmVycmlkaW5nIHByZXZpb3VzIHZhbHVlcyB0aGF0IGdldCBpbiB0aGUgd2F5LlxuICAgIGlmICghcmVjZWl2ZWRBcnJheSkge1xuICAgICAgLy8gVGhlIG1vc3QgY29tbW9uIHVzZSBjYXNlOiBqdXN0IG1lcmdlIG9uZSBvYmplY3QgaW50byB0aGUgZXhpc3Rpbmcgb25lLlxuICAgICAgZm9yIChrZXkgaW4gb3RoZXIpIHtcbiAgICAgICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob3RoZXIsIGtleSkpIHtcbiAgICAgICAgICBhZGRUb1Jlc3VsdCh0aGlzLCBvdGhlciwga2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1vZGUgPT09ICdyZXBsYWNlJykge1xuICAgICAgICBjbGVhckRyb3BwZWRLZXlzKHRoaXMsIG90aGVyKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gV2UgYWxzbyBhY2NlcHQgYW4gQXJyYXlcbiAgICAgIGZvciAodmFyIGluZGV4ID0gMCwgbGVuZ3RoID0gb3RoZXIubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICB2YXIgb3RoZXJGcm9tQXJyYXkgPSBvdGhlcltpbmRleF07XG5cbiAgICAgICAgZm9yIChrZXkgaW4gb3RoZXJGcm9tQXJyYXkpIHtcbiAgICAgICAgICBpZiAob3RoZXJGcm9tQXJyYXkuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgYWRkVG9SZXN1bHQocmVzdWx0ICE9PSB1bmRlZmluZWQgPyByZXN1bHQgOiB0aGlzLCBvdGhlckZyb21BcnJheSwga2V5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocmVzdWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbWFrZUltbXV0YWJsZU9iamVjdChyZXN1bHQpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9iamVjdFJlcGxhY2UodmFsdWUsIGNvbmZpZykge1xuICAgIHZhciBkZWVwICAgICAgICAgID0gY29uZmlnICYmIGNvbmZpZy5kZWVwO1xuXG4gICAgLy8gQ2FsbGluZyAucmVwbGFjZSgpIHdpdGggbm8gYXJndW1lbnRzIGlzIGEgbm8tb3AuIERvbid0IGJvdGhlciBjbG9uaW5nLlxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdHlwZW9mIHZhbHVlICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW1tdXRhYmxlI3JlcGxhY2UgY2FuIG9ubHkgYmUgaW52b2tlZCB3aXRoIG9iamVjdHMgb3IgYXJyYXlzLCBub3QgXCIgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xuICAgIH1cblxuICAgIHJldHVybiBJbW11dGFibGUubWVyZ2UodGhpcywgdmFsdWUsIHtkZWVwOiBkZWVwLCBtb2RlOiAncmVwbGFjZSd9KTtcbiAgfVxuXG4gIHZhciBpbW11dGFibGVFbXB0eU9iamVjdCA9IEltbXV0YWJsZSh7fSk7XG5cbiAgZnVuY3Rpb24gb2JqZWN0U2V0SW4ocGF0aCwgdmFsdWUsIGNvbmZpZykge1xuICAgIGlmICghKHBhdGggaW5zdGFuY2VvZiBBcnJheSkgfHwgcGF0aC5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJUaGUgZmlyc3QgYXJndW1lbnQgdG8gSW1tdXRhYmxlI3NldEluIG11c3QgYmUgYW4gYXJyYXkgY29udGFpbmluZyBhdCBsZWFzdCBvbmUgXFxcImtleVxcXCIgc3RyaW5nLlwiKTtcbiAgICB9XG5cbiAgICB2YXIgaGVhZCA9IHBhdGhbMF07XG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gb2JqZWN0U2V0LmNhbGwodGhpcywgaGVhZCwgdmFsdWUsIGNvbmZpZyk7XG4gICAgfVxuXG4gICAgdmFyIHRhaWwgPSBwYXRoLnNsaWNlKDEpO1xuICAgIHZhciBuZXdWYWx1ZTtcbiAgICB2YXIgdGhpc0hlYWQgPSB0aGlzW2hlYWRdO1xuXG4gICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoaGVhZCkgJiYgdHlwZW9mKHRoaXNIZWFkKSA9PT0gXCJvYmplY3RcIiAmJiB0aGlzSGVhZCAhPT0gbnVsbCkge1xuICAgICAgLy8gTWlnaHQgKHZhbGlkbHkpIGJlIG9iamVjdCBvciBhcnJheVxuICAgICAgbmV3VmFsdWUgPSBJbW11dGFibGUuc2V0SW4odGhpc0hlYWQsIHRhaWwsIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3VmFsdWUgPSBvYmplY3RTZXRJbi5jYWxsKGltbXV0YWJsZUVtcHR5T2JqZWN0LCB0YWlsLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoaGVhZCkgJiYgdGhpc0hlYWQgPT09IG5ld1ZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB2YXIgbXV0YWJsZSA9IHF1aWNrQ29weSh0aGlzLCBpbnN0YW50aWF0ZUVtcHR5T2JqZWN0KHRoaXMpKTtcbiAgICBtdXRhYmxlW2hlYWRdID0gbmV3VmFsdWU7XG4gICAgcmV0dXJuIG1ha2VJbW11dGFibGVPYmplY3QobXV0YWJsZSk7XG4gIH1cblxuICBmdW5jdGlvbiBvYmplY3RTZXQocHJvcGVydHksIHZhbHVlLCBjb25maWcpIHtcbiAgICB2YXIgZGVlcCAgICAgICAgICA9IGNvbmZpZyAmJiBjb25maWcuZGVlcDtcblxuICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgICAgaWYgKGRlZXAgJiYgdGhpc1twcm9wZXJ0eV0gIT09IHZhbHVlICYmIGlzTWVyZ2FibGVPYmplY3QodmFsdWUpICYmIGlzTWVyZ2FibGVPYmplY3QodGhpc1twcm9wZXJ0eV0pKSB7XG4gICAgICAgIHZhbHVlID0gSW1tdXRhYmxlLm1lcmdlKHRoaXNbcHJvcGVydHldLCB2YWx1ZSwge2RlZXA6IHRydWUsIG1vZGU6ICdyZXBsYWNlJ30pO1xuICAgICAgfVxuICAgICAgaWYgKGlzRXF1YWwodGhpc1twcm9wZXJ0eV0sIHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbXV0YWJsZSA9IHF1aWNrQ29weSh0aGlzLCBpbnN0YW50aWF0ZUVtcHR5T2JqZWN0KHRoaXMpKTtcbiAgICBtdXRhYmxlW3Byb3BlcnR5XSA9IEltbXV0YWJsZSh2YWx1ZSk7XG4gICAgcmV0dXJuIG1ha2VJbW11dGFibGVPYmplY3QobXV0YWJsZSk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGUocHJvcGVydHksIHVwZGF0ZXIpIHtcbiAgICB2YXIgcmVzdEFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBpbml0aWFsVmFsID0gdGhpc1twcm9wZXJ0eV07XG4gICAgcmV0dXJuIEltbXV0YWJsZS5zZXQodGhpcywgcHJvcGVydHksIHVwZGF0ZXIuYXBwbHkoaW5pdGlhbFZhbCwgW2luaXRpYWxWYWxdLmNvbmNhdChyZXN0QXJncykpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEluUGF0aChvYmosIHBhdGgpIHtcbiAgICAvKmpzaGludCBlcW51bGw6dHJ1ZSAqL1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gcGF0aC5sZW5ndGg7IG9iaiAhPSBudWxsICYmIGkgPCBsOyBpKyspIHtcbiAgICAgIG9iaiA9IG9ialtwYXRoW2ldXTtcbiAgICB9XG5cbiAgICByZXR1cm4gKGkgJiYgaSA9PSBsKSA/IG9iaiA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZUluKHBhdGgsIHVwZGF0ZXIpIHtcbiAgICB2YXIgcmVzdEFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBpbml0aWFsVmFsID0gZ2V0SW5QYXRoKHRoaXMsIHBhdGgpO1xuXG4gICAgcmV0dXJuIEltbXV0YWJsZS5zZXRJbih0aGlzLCBwYXRoLCB1cGRhdGVyLmFwcGx5KGluaXRpYWxWYWwsIFtpbml0aWFsVmFsXS5jb25jYXQocmVzdEFyZ3MpKSk7XG4gIH1cblxuICBmdW5jdGlvbiBhc011dGFibGVPYmplY3Qob3B0cykge1xuICAgIHZhciByZXN1bHQgPSBpbnN0YW50aWF0ZUVtcHR5T2JqZWN0KHRoaXMpLCBrZXk7XG5cbiAgICBpZihvcHRzICYmIG9wdHMuZGVlcCkge1xuICAgICAgZm9yIChrZXkgaW4gdGhpcykge1xuICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgcmVzdWx0W2tleV0gPSBhc0RlZXBNdXRhYmxlKHRoaXNba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChrZXkgaW4gdGhpcykge1xuICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgcmVzdWx0W2tleV0gPSB0aGlzW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy8gQ3JlYXRlcyBwbGFpbiBvYmplY3QgdG8gYmUgdXNlZCBmb3IgY2xvbmluZ1xuICBmdW5jdGlvbiBpbnN0YW50aWF0ZVBsYWluT2JqZWN0KCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIC8vIEZpbmFsaXplcyBhbiBvYmplY3Qgd2l0aCBpbW11dGFibGUgbWV0aG9kcywgZnJlZXplcyBpdCwgYW5kIHJldHVybnMgaXQuXG4gIGZ1bmN0aW9uIG1ha2VJbW11dGFibGVPYmplY3Qob2JqKSB7XG4gICAgaWYgKCFnbG9iYWxDb25maWcudXNlX3N0YXRpYykge1xuICAgICAgYWRkUHJvcGVydHlUbyhvYmosIFwibWVyZ2VcIiwgbWVyZ2UpO1xuICAgICAgYWRkUHJvcGVydHlUbyhvYmosIFwicmVwbGFjZVwiLCBvYmplY3RSZXBsYWNlKTtcbiAgICAgIGFkZFByb3BlcnR5VG8ob2JqLCBcIndpdGhvdXRcIiwgd2l0aG91dCk7XG4gICAgICBhZGRQcm9wZXJ0eVRvKG9iaiwgXCJhc011dGFibGVcIiwgYXNNdXRhYmxlT2JqZWN0KTtcbiAgICAgIGFkZFByb3BlcnR5VG8ob2JqLCBcInNldFwiLCBvYmplY3RTZXQpO1xuICAgICAgYWRkUHJvcGVydHlUbyhvYmosIFwic2V0SW5cIiwgb2JqZWN0U2V0SW4pO1xuICAgICAgYWRkUHJvcGVydHlUbyhvYmosIFwidXBkYXRlXCIsIHVwZGF0ZSk7XG4gICAgICBhZGRQcm9wZXJ0eVRvKG9iaiwgXCJ1cGRhdGVJblwiLCB1cGRhdGVJbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1ha2VJbW11dGFibGUob2JqLCBtdXRhdGluZ09iamVjdE1ldGhvZHMpO1xuICB9XG5cbiAgLy8gUmV0dXJucyB0cnVlIGlmIG9iamVjdCBpcyBhIHZhbGlkIHJlYWN0IGVsZW1lbnRcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2Jsb2IvdjE1LjAuMS9zcmMvaXNvbW9ycGhpYy9jbGFzc2ljL2VsZW1lbnQvUmVhY3RFbGVtZW50LmpzI0wzMjZcbiAgZnVuY3Rpb24gaXNSZWFjdEVsZW1lbnQob2JqKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgIG9iaiAhPT0gbnVsbCAmJlxuICAgICAgICAgICAob2JqLiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEVfRkFMTEJBQ0sgfHwgb2JqLiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEUpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNGaWxlT2JqZWN0KG9iaikge1xuICAgIHJldHVybiB0eXBlb2YgRmlsZSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgb2JqIGluc3RhbmNlb2YgRmlsZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIEltbXV0YWJsZShvYmosIG9wdGlvbnMsIHN0YWNrUmVtYWluaW5nKSB7XG4gICAgaWYgKGlzSW1tdXRhYmxlKG9iaikgfHwgaXNSZWFjdEVsZW1lbnQob2JqKSB8fCBpc0ZpbGVPYmplY3Qob2JqKSkge1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgICAgcmV0dXJuIG1ha2VJbW11dGFibGVBcnJheShvYmouc2xpY2UoKSk7XG4gICAgfSBlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICByZXR1cm4gbWFrZUltbXV0YWJsZURhdGUobmV3IERhdGUob2JqLmdldFRpbWUoKSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEb24ndCBmcmVlemUgdGhlIG9iamVjdCB3ZSB3ZXJlIGdpdmVuOyBtYWtlIGEgY2xvbmUgYW5kIHVzZSB0aGF0LlxuICAgICAgdmFyIHByb3RvdHlwZSA9IG9wdGlvbnMgJiYgb3B0aW9ucy5wcm90b3R5cGU7XG4gICAgICB2YXIgaW5zdGFudGlhdGVFbXB0eU9iamVjdCA9XG4gICAgICAgICghcHJvdG90eXBlIHx8IHByb3RvdHlwZSA9PT0gT2JqZWN0LnByb3RvdHlwZSkgP1xuICAgICAgICAgIGluc3RhbnRpYXRlUGxhaW5PYmplY3QgOiAoZnVuY3Rpb24oKSB7IHJldHVybiBPYmplY3QuY3JlYXRlKHByb3RvdHlwZSk7IH0pO1xuICAgICAgdmFyIGNsb25lID0gaW5zdGFudGlhdGVFbXB0eU9iamVjdCgpO1xuXG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICAgIC8qanNoaW50IGVxbnVsbDp0cnVlICovXG4gICAgICAgIGlmIChzdGFja1JlbWFpbmluZyA9PSBudWxsKSB7XG4gICAgICAgICAgc3RhY2tSZW1haW5pbmcgPSA2NDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhY2tSZW1haW5pbmcgPD0gMCkge1xuICAgICAgICAgIHRocm93IG5ldyBJbW11dGFibGVFcnJvcihcIkF0dGVtcHQgdG8gY29uc3RydWN0IEltbXV0YWJsZSBmcm9tIGEgZGVlcGx5IG5lc3RlZCBvYmplY3Qgd2FzIGRldGVjdGVkLlwiICtcbiAgICAgICAgICAgIFwiIEhhdmUgeW91IHRyaWVkIHRvIHdyYXAgYW4gb2JqZWN0IHdpdGggY2lyY3VsYXIgcmVmZXJlbmNlcyAoZS5nLiBSZWFjdCBlbGVtZW50KT9cIiArXG4gICAgICAgICAgICBcIiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3J0ZmVsZG1hbi9zZWFtbGVzcy1pbW11dGFibGUvd2lraS9EZWVwbHktbmVzdGVkLW9iamVjdC13YXMtZGV0ZWN0ZWQgZm9yIGRldGFpbHMuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHN0YWNrUmVtYWluaW5nIC09IDE7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBrZXkpKSB7XG4gICAgICAgICAgY2xvbmVba2V5XSA9IEltbXV0YWJsZShvYmpba2V5XSwgdW5kZWZpbmVkLCBzdGFja1JlbWFpbmluZyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG1ha2VJbW11dGFibGVPYmplY3QoY2xvbmUpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFdyYXBwZXIgdG8gYWxsb3cgdGhlIHVzZSBvZiBvYmplY3QgbWV0aG9kcyBhcyBzdGF0aWMgbWV0aG9kcyBvZiBJbW11dGFibGUuXG4gIGZ1bmN0aW9uIHRvU3RhdGljKGZuKSB7XG4gICAgZnVuY3Rpb24gc3RhdGljV3JhcHBlcigpIHtcbiAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgdmFyIHNlbGYgPSBhcmdzLnNoaWZ0KCk7XG4gICAgICByZXR1cm4gZm4uYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXRpY1dyYXBwZXI7XG4gIH1cblxuICAvLyBXcmFwcGVyIHRvIGFsbG93IHRoZSB1c2Ugb2Ygb2JqZWN0IG1ldGhvZHMgYXMgc3RhdGljIG1ldGhvZHMgb2YgSW1tdXRhYmxlLlxuICAvLyB3aXRoIHRoZSBhZGRpdGlvbmFsIGNvbmRpdGlvbiBvZiBjaG9vc2luZyB3aGljaCBmdW5jdGlvbiB0byBjYWxsIGRlcGVuZGluZ1xuICAvLyBpZiBhcmd1bWVudCBpcyBhbiBhcnJheSBvciBhbiBvYmplY3QuXG4gIGZ1bmN0aW9uIHRvU3RhdGljT2JqZWN0T3JBcnJheShmbk9iamVjdCwgZm5BcnJheSkge1xuICAgIGZ1bmN0aW9uIHN0YXRpY1dyYXBwZXIoKSB7XG4gICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgIHZhciBzZWxmID0gYXJncy5zaGlmdCgpO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc2VsZikpIHtcbiAgICAgICAgICByZXR1cm4gZm5BcnJheS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZuT2JqZWN0LmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdGF0aWNXcmFwcGVyO1xuICB9XG5cbiAgLy8gV3JhcHBlciB0byBhbGxvdyB0aGUgdXNlIG9mIG9iamVjdCBtZXRob2RzIGFzIHN0YXRpYyBtZXRob2RzIG9mIEltbXV0YWJsZS5cbiAgLy8gd2l0aCB0aGUgYWRkaXRpb25hbCBjb25kaXRpb24gb2YgY2hvb3Npbmcgd2hpY2ggZnVuY3Rpb24gdG8gY2FsbCBkZXBlbmRpbmdcbiAgLy8gaWYgYXJndW1lbnQgaXMgYW4gYXJyYXkgb3IgYW4gb2JqZWN0IG9yIGEgZGF0ZS5cbiAgZnVuY3Rpb24gdG9TdGF0aWNPYmplY3RPckRhdGVPckFycmF5KGZuT2JqZWN0LCBmbkFycmF5LCBmbkRhdGUpIHtcbiAgICBmdW5jdGlvbiBzdGF0aWNXcmFwcGVyKCkge1xuICAgICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICB2YXIgc2VsZiA9IGFyZ3Muc2hpZnQoKTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHNlbGYpKSB7XG4gICAgICAgICAgcmV0dXJuIGZuQXJyYXkuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICB9IGVsc2UgaWYgKHNlbGYgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgICAgcmV0dXJuIGZuRGF0ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZuT2JqZWN0LmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdGF0aWNXcmFwcGVyO1xuICB9XG5cbiAgLy8gRXhwb3J0IHRoZSBsaWJyYXJ5XG4gIEltbXV0YWJsZS5mcm9tICAgICAgICAgICA9IEltbXV0YWJsZTtcbiAgSW1tdXRhYmxlLmlzSW1tdXRhYmxlICAgID0gaXNJbW11dGFibGU7XG4gIEltbXV0YWJsZS5JbW11dGFibGVFcnJvciA9IEltbXV0YWJsZUVycm9yO1xuICBJbW11dGFibGUubWVyZ2UgICAgICAgICAgPSB0b1N0YXRpYyhtZXJnZSk7XG4gIEltbXV0YWJsZS5yZXBsYWNlICAgICAgICA9IHRvU3RhdGljKG9iamVjdFJlcGxhY2UpO1xuICBJbW11dGFibGUud2l0aG91dCAgICAgICAgPSB0b1N0YXRpYyh3aXRob3V0KTtcbiAgSW1tdXRhYmxlLmFzTXV0YWJsZSAgICAgID0gdG9TdGF0aWNPYmplY3RPckRhdGVPckFycmF5KGFzTXV0YWJsZU9iamVjdCwgYXNNdXRhYmxlQXJyYXksIGFzTXV0YWJsZURhdGUpO1xuICBJbW11dGFibGUuc2V0ICAgICAgICAgICAgPSB0b1N0YXRpY09iamVjdE9yQXJyYXkob2JqZWN0U2V0LCBhcnJheVNldCk7XG4gIEltbXV0YWJsZS5zZXRJbiAgICAgICAgICA9IHRvU3RhdGljT2JqZWN0T3JBcnJheShvYmplY3RTZXRJbiwgYXJyYXlTZXRJbik7XG4gIEltbXV0YWJsZS51cGRhdGUgICAgICAgICA9IHRvU3RhdGljKHVwZGF0ZSk7XG4gIEltbXV0YWJsZS51cGRhdGVJbiAgICAgICA9IHRvU3RhdGljKHVwZGF0ZUluKTtcbiAgSW1tdXRhYmxlLmZsYXRNYXAgICAgICAgID0gdG9TdGF0aWMoZmxhdE1hcCk7XG4gIEltbXV0YWJsZS5hc09iamVjdCAgICAgICA9IHRvU3RhdGljKGFzT2JqZWN0KTtcbiAgaWYgKCFnbG9iYWxDb25maWcudXNlX3N0YXRpYykge1xuICAgICAgSW1tdXRhYmxlLnN0YXRpYyA9IGltbXV0YWJsZUluaXQoe1xuICAgICAgICAgIHVzZV9zdGF0aWM6IHRydWVcbiAgICAgIH0pO1xuICB9XG5cbiAgT2JqZWN0LmZyZWV6ZShJbW11dGFibGUpO1xuXG4gIHJldHVybiBJbW11dGFibGU7XG59XG5cbiAgdmFyIEltbXV0YWJsZSA9IGltbXV0YWJsZUluaXQoKTtcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gSW1tdXRhYmxlO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IEltbXV0YWJsZTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gXCJvYmplY3RcIikge1xuICAgIGV4cG9ydHMuSW1tdXRhYmxlID0gSW1tdXRhYmxlO1xuICB9IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpIHtcbiAgICB3aW5kb3cuSW1tdXRhYmxlID0gSW1tdXRhYmxlO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBnbG9iYWwgPT09IFwib2JqZWN0XCIpIHtcbiAgICBnbG9iYWwuSW1tdXRhYmxlID0gSW1tdXRhYmxlO1xuICB9XG59KSgpO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbmV3LWNhcCAqL1xuaW1wb3J0IEltbXV0YWJsZSBmcm9tIFwic2VhbWxlc3MtaW1tdXRhYmxlXCI7XG5cbi8vIFRoaXMgbWlkZGxld2FyZSB3aWxsIGp1c3QgYWRkIHRoZSBwcm9wZXJ0eSBcImFzeW5jIGRpc3BhdGNoXCJcbi8vIHRvIGFjdGlvbnMgd2l0aCB0aGUgXCJhc3luY1wiIHByb3BwZXJ0eSBzZXQgdG8gdHJ1ZVxuY29uc3QgYXN5bmNEaXNwYXRjaE1pZGRsZXdhcmUgPSBzdG9yZSA9PiBuZXh0ID0+IGFjdGlvbiA9PiB7XG4gIGxldCBzeW5jQWN0aXZpdHlGaW5pc2hlZCA9IGZhbHNlO1xuICBsZXQgYWN0aW9uUXVldWUgPSBbXTtcblxuICBmdW5jdGlvbiBmbHVzaFF1ZXVlKCkge1xuICAgIGFjdGlvblF1ZXVlLmZvckVhY2goYSA9PiBzdG9yZS5kaXNwYXRjaChhKSk7IC8vIGZsdXNoIHF1ZXVlXG4gICAgYWN0aW9uUXVldWUgPSBbXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFzeW5jRGlzcGF0Y2goYXN5bmNBY3Rpb24pIHtcbiAgICBhY3Rpb25RdWV1ZSA9IGFjdGlvblF1ZXVlLmNvbmNhdChbYXN5bmNBY3Rpb25dKTtcblxuICAgIGlmIChzeW5jQWN0aXZpdHlGaW5pc2hlZCkge1xuICAgICAgZmx1c2hRdWV1ZSgpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGFjdGlvbldpdGhBc3luY0Rpc3BhdGNoID1cbiAgICAgIEltbXV0YWJsZShhY3Rpb24pLm1lcmdlKHsgYXN5bmNEaXNwYXRjaCB9KTtcblxuICBuZXh0KGFjdGlvbldpdGhBc3luY0Rpc3BhdGNoKTtcbiAgc3luY0FjdGl2aXR5RmluaXNoZWQgPSB0cnVlO1xuICBmbHVzaFF1ZXVlKCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhc3luY0Rpc3BhdGNoTWlkZGxld2FyZTtcbiIsIi8qIGVzbGludC1lbnYgamFzbWluZSAqL1xuaW1wb3J0IGFzeW5jRGlzcGF0Y2hNaWRkbGV3YXJlIGZyb20gXCIuLi9qcy91dGlscy9hc3luY0Rpc3BhdGNoTWlkZGxld2FyZVwiO1xuXG5jb25zdCBmYWtlQWN0aW9uID0geyB0eXBlOiBcImZha2UgYWN0aW9uXCIgfTtcblxuZGVzY3JpYmUoXCJUaGUgYXN5bmNEaXNwYXRjaE1pZGRsZXdhcmVcIiwgKCkgPT4ge1xuICBpdChcImNhbGxzIG5leHQgd2l0aCBhc3luY0Rpc3BhdGNoIHByb3BlcnR5XCIsIChkb25lKSA9PiB7XG4gICAgY29uc3QgbmV4dCA9IHJldHVybmVkQWN0aW9uID0+IHtcbiAgICAgIGV4cGVjdChyZXR1cm5lZEFjdGlvbi5hc3luY0Rpc3BhdGNoKS5ub3QudG9FcXVhbCh1bmRlZmluZWQpO1xuICAgICAgZXhwZWN0KHR5cGVvZiByZXR1cm5lZEFjdGlvbi5hc3luY0Rpc3BhdGNoKS50b0VxdWFsKFwiZnVuY3Rpb25cIik7XG4gICAgICBkb25lKCk7XG4gICAgfTtcblxuICAgIGFzeW5jRGlzcGF0Y2hNaWRkbGV3YXJlKFwiZmFrZVN0b3JlXCIpKG5leHQpKGZha2VBY3Rpb24pO1xuICB9KTtcblxuXG4gIGl0KFwiYXN5bmNEaXNwYXRjaCB0cmlnZ2VycyBhIHN0b3JlIGRpc3BhdGNoXCIsIChkb25lKSA9PiB7XG4gICAgY29uc3QgZmFrZUFzeW5jQWN0aW9uID0geyB0eXBlOiBcImZha2VBc3luY0FjdGlvblwiIH07XG5cbiAgICBjb25zdCBmYWtlU3RvcmUgPSB7XG4gICAgICBkaXNwYXRjaDogYWN0aW9uID0+IHtcbiAgICAgICAgZXhwZWN0KGFjdGlvbi50eXBlKS50b0VxdWFsKGZha2VBc3luY0FjdGlvbi50eXBlKTtcbiAgICAgICAgZG9uZSgpO1xuICAgICAgfSxcbiAgICB9O1xuXG4gICAgY29uc3QgbmV4dCA9IHJldHVybmVkQWN0aW9uID0+XG4gICAgICByZXR1cm5lZEFjdGlvbi5hc3luY0Rpc3BhdGNoKGZha2VBc3luY0FjdGlvbik7XG5cbiAgICBhc3luY0Rpc3BhdGNoTWlkZGxld2FyZShmYWtlU3RvcmUpKG5leHQpKGZha2VBY3Rpb24pO1xuICB9KTtcbn0pO1xuIiwiLy8gQnVnIGNoZWNraW5nIGZ1bmN0aW9uIHRoYXQgd2lsbCB0aHJvdyBhbiBlcnJvciB3aGVuZXZlclxuLy8gdGhlIGNvbmRpdGlvbiBzZW50IHRvIGl0IGlzIGV2YWx1YXRlZCB0byBmYWxzZVxuLyoqXG4gKiBQcm9jZXNzZXMgdGhlIG1lc3NhZ2UgYW5kIG91dHB1dHMgdGhlIGNvcnJlY3QgbWVzc2FnZSBpZiB0aGUgY29uZGl0aW9uXG4gKiBpcyBmYWxzZS4gT3RoZXJ3aXNlIGl0IG91dHB1dHMgbnVsbC5cbiAqIEBhcGkgcHJpdmF0ZVxuICogQG1ldGhvZCBwcm9jZXNzQ29uZGl0aW9uXG4gKiBAcGFyYW0gIHtCb29sZWFufSBjb25kaXRpb24gLSBSZXN1bHQgb2YgdGhlIGV2YWx1YXRlZCBjb25kaXRpb25cbiAqIEBwYXJhbSAge1N0cmluZ30gZXJyb3JNZXNzYWdlIC0gTWVzc2FnZSBleHBsYWluaWcgdGhlIGVycm9yIGluIGNhc2UgaXQgaXMgdGhyb3duXG4gKiBAcmV0dXJuIHtTdHJpbmcgfCBudWxsfSAgLSBFcnJvciBtZXNzYWdlIGlmIHRoZXJlIGlzIGFuIGVycm9yLCBudWwgb3RoZXJ3aXNlLlxuICovXG5mdW5jdGlvbiBwcm9jZXNzQ29uZGl0aW9uKGNvbmRpdGlvbiwgZXJyb3JNZXNzYWdlKSB7XG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdmFyIGNvbXBsZXRlRXJyb3JNZXNzYWdlID0gJyc7XG4gICAgdmFyIHJlID0gL2F0IChbXlxcc10rKVxcc1xcKC9nO1xuICAgIHZhciBzdGFja1RyYWNlID0gbmV3IEVycm9yKCkuc3RhY2s7XG4gICAgdmFyIHN0YWNrRnVuY3Rpb25zID0gW107XG5cbiAgICB2YXIgZnVuY05hbWUgPSByZS5leGVjKHN0YWNrVHJhY2UpO1xuICAgIHdoaWxlIChmdW5jTmFtZSAmJiBmdW5jTmFtZVsxXSkge1xuICAgICAgc3RhY2tGdW5jdGlvbnMucHVzaChmdW5jTmFtZVsxXSk7XG4gICAgICBmdW5jTmFtZSA9IHJlLmV4ZWMoc3RhY2tUcmFjZSk7XG4gICAgfVxuXG4gICAgLy8gTnVtYmVyIDAgaXMgcHJvY2Vzc0NvbmRpdGlvbiBpdHNlbGYsXG4gICAgLy8gTnVtYmVyIDEgaXMgYXNzZXJ0LFxuICAgIC8vIE51bWJlciAyIGlzIHRoZSBjYWxsZXIgZnVuY3Rpb24uXG4gICAgaWYgKHN0YWNrRnVuY3Rpb25zWzJdKSB7XG4gICAgICBjb21wbGV0ZUVycm9yTWVzc2FnZSA9IHN0YWNrRnVuY3Rpb25zWzJdICsgJzogJyArIGNvbXBsZXRlRXJyb3JNZXNzYWdlO1xuICAgIH1cblxuICAgIGNvbXBsZXRlRXJyb3JNZXNzYWdlICs9IGVycm9yTWVzc2FnZTtcbiAgICByZXR1cm4gY29tcGxldGVFcnJvck1lc3NhZ2U7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlIGJvb2xlYW4gcGFzc2VkIHRvIGl0IGV2YWx1YXRlcyB0byBmYWxzZS5cbiAqIFRvIGJlIHVzZWQgbGlrZSB0aGlzOlxuICogXHRcdGFzc2VydChteURhdGUgIT09IHVuZGVmaW5lZCwgXCJEYXRlIGNhbm5vdCBiZSB1bmRlZmluZWQuXCIpO1xuICogQGFwaSBwdWJsaWNcbiAqIEBtZXRob2QgYXNzZXJ0XG4gKiBAcGFyYW0gIHtCb29sZWFufSBjb25kaXRpb24gLSBSZXN1bHQgb2YgdGhlIGV2YWx1YXRlZCBjb25kaXRpb25cbiAqIEBwYXJhbSAge1N0cmluZ30gZXJyb3JNZXNzYWdlIC0gTWVzc2FnZSBleHBsYWluaWcgdGhlIGVycm9yIGluIGNhc2UgaXQgaXMgdGhyb3duXG4gKiBAcmV0dXJuIHZvaWRcbiAqL1xuZnVuY3Rpb24gYXNzZXJ0KGNvbmRpdGlvbiwgZXJyb3JNZXNzYWdlKSB7XG4gIHZhciBlcnJvciA9IHByb2Nlc3NDb25kaXRpb24oY29uZGl0aW9uLCBlcnJvck1lc3NhZ2UpO1xuICBpZiAodHlwZW9mIGVycm9yID09PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBFcnJvcihlcnJvcik7XG4gIH1cbn1cblxuLyoqXG4gKiBMb2dzIGEgd2FybmluZyBpZiB0aGUgYm9vbGVhbiBwYXNzZWQgdG8gaXQgZXZhbHVhdGVzIHRvIGZhbHNlLlxuICogVG8gYmUgdXNlZCBsaWtlIHRoaXM6XG4gKiBcdFx0YXNzZXJ0Lndhcm4obXlEYXRlICE9PSB1bmRlZmluZWQsIFwiTm8gZGF0ZSBwcm92aWRlZC5cIik7XG4gKiBAYXBpIHB1YmxpY1xuICogQG1ldGhvZCB3YXJuXG4gKiBAcGFyYW0gIHtCb29sZWFufSBjb25kaXRpb24gLSBSZXN1bHQgb2YgdGhlIGV2YWx1YXRlZCBjb25kaXRpb25cbiAqIEBwYXJhbSAge1N0cmluZ30gZXJyb3JNZXNzYWdlIC0gTWVzc2FnZSBleHBsYWluaWcgdGhlIGVycm9yIGluIGNhc2UgaXQgaXMgdGhyb3duXG4gKiBAcmV0dXJuIHZvaWRcbiAqL1xuYXNzZXJ0Lndhcm4gPSBmdW5jdGlvbiB3YXJuKGNvbmRpdGlvbiwgZXJyb3JNZXNzYWdlKSB7XG4gIHZhciBlcnJvciA9IHByb2Nlc3NDb25kaXRpb24oY29uZGl0aW9uLCBlcnJvck1lc3NhZ2UpO1xuICBpZiAodHlwZW9mIGVycm9yID09PSAnc3RyaW5nJykge1xuICAgIGNvbnNvbGUud2FybihlcnJvcik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFzc2VydDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pSWl3aWMyOTFjbU5sY3lJNld5SmhjM05sY25RdWFuTWlYU3dpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpTHk4Z1FuVm5JR05vWldOcmFXNW5JR1oxYm1OMGFXOXVJSFJvWVhRZ2QybHNiQ0IwYUhKdmR5QmhiaUJsY25KdmNpQjNhR1Z1WlhabGNseHVMeThnZEdobElHTnZibVJwZEdsdmJpQnpaVzUwSUhSdklHbDBJR2x6SUdWMllXeDFZWFJsWkNCMGJ5Qm1ZV3h6WlZ4dUx5b3FYRzRnS2lCUWNtOWpaWE56WlhNZ2RHaGxJRzFsYzNOaFoyVWdZVzVrSUc5MWRIQjFkSE1nZEdobElHTnZjbkpsWTNRZ2JXVnpjMkZuWlNCcFppQjBhR1VnWTI5dVpHbDBhVzl1WEc0Z0tpQnBjeUJtWVd4elpTNGdUM1JvWlhKM2FYTmxJR2wwSUc5MWRIQjFkSE1nYm5Wc2JDNWNiaUFxSUVCaGNHa2djSEpwZG1GMFpWeHVJQ29nUUcxbGRHaHZaQ0J3Y205alpYTnpRMjl1WkdsMGFXOXVYRzRnS2lCQWNHRnlZVzBnSUh0Q2IyOXNaV0Z1ZlNCamIyNWthWFJwYjI0Z0xTQlNaWE4xYkhRZ2IyWWdkR2hsSUdWMllXeDFZWFJsWkNCamIyNWthWFJwYjI1Y2JpQXFJRUJ3WVhKaGJTQWdlMU4wY21sdVozMGdaWEp5YjNKTlpYTnpZV2RsSUMwZ1RXVnpjMkZuWlNCbGVIQnNZV2x1YVdjZ2RHaGxJR1Z5Y205eUlHbHVJR05oYzJVZ2FYUWdhWE1nZEdoeWIzZHVYRzRnS2lCQWNtVjBkWEp1SUh0VGRISnBibWNnZkNCdWRXeHNmU0FnTFNCRmNuSnZjaUJ0WlhOellXZGxJR2xtSUhSb1pYSmxJR2x6SUdGdUlHVnljbTl5TENCdWRXd2diM1JvWlhKM2FYTmxMbHh1SUNvdlhHNW1kVzVqZEdsdmJpQndjbTlqWlhOelEyOXVaR2wwYVc5dUtHTnZibVJwZEdsdmJpd2daWEp5YjNKTlpYTnpZV2RsS1NCN1hHNGdJR2xtSUNnaFkyOXVaR2wwYVc5dUtTQjdYRzRnSUNBZ2JHVjBJR052YlhCc1pYUmxSWEp5YjNKTlpYTnpZV2RsSUQwZ0p5YzdYRzRnSUNBZ1kyOXVjM1FnY21VZ1BTQXZZWFFnS0Z0ZVhGeHpYU3NwWEZ4elhGd29MMmM3WEc0Z0lDQWdZMjl1YzNRZ2MzUmhZMnRVY21GalpTQTlJRzVsZHlCRmNuSnZjaWdwTG5OMFlXTnJPMXh1SUNBZ0lHTnZibk4wSUhOMFlXTnJSblZ1WTNScGIyNXpJRDBnVzEwN1hHNWNiaUFnSUNCc1pYUWdablZ1WTA1aGJXVWdQU0J5WlM1bGVHVmpLSE4wWVdOclZISmhZMlVwTzF4dUlDQWdJSGRvYVd4bElDaG1kVzVqVG1GdFpTQW1KaUJtZFc1alRtRnRaVnN4WFNrZ2UxeHVJQ0FnSUNBZ2MzUmhZMnRHZFc1amRHbHZibk11Y0hWemFDaG1kVzVqVG1GdFpWc3hYU2s3WEc0Z0lDQWdJQ0JtZFc1alRtRnRaU0E5SUhKbExtVjRaV01vYzNSaFkydFVjbUZqWlNrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHk4Z1RuVnRZbVZ5SURBZ2FYTWdjSEp2WTJWemMwTnZibVJwZEdsdmJpQnBkSE5sYkdZc1hHNGdJQ0FnTHk4Z1RuVnRZbVZ5SURFZ2FYTWdZWE56WlhKMExGeHVJQ0FnSUM4dklFNTFiV0psY2lBeUlHbHpJSFJvWlNCallXeHNaWElnWm5WdVkzUnBiMjR1WEc0Z0lDQWdhV1lnS0hOMFlXTnJSblZ1WTNScGIyNXpXekpkS1NCN1hHNGdJQ0FnSUNCamIyMXdiR1YwWlVWeWNtOXlUV1Z6YzJGblpTQTlJR0FrZTNOMFlXTnJSblZ1WTNScGIyNXpXekpkZlRvZ0pIdGpiMjF3YkdWMFpVVnljbTl5VFdWemMyRm5aWDFnTzF4dUlDQWdJSDFjYmx4dUlDQWdJR052YlhCc1pYUmxSWEp5YjNKTlpYTnpZV2RsSUNzOUlHVnljbTl5VFdWemMyRm5aVHRjYmlBZ0lDQnlaWFIxY200Z1kyOXRjR3hsZEdWRmNuSnZjazFsYzNOaFoyVTdYRzRnSUgxY2JseHVJQ0J5WlhSMWNtNGdiblZzYkR0Y2JuMWNibHh1THlvcVhHNGdLaUJVYUhKdmQzTWdZVzRnWlhKeWIzSWdhV1lnZEdobElHSnZiMnhsWVc0Z2NHRnpjMlZrSUhSdklHbDBJR1YyWVd4MVlYUmxjeUIwYnlCbVlXeHpaUzVjYmlBcUlGUnZJR0psSUhWelpXUWdiR2xyWlNCMGFHbHpPbHh1SUNvZ1hIUmNkR0Z6YzJWeWRDaHRlVVJoZEdVZ0lUMDlJSFZ1WkdWbWFXNWxaQ3dnWENKRVlYUmxJR05oYm01dmRDQmlaU0IxYm1SbFptbHVaV1F1WENJcE8xeHVJQ29nUUdGd2FTQndkV0pzYVdOY2JpQXFJRUJ0WlhSb2IyUWdZWE56WlhKMFhHNGdLaUJBY0dGeVlXMGdJSHRDYjI5c1pXRnVmU0JqYjI1a2FYUnBiMjRnTFNCU1pYTjFiSFFnYjJZZ2RHaGxJR1YyWVd4MVlYUmxaQ0JqYjI1a2FYUnBiMjVjYmlBcUlFQndZWEpoYlNBZ2UxTjBjbWx1WjMwZ1pYSnliM0pOWlhOellXZGxJQzBnVFdWemMyRm5aU0JsZUhCc1lXbHVhV2NnZEdobElHVnljbTl5SUdsdUlHTmhjMlVnYVhRZ2FYTWdkR2h5YjNkdVhHNGdLaUJBY21WMGRYSnVJSFp2YVdSY2JpQXFMMXh1Wm5WdVkzUnBiMjRnWVhOelpYSjBLR052Ym1ScGRHbHZiaXdnWlhKeWIzSk5aWE56WVdkbEtTQjdYRzRnSUdOdmJuTjBJR1Z5Y205eUlEMGdjSEp2WTJWemMwTnZibVJwZEdsdmJpaGpiMjVrYVhScGIyNHNJR1Z5Y205eVRXVnpjMkZuWlNrN1hHNGdJR2xtSUNoMGVYQmxiMllnWlhKeWIzSWdQVDA5SUNkemRISnBibWNuS1NCN1hHNGdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLR1Z5Y205eUtUdGNiaUFnZlZ4dWZWeHVYRzR2S2lwY2JpQXFJRXh2WjNNZ1lTQjNZWEp1YVc1bklHbG1JSFJvWlNCaWIyOXNaV0Z1SUhCaGMzTmxaQ0IwYnlCcGRDQmxkbUZzZFdGMFpYTWdkRzhnWm1Gc2MyVXVYRzRnS2lCVWJ5QmlaU0IxYzJWa0lHeHBhMlVnZEdocGN6cGNiaUFxSUZ4MFhIUmhjM05sY25RdWQyRnliaWh0ZVVSaGRHVWdJVDA5SUhWdVpHVm1hVzVsWkN3Z1hDSk9ieUJrWVhSbElIQnliM1pwWkdWa0xsd2lLVHRjYmlBcUlFQmhjR2tnY0hWaWJHbGpYRzRnS2lCQWJXVjBhRzlrSUhkaGNtNWNiaUFxSUVCd1lYSmhiU0FnZTBKdmIyeGxZVzU5SUdOdmJtUnBkR2x2YmlBdElGSmxjM1ZzZENCdlppQjBhR1VnWlhaaGJIVmhkR1ZrSUdOdmJtUnBkR2x2Ymx4dUlDb2dRSEJoY21GdElDQjdVM1J5YVc1bmZTQmxjbkp2Y2sxbGMzTmhaMlVnTFNCTlpYTnpZV2RsSUdWNGNHeGhhVzVwWnlCMGFHVWdaWEp5YjNJZ2FXNGdZMkZ6WlNCcGRDQnBjeUIwYUhKdmQyNWNiaUFxSUVCeVpYUjFjbTRnZG05cFpGeHVJQ292WEc1aGMzTmxjblF1ZDJGeWJpQTlJR1oxYm1OMGFXOXVJSGRoY200b1kyOXVaR2wwYVc5dUxDQmxjbkp2Y2sxbGMzTmhaMlVwSUh0Y2JpQWdZMjl1YzNRZ1pYSnliM0lnUFNCd2NtOWpaWE56UTI5dVpHbDBhVzl1S0dOdmJtUnBkR2x2Yml3Z1pYSnliM0pOWlhOellXZGxLVHRjYmlBZ2FXWWdLSFI1Y0dWdlppQmxjbkp2Y2lBOVBUMGdKM04wY21sdVp5Y3BJSHRjYmlBZ0lDQmpiMjV6YjJ4bExuZGhjbTRvWlhKeWIzSXBPMXh1SUNCOVhHNTlPMXh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0JoYzNObGNuUTdYRzRpWFN3aVptbHNaU0k2SW1GemMyVnlkQzVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUl2YzI5MWNtTmxMeUo5XG4iLCIvKipcbiAqIFRlc3RzIHdoZXRoZXIgb3Igbm90IGFuIG9iamVjdCBpcyBhbiBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWwgVGhlIG9iamVjdCB0byB0ZXN0LlxuICogQHJldHVybiB7Qm9vbGVhbn0gYHRydWVgIGlmIGB2YWxgIGlzIGFuIGFycmF5LCBgZmFsc2VgIG90aGVyd2lzZS5cbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBfaXNBcnJheShbXSk7IC8vPT4gdHJ1ZVxuICogICAgICBfaXNBcnJheShudWxsKTsgLy89PiBmYWxzZVxuICogICAgICBfaXNBcnJheSh7fSk7IC8vPT4gZmFsc2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIF9pc0FycmF5KHZhbCkge1xuICByZXR1cm4gKHZhbCAhPSBudWxsICYmXG4gICAgICAgICAgdmFsLmxlbmd0aCA+PSAwICYmXG4gICAgICAgICAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5XScpO1xufTtcbiIsIi8qKlxuICogQW4gb3B0aW1pemVkLCBwcml2YXRlIGFycmF5IGBzbGljZWAgaW1wbGVtZW50YXRpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJndW1lbnRzfEFycmF5fSBhcmdzIFRoZSBhcnJheSBvciBhcmd1bWVudHMgb2JqZWN0IHRvIGNvbnNpZGVyLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtmcm9tPTBdIFRoZSBhcnJheSBpbmRleCB0byBzbGljZSBmcm9tLCBpbmNsdXNpdmUuXG4gKiBAcGFyYW0ge051bWJlcn0gW3RvPWFyZ3MubGVuZ3RoXSBUaGUgYXJyYXkgaW5kZXggdG8gc2xpY2UgdG8sIGV4Y2x1c2l2ZS5cbiAqIEByZXR1cm4ge0FycmF5fSBBIG5ldywgc2xpY2VkIGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIF9zbGljZShbMSwgMiwgMywgNCwgNV0sIDEsIDMpOyAvLz0+IFsyLCAzXVxuICpcbiAqICAgICAgdmFyIGZpcnN0VGhyZWVBcmdzID0gZnVuY3Rpb24oYSwgYiwgYywgZCkge1xuICogICAgICAgIHJldHVybiBfc2xpY2UoYXJndW1lbnRzLCAwLCAzKTtcbiAqICAgICAgfTtcbiAqICAgICAgZmlyc3RUaHJlZUFyZ3MoMSwgMiwgMywgNCk7IC8vPT4gWzEsIDIsIDNdXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX3NsaWNlKGFyZ3MsIGZyb20sIHRvKSB7XG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMTogcmV0dXJuIF9zbGljZShhcmdzLCAwLCBhcmdzLmxlbmd0aCk7XG4gICAgY2FzZSAyOiByZXR1cm4gX3NsaWNlKGFyZ3MsIGZyb20sIGFyZ3MubGVuZ3RoKTtcbiAgICBkZWZhdWx0OlxuICAgICAgdmFyIGxpc3QgPSBbXTtcbiAgICAgIHZhciBpZHggPSAwO1xuICAgICAgdmFyIGxlbiA9IE1hdGgubWF4KDAsIE1hdGgubWluKGFyZ3MubGVuZ3RoLCB0bykgLSBmcm9tKTtcbiAgICAgIHdoaWxlIChpZHggPCBsZW4pIHtcbiAgICAgICAgbGlzdFtpZHhdID0gYXJnc1tmcm9tICsgaWR4XTtcbiAgICAgICAgaWR4ICs9IDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gbGlzdDtcbiAgfVxufTtcbiIsInZhciBfaXNBcnJheSA9IHJlcXVpcmUoJy4vX2lzQXJyYXknKTtcbnZhciBfc2xpY2UgPSByZXF1aXJlKCcuL19zbGljZScpO1xuXG5cbi8qKlxuICogU2ltaWxhciB0byBoYXNNZXRob2QsIHRoaXMgY2hlY2tzIHdoZXRoZXIgYSBmdW5jdGlvbiBoYXMgYSBbbWV0aG9kbmFtZV1cbiAqIGZ1bmN0aW9uLiBJZiBpdCBpc24ndCBhbiBhcnJheSBpdCB3aWxsIGV4ZWN1dGUgdGhhdCBmdW5jdGlvbiBvdGhlcndpc2UgaXRcbiAqIHdpbGwgZGVmYXVsdCB0byB0aGUgcmFtZGEgaW1wbGVtZW50YXRpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIHJhbWRhIGltcGxlbXRhdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZG5hbWUgcHJvcGVydHkgdG8gY2hlY2sgZm9yIGEgY3VzdG9tIGltcGxlbWVudGF0aW9uXG4gKiBAcmV0dXJuIHtPYmplY3R9IFdoYXRldmVyIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIG1ldGhvZCBpcy5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfY2hlY2tGb3JNZXRob2QobWV0aG9kbmFtZSwgZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGlmIChsZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBmbigpO1xuICAgIH1cbiAgICB2YXIgb2JqID0gYXJndW1lbnRzW2xlbmd0aCAtIDFdO1xuICAgIHJldHVybiAoX2lzQXJyYXkob2JqKSB8fCB0eXBlb2Ygb2JqW21ldGhvZG5hbWVdICE9PSAnZnVuY3Rpb24nKSA/XG4gICAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDpcbiAgICAgIG9ialttZXRob2RuYW1lXS5hcHBseShvYmosIF9zbGljZShhcmd1bWVudHMsIDAsIGxlbmd0aCAtIDEpKTtcbiAgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9pc1BsYWNlaG9sZGVyKGEpIHtcbiAgcmV0dXJuIGEgIT0gbnVsbCAmJlxuICAgICAgICAgdHlwZW9mIGEgPT09ICdvYmplY3QnICYmXG4gICAgICAgICBhWydAQGZ1bmN0aW9uYWwvcGxhY2Vob2xkZXInXSA9PT0gdHJ1ZTtcbn07XG4iLCJ2YXIgX2lzUGxhY2Vob2xkZXIgPSByZXF1aXJlKCcuL19pc1BsYWNlaG9sZGVyJyk7XG5cblxuLyoqXG4gKiBPcHRpbWl6ZWQgaW50ZXJuYWwgb25lLWFyaXR5IGN1cnJ5IGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjdXJyeS5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgY3VycmllZCBmdW5jdGlvbi5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfY3VycnkxKGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiBmMShhKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDAgfHwgX2lzUGxhY2Vob2xkZXIoYSkpIHtcbiAgICAgIHJldHVybiBmMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9O1xufTtcbiIsInZhciBfY3VycnkxID0gcmVxdWlyZSgnLi9fY3VycnkxJyk7XG52YXIgX2lzUGxhY2Vob2xkZXIgPSByZXF1aXJlKCcuL19pc1BsYWNlaG9sZGVyJyk7XG5cblxuLyoqXG4gKiBPcHRpbWl6ZWQgaW50ZXJuYWwgdHdvLWFyaXR5IGN1cnJ5IGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjdXJyeS5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgY3VycmllZCBmdW5jdGlvbi5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfY3VycnkyKGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiBmMihhLCBiKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHJldHVybiBmMjtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgcmV0dXJuIF9pc1BsYWNlaG9sZGVyKGEpID8gZjJcbiAgICAgICAgICAgICA6IF9jdXJyeTEoZnVuY3Rpb24oX2IpIHsgcmV0dXJuIGZuKGEsIF9iKTsgfSk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gX2lzUGxhY2Vob2xkZXIoYSkgJiYgX2lzUGxhY2Vob2xkZXIoYikgPyBmMlxuICAgICAgICAgICAgIDogX2lzUGxhY2Vob2xkZXIoYSkgPyBfY3VycnkxKGZ1bmN0aW9uKF9hKSB7IHJldHVybiBmbihfYSwgYik7IH0pXG4gICAgICAgICAgICAgOiBfaXNQbGFjZWhvbGRlcihiKSA/IF9jdXJyeTEoZnVuY3Rpb24oX2IpIHsgcmV0dXJuIGZuKGEsIF9iKTsgfSlcbiAgICAgICAgICAgICA6IGZuKGEsIGIpO1xuICAgIH1cbiAgfTtcbn07XG4iLCJ2YXIgX2N1cnJ5MSA9IHJlcXVpcmUoJy4vX2N1cnJ5MScpO1xudmFyIF9jdXJyeTIgPSByZXF1aXJlKCcuL19jdXJyeTInKTtcbnZhciBfaXNQbGFjZWhvbGRlciA9IHJlcXVpcmUoJy4vX2lzUGxhY2Vob2xkZXInKTtcblxuXG4vKipcbiAqIE9wdGltaXplZCBpbnRlcm5hbCB0aHJlZS1hcml0eSBjdXJyeSBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY3VycnkuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGN1cnJpZWQgZnVuY3Rpb24uXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2N1cnJ5Myhmbikge1xuICByZXR1cm4gZnVuY3Rpb24gZjMoYSwgYiwgYykge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICByZXR1cm4gZjM7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHJldHVybiBfaXNQbGFjZWhvbGRlcihhKSA/IGYzXG4gICAgICAgICAgICAgOiBfY3VycnkyKGZ1bmN0aW9uKF9iLCBfYykgeyByZXR1cm4gZm4oYSwgX2IsIF9jKTsgfSk7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHJldHVybiBfaXNQbGFjZWhvbGRlcihhKSAmJiBfaXNQbGFjZWhvbGRlcihiKSA/IGYzXG4gICAgICAgICAgICAgOiBfaXNQbGFjZWhvbGRlcihhKSA/IF9jdXJyeTIoZnVuY3Rpb24oX2EsIF9jKSB7IHJldHVybiBmbihfYSwgYiwgX2MpOyB9KVxuICAgICAgICAgICAgIDogX2lzUGxhY2Vob2xkZXIoYikgPyBfY3VycnkyKGZ1bmN0aW9uKF9iLCBfYykgeyByZXR1cm4gZm4oYSwgX2IsIF9jKTsgfSlcbiAgICAgICAgICAgICA6IF9jdXJyeTEoZnVuY3Rpb24oX2MpIHsgcmV0dXJuIGZuKGEsIGIsIF9jKTsgfSk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gX2lzUGxhY2Vob2xkZXIoYSkgJiYgX2lzUGxhY2Vob2xkZXIoYikgJiYgX2lzUGxhY2Vob2xkZXIoYykgPyBmM1xuICAgICAgICAgICAgIDogX2lzUGxhY2Vob2xkZXIoYSkgJiYgX2lzUGxhY2Vob2xkZXIoYikgPyBfY3VycnkyKGZ1bmN0aW9uKF9hLCBfYikgeyByZXR1cm4gZm4oX2EsIF9iLCBjKTsgfSlcbiAgICAgICAgICAgICA6IF9pc1BsYWNlaG9sZGVyKGEpICYmIF9pc1BsYWNlaG9sZGVyKGMpID8gX2N1cnJ5MihmdW5jdGlvbihfYSwgX2MpIHsgcmV0dXJuIGZuKF9hLCBiLCBfYyk7IH0pXG4gICAgICAgICAgICAgOiBfaXNQbGFjZWhvbGRlcihiKSAmJiBfaXNQbGFjZWhvbGRlcihjKSA/IF9jdXJyeTIoZnVuY3Rpb24oX2IsIF9jKSB7IHJldHVybiBmbihhLCBfYiwgX2MpOyB9KVxuICAgICAgICAgICAgIDogX2lzUGxhY2Vob2xkZXIoYSkgPyBfY3VycnkxKGZ1bmN0aW9uKF9hKSB7IHJldHVybiBmbihfYSwgYiwgYyk7IH0pXG4gICAgICAgICAgICAgOiBfaXNQbGFjZWhvbGRlcihiKSA/IF9jdXJyeTEoZnVuY3Rpb24oX2IpIHsgcmV0dXJuIGZuKGEsIF9iLCBjKTsgfSlcbiAgICAgICAgICAgICA6IF9pc1BsYWNlaG9sZGVyKGMpID8gX2N1cnJ5MShmdW5jdGlvbihfYykgeyByZXR1cm4gZm4oYSwgYiwgX2MpOyB9KVxuICAgICAgICAgICAgIDogZm4oYSwgYiwgYyk7XG4gICAgfVxuICB9O1xufTtcbiIsInZhciBfY2hlY2tGb3JNZXRob2QgPSByZXF1aXJlKCcuL2ludGVybmFsL19jaGVja0Zvck1ldGhvZCcpO1xudmFyIF9jdXJyeTMgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTMnKTtcblxuXG4vKipcbiAqIFJldHVybnMgdGhlIGVsZW1lbnRzIG9mIHRoZSBnaXZlbiBsaXN0IG9yIHN0cmluZyAob3Igb2JqZWN0IHdpdGggYSBgc2xpY2VgXG4gKiBtZXRob2QpIGZyb20gYGZyb21JbmRleGAgKGluY2x1c2l2ZSkgdG8gYHRvSW5kZXhgIChleGNsdXNpdmUpLlxuICpcbiAqIERpc3BhdGNoZXMgdG8gdGhlIGBzbGljZWAgbWV0aG9kIG9mIHRoZSB0aGlyZCBhcmd1bWVudCwgaWYgcHJlc2VudC5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjRcbiAqIEBjYXRlZ29yeSBMaXN0XG4gKiBAc2lnIE51bWJlciAtPiBOdW1iZXIgLT4gW2FdIC0+IFthXVxuICogQHNpZyBOdW1iZXIgLT4gTnVtYmVyIC0+IFN0cmluZyAtPiBTdHJpbmdcbiAqIEBwYXJhbSB7TnVtYmVyfSBmcm9tSW5kZXggVGhlIHN0YXJ0IGluZGV4IChpbmNsdXNpdmUpLlxuICogQHBhcmFtIHtOdW1iZXJ9IHRvSW5kZXggVGhlIGVuZCBpbmRleCAoZXhjbHVzaXZlKS5cbiAqIEBwYXJhbSB7Kn0gbGlzdFxuICogQHJldHVybiB7Kn1cbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLnNsaWNlKDEsIDMsIFsnYScsICdiJywgJ2MnLCAnZCddKTsgICAgICAgIC8vPT4gWydiJywgJ2MnXVxuICogICAgICBSLnNsaWNlKDEsIEluZmluaXR5LCBbJ2EnLCAnYicsICdjJywgJ2QnXSk7IC8vPT4gWydiJywgJ2MnLCAnZCddXG4gKiAgICAgIFIuc2xpY2UoMCwgLTEsIFsnYScsICdiJywgJ2MnLCAnZCddKTsgICAgICAgLy89PiBbJ2EnLCAnYicsICdjJ11cbiAqICAgICAgUi5zbGljZSgtMywgLTEsIFsnYScsICdiJywgJ2MnLCAnZCddKTsgICAgICAvLz0+IFsnYicsICdjJ11cbiAqICAgICAgUi5zbGljZSgwLCAzLCAncmFtZGEnKTsgICAgICAgICAgICAgICAgICAgICAvLz0+ICdyYW0nXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MyhfY2hlY2tGb3JNZXRob2QoJ3NsaWNlJywgZnVuY3Rpb24gc2xpY2UoZnJvbUluZGV4LCB0b0luZGV4LCBsaXN0KSB7XG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChsaXN0LCBmcm9tSW5kZXgsIHRvSW5kZXgpO1xufSkpO1xuIiwidmFyIF9jdXJyeTMgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTMnKTtcblxuXG4vKipcbiAqIFJldHVybnMgdGhlIHJlc3VsdCBvZiBcInNldHRpbmdcIiB0aGUgcG9ydGlvbiBvZiB0aGUgZ2l2ZW4gZGF0YSBzdHJ1Y3R1cmVcbiAqIGZvY3VzZWQgYnkgdGhlIGdpdmVuIGxlbnMgdG8gdGhlIHJlc3VsdCBvZiBhcHBseWluZyB0aGUgZ2l2ZW4gZnVuY3Rpb24gdG9cbiAqIHRoZSBmb2N1c2VkIHZhbHVlLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjE2LjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEB0eXBlZGVmbiBMZW5zIHMgYSA9IEZ1bmN0b3IgZiA9PiAoYSAtPiBmIGEpIC0+IHMgLT4gZiBzXG4gKiBAc2lnIExlbnMgcyBhIC0+IChhIC0+IGEpIC0+IHMgLT4gc1xuICogQHBhcmFtIHtMZW5zfSBsZW5zXG4gKiBAcGFyYW0geyp9IHZcbiAqIEBwYXJhbSB7Kn0geFxuICogQHJldHVybiB7Kn1cbiAqIEBzZWUgUi5wcm9wLCBSLmxlbnNJbmRleCwgUi5sZW5zUHJvcFxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIHZhciBoZWFkTGVucyA9IFIubGVuc0luZGV4KDApO1xuICpcbiAqICAgICAgUi5vdmVyKGhlYWRMZW5zLCBSLnRvVXBwZXIsIFsnZm9vJywgJ2JhcicsICdiYXonXSk7IC8vPT4gWydGT08nLCAnYmFyJywgJ2JheiddXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICAvLyBgSWRlbnRpdHlgIGlzIGEgZnVuY3RvciB0aGF0IGhvbGRzIGEgc2luZ2xlIHZhbHVlLCB3aGVyZSBgbWFwYCBzaW1wbHlcbiAgLy8gdHJhbnNmb3JtcyB0aGUgaGVsZCB2YWx1ZSB3aXRoIHRoZSBwcm92aWRlZCBmdW5jdGlvbi5cbiAgdmFyIElkZW50aXR5ID0gZnVuY3Rpb24oeCkge1xuICAgIHJldHVybiB7dmFsdWU6IHgsIG1hcDogZnVuY3Rpb24oZikgeyByZXR1cm4gSWRlbnRpdHkoZih4KSk7IH19O1xuICB9O1xuXG4gIHJldHVybiBfY3VycnkzKGZ1bmN0aW9uIG92ZXIobGVucywgZiwgeCkge1xuICAgIC8vIFRoZSB2YWx1ZSByZXR1cm5lZCBieSB0aGUgZ2V0dGVyIGZ1bmN0aW9uIGlzIGZpcnN0IHRyYW5zZm9ybWVkIHdpdGggYGZgLFxuICAgIC8vIHRoZW4gc2V0IGFzIHRoZSB2YWx1ZSBvZiBhbiBgSWRlbnRpdHlgLiBUaGlzIGlzIHRoZW4gbWFwcGVkIG92ZXIgd2l0aCB0aGVcbiAgICAvLyBzZXR0ZXIgZnVuY3Rpb24gb2YgdGhlIGxlbnMuXG4gICAgcmV0dXJuIGxlbnMoZnVuY3Rpb24oeSkgeyByZXR1cm4gSWRlbnRpdHkoZih5KSk7IH0pKHgpLnZhbHVlO1xuICB9KTtcbn0oKSk7XG4iLCJ2YXIgX2N1cnJ5MSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MScpO1xuXG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgYWx3YXlzIHJldHVybnMgdGhlIGdpdmVuIHZhbHVlLiBOb3RlIHRoYXQgZm9yXG4gKiBub24tcHJpbWl0aXZlcyB0aGUgdmFsdWUgcmV0dXJuZWQgaXMgYSByZWZlcmVuY2UgdG8gdGhlIG9yaWdpbmFsIHZhbHVlLlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gaXMga25vd24gYXMgYGNvbnN0YCwgYGNvbnN0YW50YCwgb3IgYEtgIChmb3IgSyBjb21iaW5hdG9yKSBpblxuICogb3RoZXIgbGFuZ3VhZ2VzIGFuZCBsaWJyYXJpZXMuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBzaWcgYSAtPiAoKiAtPiBhKVxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHdyYXAgaW4gYSBmdW5jdGlvblxuICogQHJldHVybiB7RnVuY3Rpb259IEEgRnVuY3Rpb24gOjogKiAtPiB2YWwuXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgdmFyIHQgPSBSLmFsd2F5cygnVGVlJyk7XG4gKiAgICAgIHQoKTsgLy89PiAnVGVlJ1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTEoZnVuY3Rpb24gYWx3YXlzKHZhbCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHZhbDtcbiAgfTtcbn0pO1xuIiwidmFyIF9jdXJyeTMgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTMnKTtcbnZhciBhbHdheXMgPSByZXF1aXJlKCcuL2Fsd2F5cycpO1xudmFyIG92ZXIgPSByZXF1aXJlKCcuL292ZXInKTtcblxuXG4vKipcbiAqIFJldHVybnMgdGhlIHJlc3VsdCBvZiBcInNldHRpbmdcIiB0aGUgcG9ydGlvbiBvZiB0aGUgZ2l2ZW4gZGF0YSBzdHJ1Y3R1cmVcbiAqIGZvY3VzZWQgYnkgdGhlIGdpdmVuIGxlbnMgdG8gdGhlIGdpdmVuIHZhbHVlLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjE2LjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEB0eXBlZGVmbiBMZW5zIHMgYSA9IEZ1bmN0b3IgZiA9PiAoYSAtPiBmIGEpIC0+IHMgLT4gZiBzXG4gKiBAc2lnIExlbnMgcyBhIC0+IGEgLT4gcyAtPiBzXG4gKiBAcGFyYW0ge0xlbnN9IGxlbnNcbiAqIEBwYXJhbSB7Kn0gdlxuICogQHBhcmFtIHsqfSB4XG4gKiBAcmV0dXJuIHsqfVxuICogQHNlZSBSLnByb3AsIFIubGVuc0luZGV4LCBSLmxlbnNQcm9wXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgdmFyIHhMZW5zID0gUi5sZW5zUHJvcCgneCcpO1xuICpcbiAqICAgICAgUi5zZXQoeExlbnMsIDQsIHt4OiAxLCB5OiAyfSk7ICAvLz0+IHt4OiA0LCB5OiAyfVxuICogICAgICBSLnNldCh4TGVucywgOCwge3g6IDEsIHk6IDJ9KTsgIC8vPT4ge3g6IDgsIHk6IDJ9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MyhmdW5jdGlvbiBzZXQobGVucywgdiwgeCkge1xuICByZXR1cm4gb3ZlcihsZW5zLCBhbHdheXModiksIHgpO1xufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9hcml0eShuLCBmbikge1xuICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuICBzd2l0Y2ggKG4pIHtcbiAgICBjYXNlIDA6IHJldHVybiBmdW5jdGlvbigpIHsgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH07XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24oYTApIHsgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24oYTAsIGExKSB7IHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKGEwLCBhMSwgYTIpIHsgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH07XG4gICAgY2FzZSA0OiByZXR1cm4gZnVuY3Rpb24oYTAsIGExLCBhMiwgYTMpIHsgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH07XG4gICAgY2FzZSA1OiByZXR1cm4gZnVuY3Rpb24oYTAsIGExLCBhMiwgYTMsIGE0KSB7IHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9O1xuICAgIGNhc2UgNjogcmV0dXJuIGZ1bmN0aW9uKGEwLCBhMSwgYTIsIGEzLCBhNCwgYTUpIHsgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH07XG4gICAgY2FzZSA3OiByZXR1cm4gZnVuY3Rpb24oYTAsIGExLCBhMiwgYTMsIGE0LCBhNSwgYTYpIHsgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH07XG4gICAgY2FzZSA4OiByZXR1cm4gZnVuY3Rpb24oYTAsIGExLCBhMiwgYTMsIGE0LCBhNSwgYTYsIGE3KSB7IHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9O1xuICAgIGNhc2UgOTogcmV0dXJuIGZ1bmN0aW9uKGEwLCBhMSwgYTIsIGEzLCBhNCwgYTUsIGE2LCBhNywgYTgpIHsgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH07XG4gICAgY2FzZSAxMDogcmV0dXJuIGZ1bmN0aW9uKGEwLCBhMSwgYTIsIGEzLCBhNCwgYTUsIGE2LCBhNywgYTgsIGE5KSB7IHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9O1xuICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcignRmlyc3QgYXJndW1lbnQgdG8gX2FyaXR5IG11c3QgYmUgYSBub24tbmVnYXRpdmUgaW50ZWdlciBubyBncmVhdGVyIHRoYW4gdGVuJyk7XG4gIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9waXBlKGYsIGcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBnLmNhbGwodGhpcywgZi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gWFdyYXAoZm4pIHtcbiAgICB0aGlzLmYgPSBmbjtcbiAgfVxuICBYV3JhcC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9pbml0J10gPSBmdW5jdGlvbigpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2luaXQgbm90IGltcGxlbWVudGVkIG9uIFhXcmFwJyk7XG4gIH07XG4gIFhXcmFwLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddID0gZnVuY3Rpb24oYWNjKSB7IHJldHVybiBhY2M7IH07XG4gIFhXcmFwLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3N0ZXAnXSA9IGZ1bmN0aW9uKGFjYywgeCkge1xuICAgIHJldHVybiB0aGlzLmYoYWNjLCB4KTtcbiAgfTtcblxuICByZXR1cm4gZnVuY3Rpb24gX3h3cmFwKGZuKSB7IHJldHVybiBuZXcgWFdyYXAoZm4pOyB9O1xufSgpKTtcbiIsInZhciBfYXJpdHkgPSByZXF1aXJlKCcuL2ludGVybmFsL19hcml0eScpO1xudmFyIF9jdXJyeTIgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTInKTtcblxuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGlzIGJvdW5kIHRvIGEgY29udGV4dC5cbiAqIE5vdGU6IGBSLmJpbmRgIGRvZXMgbm90IHByb3ZpZGUgdGhlIGFkZGl0aW9uYWwgYXJndW1lbnQtYmluZGluZyBjYXBhYmlsaXRpZXMgb2ZcbiAqIFtGdW5jdGlvbi5wcm90b3R5cGUuYmluZF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvRnVuY3Rpb24vYmluZCkuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuNi4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBzaWcgKCogLT4gKikgLT4geyp9IC0+ICgqIC0+ICopXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gYmluZCB0byBjb250ZXh0XG4gKiBAcGFyYW0ge09iamVjdH0gdGhpc09iaiBUaGUgY29udGV4dCB0byBiaW5kIGBmbmAgdG9cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBBIGZ1bmN0aW9uIHRoYXQgd2lsbCBleGVjdXRlIGluIHRoZSBjb250ZXh0IG9mIGB0aGlzT2JqYC5cbiAqIEBzZWUgUi5wYXJ0aWFsXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgdmFyIGxvZyA9IFIuYmluZChjb25zb2xlLmxvZywgY29uc29sZSk7XG4gKiAgICAgIFIucGlwZShSLmFzc29jKCdhJywgMiksIFIudGFwKGxvZyksIFIuYXNzb2MoJ2EnLCAzKSkoe2E6IDF9KTsgLy89PiB7YTogM31cbiAqICAgICAgLy8gbG9ncyB7YTogMn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkyKGZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNPYmopIHtcbiAgcmV0dXJuIF9hcml0eShmbi5sZW5ndGgsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmbi5hcHBseSh0aGlzT2JqLCBhcmd1bWVudHMpO1xuICB9KTtcbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfaXNTdHJpbmcoeCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHgpID09PSAnW29iamVjdCBTdHJpbmddJztcbn07XG4iLCJ2YXIgX2N1cnJ5MSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MScpO1xudmFyIF9pc0FycmF5ID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9faXNBcnJheScpO1xudmFyIF9pc1N0cmluZyA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2lzU3RyaW5nJyk7XG5cblxuLyoqXG4gKiBUZXN0cyB3aGV0aGVyIG9yIG5vdCBhbiBvYmplY3QgaXMgc2ltaWxhciB0byBhbiBhcnJheS5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC41LjBcbiAqIEBjYXRlZ29yeSBUeXBlXG4gKiBAY2F0ZWdvcnkgTGlzdFxuICogQHNpZyAqIC0+IEJvb2xlYW5cbiAqIEBwYXJhbSB7Kn0geCBUaGUgb2JqZWN0IHRvIHRlc3QuXG4gKiBAcmV0dXJuIHtCb29sZWFufSBgdHJ1ZWAgaWYgYHhgIGhhcyBhIG51bWVyaWMgbGVuZ3RoIHByb3BlcnR5IGFuZCBleHRyZW1lIGluZGljZXMgZGVmaW5lZDsgYGZhbHNlYCBvdGhlcndpc2UuXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi5pc0FycmF5TGlrZShbXSk7IC8vPT4gdHJ1ZVxuICogICAgICBSLmlzQXJyYXlMaWtlKHRydWUpOyAvLz0+IGZhbHNlXG4gKiAgICAgIFIuaXNBcnJheUxpa2Uoe30pOyAvLz0+IGZhbHNlXG4gKiAgICAgIFIuaXNBcnJheUxpa2Uoe2xlbmd0aDogMTB9KTsgLy89PiBmYWxzZVxuICogICAgICBSLmlzQXJyYXlMaWtlKHswOiAnemVybycsIDk6ICduaW5lJywgbGVuZ3RoOiAxMH0pOyAvLz0+IHRydWVcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkxKGZ1bmN0aW9uIGlzQXJyYXlMaWtlKHgpIHtcbiAgaWYgKF9pc0FycmF5KHgpKSB7IHJldHVybiB0cnVlOyB9XG4gIGlmICgheCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKHR5cGVvZiB4ICE9PSAnb2JqZWN0JykgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKF9pc1N0cmluZyh4KSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKHgubm9kZVR5cGUgPT09IDEpIHsgcmV0dXJuICEheC5sZW5ndGg7IH1cbiAgaWYgKHgubGVuZ3RoID09PSAwKSB7IHJldHVybiB0cnVlOyB9XG4gIGlmICh4Lmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4geC5oYXNPd25Qcm9wZXJ0eSgwKSAmJiB4Lmhhc093blByb3BlcnR5KHgubGVuZ3RoIC0gMSk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufSk7XG4iLCJ2YXIgX3h3cmFwID0gcmVxdWlyZSgnLi9feHdyYXAnKTtcbnZhciBiaW5kID0gcmVxdWlyZSgnLi4vYmluZCcpO1xudmFyIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi4vaXNBcnJheUxpa2UnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gX2FycmF5UmVkdWNlKHhmLCBhY2MsIGxpc3QpIHtcbiAgICB2YXIgaWR4ID0gMDtcbiAgICB2YXIgbGVuID0gbGlzdC5sZW5ndGg7XG4gICAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgICAgYWNjID0geGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10oYWNjLCBsaXN0W2lkeF0pO1xuICAgICAgaWYgKGFjYyAmJiBhY2NbJ0BAdHJhbnNkdWNlci9yZWR1Y2VkJ10pIHtcbiAgICAgICAgYWNjID0gYWNjWydAQHRyYW5zZHVjZXIvdmFsdWUnXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZHggKz0gMTtcbiAgICB9XG4gICAgcmV0dXJuIHhmWydAQHRyYW5zZHVjZXIvcmVzdWx0J10oYWNjKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9pdGVyYWJsZVJlZHVjZSh4ZiwgYWNjLCBpdGVyKSB7XG4gICAgdmFyIHN0ZXAgPSBpdGVyLm5leHQoKTtcbiAgICB3aGlsZSAoIXN0ZXAuZG9uZSkge1xuICAgICAgYWNjID0geGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10oYWNjLCBzdGVwLnZhbHVlKTtcbiAgICAgIGlmIChhY2MgJiYgYWNjWydAQHRyYW5zZHVjZXIvcmVkdWNlZCddKSB7XG4gICAgICAgIGFjYyA9IGFjY1snQEB0cmFuc2R1Y2VyL3ZhbHVlJ107XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgc3RlcCA9IGl0ZXIubmV4dCgpO1xuICAgIH1cbiAgICByZXR1cm4geGZbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXShhY2MpO1xuICB9XG5cbiAgZnVuY3Rpb24gX21ldGhvZFJlZHVjZSh4ZiwgYWNjLCBvYmopIHtcbiAgICByZXR1cm4geGZbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXShvYmoucmVkdWNlKGJpbmQoeGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10sIHhmKSwgYWNjKSk7XG4gIH1cblxuICB2YXIgc3ltSXRlcmF0b3IgPSAodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcpID8gU3ltYm9sLml0ZXJhdG9yIDogJ0BAaXRlcmF0b3InO1xuICByZXR1cm4gZnVuY3Rpb24gX3JlZHVjZShmbiwgYWNjLCBsaXN0KSB7XG4gICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZm4gPSBfeHdyYXAoZm4pO1xuICAgIH1cbiAgICBpZiAoaXNBcnJheUxpa2UobGlzdCkpIHtcbiAgICAgIHJldHVybiBfYXJyYXlSZWR1Y2UoZm4sIGFjYywgbGlzdCk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgbGlzdC5yZWR1Y2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBfbWV0aG9kUmVkdWNlKGZuLCBhY2MsIGxpc3QpO1xuICAgIH1cbiAgICBpZiAobGlzdFtzeW1JdGVyYXRvcl0gIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIF9pdGVyYWJsZVJlZHVjZShmbiwgYWNjLCBsaXN0W3N5bUl0ZXJhdG9yXSgpKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBsaXN0Lm5leHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBfaXRlcmFibGVSZWR1Y2UoZm4sIGFjYywgbGlzdCk7XG4gICAgfVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3JlZHVjZTogbGlzdCBtdXN0IGJlIGFycmF5IG9yIGl0ZXJhYmxlJyk7XG4gIH07XG59KCkpO1xuIiwidmFyIF9jdXJyeTMgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTMnKTtcbnZhciBfcmVkdWNlID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fcmVkdWNlJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIGEgc2luZ2xlIGl0ZW0gYnkgaXRlcmF0aW5nIHRocm91Z2ggdGhlIGxpc3QsIHN1Y2Nlc3NpdmVseSBjYWxsaW5nXG4gKiB0aGUgaXRlcmF0b3IgZnVuY3Rpb24gYW5kIHBhc3NpbmcgaXQgYW4gYWNjdW11bGF0b3IgdmFsdWUgYW5kIHRoZSBjdXJyZW50XG4gKiB2YWx1ZSBmcm9tIHRoZSBhcnJheSwgYW5kIHRoZW4gcGFzc2luZyB0aGUgcmVzdWx0IHRvIHRoZSBuZXh0IGNhbGwuXG4gKlxuICogVGhlIGl0ZXJhdG9yIGZ1bmN0aW9uIHJlY2VpdmVzIHR3byB2YWx1ZXM6ICooYWNjLCB2YWx1ZSkqLiBJdCBtYXkgdXNlXG4gKiBgUi5yZWR1Y2VkYCB0byBzaG9ydGN1dCB0aGUgaXRlcmF0aW9uLlxuICpcbiAqIE5vdGU6IGBSLnJlZHVjZWAgZG9lcyBub3Qgc2tpcCBkZWxldGVkIG9yIHVuYXNzaWduZWQgaW5kaWNlcyAoc3BhcnNlXG4gKiBhcnJheXMpLCB1bmxpa2UgdGhlIG5hdGl2ZSBgQXJyYXkucHJvdG90eXBlLnJlZHVjZWAgbWV0aG9kLiBGb3IgbW9yZSBkZXRhaWxzXG4gKiBvbiB0aGlzIGJlaGF2aW9yLCBzZWU6XG4gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9yZWR1Y2UjRGVzY3JpcHRpb25cbiAqXG4gKiBEaXNwYXRjaGVzIHRvIHRoZSBgcmVkdWNlYCBtZXRob2Qgb2YgdGhlIHRoaXJkIGFyZ3VtZW50LCBpZiBwcmVzZW50LlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjEuMFxuICogQGNhdGVnb3J5IExpc3RcbiAqIEBzaWcgKChhLCBiKSAtPiBhKSAtPiBhIC0+IFtiXSAtPiBhXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgaXRlcmF0b3IgZnVuY3Rpb24uIFJlY2VpdmVzIHR3byB2YWx1ZXMsIHRoZSBhY2N1bXVsYXRvciBhbmQgdGhlXG4gKiAgICAgICAgY3VycmVudCBlbGVtZW50IGZyb20gdGhlIGFycmF5LlxuICogQHBhcmFtIHsqfSBhY2MgVGhlIGFjY3VtdWxhdG9yIHZhbHVlLlxuICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgbGlzdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcmV0dXJuIHsqfSBUaGUgZmluYWwsIGFjY3VtdWxhdGVkIHZhbHVlLlxuICogQHNlZSBSLnJlZHVjZWQsIFIuYWRkSW5kZXhcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICB2YXIgbnVtYmVycyA9IFsxLCAyLCAzXTtcbiAqICAgICAgdmFyIHBsdXMgPSAoYSwgYikgPT4gYSArIGI7XG4gKlxuICogICAgICBSLnJlZHVjZShwbHVzLCAxMCwgbnVtYmVycyk7IC8vPT4gMTZcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkzKF9yZWR1Y2UpO1xuIiwidmFyIF9jaGVja0Zvck1ldGhvZCA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2NoZWNrRm9yTWV0aG9kJyk7XG52YXIgc2xpY2UgPSByZXF1aXJlKCcuL3NsaWNlJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIGFsbCBidXQgdGhlIGZpcnN0IGVsZW1lbnQgb2YgdGhlIGdpdmVuIGxpc3Qgb3Igc3RyaW5nIChvciBvYmplY3RcbiAqIHdpdGggYSBgdGFpbGAgbWV0aG9kKS5cbiAqXG4gKiBEaXNwYXRjaGVzIHRvIHRoZSBgc2xpY2VgIG1ldGhvZCBvZiB0aGUgZmlyc3QgYXJndW1lbnQsIGlmIHByZXNlbnQuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMS4wXG4gKiBAY2F0ZWdvcnkgTGlzdFxuICogQHNpZyBbYV0gLT4gW2FdXG4gKiBAc2lnIFN0cmluZyAtPiBTdHJpbmdcbiAqIEBwYXJhbSB7Kn0gbGlzdFxuICogQHJldHVybiB7Kn1cbiAqIEBzZWUgUi5oZWFkLCBSLmluaXQsIFIubGFzdFxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIFIudGFpbChbMSwgMiwgM10pOyAgLy89PiBbMiwgM11cbiAqICAgICAgUi50YWlsKFsxLCAyXSk7ICAgICAvLz0+IFsyXVxuICogICAgICBSLnRhaWwoWzFdKTsgICAgICAgIC8vPT4gW11cbiAqICAgICAgUi50YWlsKFtdKTsgICAgICAgICAvLz0+IFtdXG4gKlxuICogICAgICBSLnRhaWwoJ2FiYycpOyAgLy89PiAnYmMnXG4gKiAgICAgIFIudGFpbCgnYWInKTsgICAvLz0+ICdiJ1xuICogICAgICBSLnRhaWwoJ2EnKTsgICAgLy89PiAnJ1xuICogICAgICBSLnRhaWwoJycpOyAgICAgLy89PiAnJ1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jaGVja0Zvck1ldGhvZCgndGFpbCcsIHNsaWNlKDEsIEluZmluaXR5KSk7XG4iLCJ2YXIgX2FyaXR5ID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fYXJpdHknKTtcbnZhciBfcGlwZSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX3BpcGUnKTtcbnZhciByZWR1Y2UgPSByZXF1aXJlKCcuL3JlZHVjZScpO1xudmFyIHRhaWwgPSByZXF1aXJlKCcuL3RhaWwnKTtcblxuXG4vKipcbiAqIFBlcmZvcm1zIGxlZnQtdG8tcmlnaHQgZnVuY3Rpb24gY29tcG9zaXRpb24uIFRoZSBsZWZ0bW9zdCBmdW5jdGlvbiBtYXkgaGF2ZVxuICogYW55IGFyaXR5OyB0aGUgcmVtYWluaW5nIGZ1bmN0aW9ucyBtdXN0IGJlIHVuYXJ5LlxuICpcbiAqIEluIHNvbWUgbGlicmFyaWVzIHRoaXMgZnVuY3Rpb24gaXMgbmFtZWQgYHNlcXVlbmNlYC5cbiAqXG4gKiAqKk5vdGU6KiogVGhlIHJlc3VsdCBvZiBwaXBlIGlzIG5vdCBhdXRvbWF0aWNhbGx5IGN1cnJpZWQuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBzaWcgKCgoYSwgYiwgLi4uLCBuKSAtPiBvKSwgKG8gLT4gcCksIC4uLiwgKHggLT4geSksICh5IC0+IHopKSAtPiAoKGEsIGIsIC4uLiwgbikgLT4geilcbiAqIEBwYXJhbSB7Li4uRnVuY3Rpb259IGZ1bmN0aW9uc1xuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiBAc2VlIFIuY29tcG9zZVxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIHZhciBmID0gUi5waXBlKE1hdGgucG93LCBSLm5lZ2F0ZSwgUi5pbmMpO1xuICpcbiAqICAgICAgZigzLCA0KTsgLy8gLSgzXjQpICsgMVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBpcGUoKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwaXBlIHJlcXVpcmVzIGF0IGxlYXN0IG9uZSBhcmd1bWVudCcpO1xuICB9XG4gIHJldHVybiBfYXJpdHkoYXJndW1lbnRzWzBdLmxlbmd0aCxcbiAgICAgICAgICAgICAgICByZWR1Y2UoX3BpcGUsIGFyZ3VtZW50c1swXSwgdGFpbChhcmd1bWVudHMpKSk7XG59O1xuIiwiLyoqXG4gKiBQcml2YXRlIGBjb25jYXRgIGZ1bmN0aW9uIHRvIG1lcmdlIHR3byBhcnJheS1saWtlIG9iamVjdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl8QXJndW1lbnRzfSBbc2V0MT1bXV0gQW4gYXJyYXktbGlrZSBvYmplY3QuXG4gKiBAcGFyYW0ge0FycmF5fEFyZ3VtZW50c30gW3NldDI9W11dIEFuIGFycmF5LWxpa2Ugb2JqZWN0LlxuICogQHJldHVybiB7QXJyYXl9IEEgbmV3LCBtZXJnZWQgYXJyYXkuXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgX2NvbmNhdChbNCwgNSwgNl0sIFsxLCAyLCAzXSk7IC8vPT4gWzQsIDUsIDYsIDEsIDIsIDNdXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2NvbmNhdChzZXQxLCBzZXQyKSB7XG4gIHNldDEgPSBzZXQxIHx8IFtdO1xuICBzZXQyID0gc2V0MiB8fCBbXTtcbiAgdmFyIGlkeDtcbiAgdmFyIGxlbjEgPSBzZXQxLmxlbmd0aDtcbiAgdmFyIGxlbjIgPSBzZXQyLmxlbmd0aDtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gIGlkeCA9IDA7XG4gIHdoaWxlIChpZHggPCBsZW4xKSB7XG4gICAgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdID0gc2V0MVtpZHhdO1xuICAgIGlkeCArPSAxO1xuICB9XG4gIGlkeCA9IDA7XG4gIHdoaWxlIChpZHggPCBsZW4yKSB7XG4gICAgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdID0gc2V0MltpZHhdO1xuICAgIGlkeCArPSAxO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwidmFyIF9jb25jYXQgPSByZXF1aXJlKCcuL2ludGVybmFsL19jb25jYXQnKTtcbnZhciBfY3VycnkyID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkyJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIGEgbmV3IGxpc3Qgd2l0aCB0aGUgZ2l2ZW4gZWxlbWVudCBhdCB0aGUgZnJvbnQsIGZvbGxvd2VkIGJ5IHRoZVxuICogY29udGVudHMgb2YgdGhlIGxpc3QuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMS4wXG4gKiBAY2F0ZWdvcnkgTGlzdFxuICogQHNpZyBhIC0+IFthXSAtPiBbYV1cbiAqIEBwYXJhbSB7Kn0gZWwgVGhlIGl0ZW0gdG8gYWRkIHRvIHRoZSBoZWFkIG9mIHRoZSBvdXRwdXQgbGlzdC5cbiAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGFycmF5IHRvIGFkZCB0byB0aGUgdGFpbCBvZiB0aGUgb3V0cHV0IGxpc3QuXG4gKiBAcmV0dXJuIHtBcnJheX0gQSBuZXcgYXJyYXkuXG4gKiBAc2VlIFIuYXBwZW5kXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi5wcmVwZW5kKCdmZWUnLCBbJ2ZpJywgJ2ZvJywgJ2Z1bSddKTsgLy89PiBbJ2ZlZScsICdmaScsICdmbycsICdmdW0nXVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTIoZnVuY3Rpb24gcHJlcGVuZChlbCwgbGlzdCkge1xuICByZXR1cm4gX2NvbmNhdChbZWxdLCBsaXN0KTtcbn0pO1xuIiwidmFyIF9jdXJyeTIgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTInKTtcblxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdoZW4gc3VwcGxpZWQgYW4gb2JqZWN0IHJldHVybnMgdGhlIGluZGljYXRlZFxuICogcHJvcGVydHkgb2YgdGhhdCBvYmplY3QsIGlmIGl0IGV4aXN0cy5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBzaWcgcyAtPiB7czogYX0gLT4gYSB8IFVuZGVmaW5lZFxuICogQHBhcmFtIHtTdHJpbmd9IHAgVGhlIHByb3BlcnR5IG5hbWVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBxdWVyeVxuICogQHJldHVybiB7Kn0gVGhlIHZhbHVlIGF0IGBvYmoucGAuXG4gKiBAc2VlIFIucGF0aFxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIFIucHJvcCgneCcsIHt4OiAxMDB9KTsgLy89PiAxMDBcbiAqICAgICAgUi5wcm9wKCd4Jywge30pOyAvLz0+IHVuZGVmaW5lZFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTIoZnVuY3Rpb24gcHJvcChwLCBvYmopIHsgcmV0dXJuIG9ialtwXTsgfSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9pc1RyYW5zZm9ybWVyKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9ialsnQEB0cmFuc2R1Y2VyL3N0ZXAnXSA9PT0gJ2Z1bmN0aW9uJztcbn07XG4iLCJ2YXIgX2lzQXJyYXkgPSByZXF1aXJlKCcuL19pc0FycmF5Jyk7XG52YXIgX2lzVHJhbnNmb3JtZXIgPSByZXF1aXJlKCcuL19pc1RyYW5zZm9ybWVyJyk7XG52YXIgX3NsaWNlID0gcmVxdWlyZSgnLi9fc2xpY2UnKTtcblxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGRpc3BhdGNoZXMgd2l0aCBkaWZmZXJlbnQgc3RyYXRlZ2llcyBiYXNlZCBvbiB0aGVcbiAqIG9iamVjdCBpbiBsaXN0IHBvc2l0aW9uIChsYXN0IGFyZ3VtZW50KS4gSWYgaXQgaXMgYW4gYXJyYXksIGV4ZWN1dGVzIFtmbl0uXG4gKiBPdGhlcndpc2UsIGlmIGl0IGhhcyBhIGZ1bmN0aW9uIHdpdGggW21ldGhvZG5hbWVdLCBpdCB3aWxsIGV4ZWN1dGUgdGhhdFxuICogZnVuY3Rpb24gKGZ1bmN0b3IgY2FzZSkuIE90aGVyd2lzZSwgaWYgaXQgaXMgYSB0cmFuc2Zvcm1lciwgdXNlcyB0cmFuc2R1Y2VyXG4gKiBbeGZdIHRvIHJldHVybiBhIG5ldyB0cmFuc2Zvcm1lciAodHJhbnNkdWNlciBjYXNlKS4gT3RoZXJ3aXNlLCBpdCB3aWxsXG4gKiBkZWZhdWx0IHRvIGV4ZWN1dGluZyBbZm5dLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kbmFtZSBwcm9wZXJ0eSB0byBjaGVjayBmb3IgYSBjdXN0b20gaW1wbGVtZW50YXRpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHhmIHRyYW5zZHVjZXIgdG8gaW5pdGlhbGl6ZSBpZiBvYmplY3QgaXMgdHJhbnNmb3JtZXJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIGRlZmF1bHQgcmFtZGEgaW1wbGVtZW50YXRpb25cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBBIGZ1bmN0aW9uIHRoYXQgZGlzcGF0Y2hlcyBvbiBvYmplY3QgaW4gbGlzdCBwb3NpdGlvblxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9kaXNwYXRjaGFibGUobWV0aG9kbmFtZSwgeGYsIGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBpZiAobGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gZm4oKTtcbiAgICB9XG4gICAgdmFyIG9iaiA9IGFyZ3VtZW50c1tsZW5ndGggLSAxXTtcbiAgICBpZiAoIV9pc0FycmF5KG9iaikpIHtcbiAgICAgIHZhciBhcmdzID0gX3NsaWNlKGFyZ3VtZW50cywgMCwgbGVuZ3RoIC0gMSk7XG4gICAgICBpZiAodHlwZW9mIG9ialttZXRob2RuYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gb2JqW21ldGhvZG5hbWVdLmFwcGx5KG9iaiwgYXJncyk7XG4gICAgICB9XG4gICAgICBpZiAoX2lzVHJhbnNmb3JtZXIob2JqKSkge1xuICAgICAgICB2YXIgdHJhbnNkdWNlciA9IHhmLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgICByZXR1cm4gdHJhbnNkdWNlcihvYmopO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9tYXAoZm4sIGZ1bmN0b3IpIHtcbiAgdmFyIGlkeCA9IDA7XG4gIHZhciBsZW4gPSBmdW5jdG9yLmxlbmd0aDtcbiAgdmFyIHJlc3VsdCA9IEFycmF5KGxlbik7XG4gIHdoaWxlIChpZHggPCBsZW4pIHtcbiAgICByZXN1bHRbaWR4XSA9IGZuKGZ1bmN0b3JbaWR4XSk7XG4gICAgaWR4ICs9IDE7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMueGZbJ0BAdHJhbnNkdWNlci9pbml0J10oKTtcbiAgfSxcbiAgcmVzdWx0OiBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICByZXR1cm4gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddKHJlc3VsdCk7XG4gIH1cbn07XG4iLCJ2YXIgX2N1cnJ5MiA9IHJlcXVpcmUoJy4vX2N1cnJ5MicpO1xudmFyIF94ZkJhc2UgPSByZXF1aXJlKCcuL194ZkJhc2UnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gWE1hcChmLCB4Zikge1xuICAgIHRoaXMueGYgPSB4ZjtcbiAgICB0aGlzLmYgPSBmO1xuICB9XG4gIFhNYXAucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvaW5pdCddID0gX3hmQmFzZS5pbml0O1xuICBYTWFwLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddID0gX3hmQmFzZS5yZXN1bHQ7XG4gIFhNYXAucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvc3RlcCddID0gZnVuY3Rpb24ocmVzdWx0LCBpbnB1dCkge1xuICAgIHJldHVybiB0aGlzLnhmWydAQHRyYW5zZHVjZXIvc3RlcCddKHJlc3VsdCwgdGhpcy5mKGlucHV0KSk7XG4gIH07XG5cbiAgcmV0dXJuIF9jdXJyeTIoZnVuY3Rpb24gX3htYXAoZiwgeGYpIHsgcmV0dXJuIG5ldyBYTWFwKGYsIHhmKTsgfSk7XG59KCkpO1xuIiwidmFyIF9hcml0eSA9IHJlcXVpcmUoJy4vX2FyaXR5Jyk7XG52YXIgX2lzUGxhY2Vob2xkZXIgPSByZXF1aXJlKCcuL19pc1BsYWNlaG9sZGVyJyk7XG5cblxuLyoqXG4gKiBJbnRlcm5hbCBjdXJyeU4gZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCBUaGUgYXJpdHkgb2YgdGhlIGN1cnJpZWQgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge0FycmF5fSByZWNlaXZlZCBBbiBhcnJheSBvZiBhcmd1bWVudHMgcmVjZWl2ZWQgdGh1cyBmYXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY3VycnkuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGN1cnJpZWQgZnVuY3Rpb24uXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2N1cnJ5TihsZW5ndGgsIHJlY2VpdmVkLCBmbikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbWJpbmVkID0gW107XG4gICAgdmFyIGFyZ3NJZHggPSAwO1xuICAgIHZhciBsZWZ0ID0gbGVuZ3RoO1xuICAgIHZhciBjb21iaW5lZElkeCA9IDA7XG4gICAgd2hpbGUgKGNvbWJpbmVkSWR4IDwgcmVjZWl2ZWQubGVuZ3RoIHx8IGFyZ3NJZHggPCBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICB2YXIgcmVzdWx0O1xuICAgICAgaWYgKGNvbWJpbmVkSWR4IDwgcmVjZWl2ZWQubGVuZ3RoICYmXG4gICAgICAgICAgKCFfaXNQbGFjZWhvbGRlcihyZWNlaXZlZFtjb21iaW5lZElkeF0pIHx8XG4gICAgICAgICAgIGFyZ3NJZHggPj0gYXJndW1lbnRzLmxlbmd0aCkpIHtcbiAgICAgICAgcmVzdWx0ID0gcmVjZWl2ZWRbY29tYmluZWRJZHhdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gYXJndW1lbnRzW2FyZ3NJZHhdO1xuICAgICAgICBhcmdzSWR4ICs9IDE7XG4gICAgICB9XG4gICAgICBjb21iaW5lZFtjb21iaW5lZElkeF0gPSByZXN1bHQ7XG4gICAgICBpZiAoIV9pc1BsYWNlaG9sZGVyKHJlc3VsdCkpIHtcbiAgICAgICAgbGVmdCAtPSAxO1xuICAgICAgfVxuICAgICAgY29tYmluZWRJZHggKz0gMTtcbiAgICB9XG4gICAgcmV0dXJuIGxlZnQgPD0gMCA/IGZuLmFwcGx5KHRoaXMsIGNvbWJpbmVkKVxuICAgICAgICAgICAgICAgICAgICAgOiBfYXJpdHkobGVmdCwgX2N1cnJ5TihsZW5ndGgsIGNvbWJpbmVkLCBmbikpO1xuICB9O1xufTtcbiIsInZhciBfYXJpdHkgPSByZXF1aXJlKCcuL2ludGVybmFsL19hcml0eScpO1xudmFyIF9jdXJyeTEgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTEnKTtcbnZhciBfY3VycnkyID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkyJyk7XG52YXIgX2N1cnJ5TiA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5TicpO1xuXG5cbi8qKlxuICogUmV0dXJucyBhIGN1cnJpZWQgZXF1aXZhbGVudCBvZiB0aGUgcHJvdmlkZWQgZnVuY3Rpb24sIHdpdGggdGhlIHNwZWNpZmllZFxuICogYXJpdHkuIFRoZSBjdXJyaWVkIGZ1bmN0aW9uIGhhcyB0d28gdW51c3VhbCBjYXBhYmlsaXRpZXMuIEZpcnN0LCBpdHNcbiAqIGFyZ3VtZW50cyBuZWVkbid0IGJlIHByb3ZpZGVkIG9uZSBhdCBhIHRpbWUuIElmIGBnYCBpcyBgUi5jdXJyeU4oMywgZilgLCB0aGVcbiAqIGZvbGxvd2luZyBhcmUgZXF1aXZhbGVudDpcbiAqXG4gKiAgIC0gYGcoMSkoMikoMylgXG4gKiAgIC0gYGcoMSkoMiwgMylgXG4gKiAgIC0gYGcoMSwgMikoMylgXG4gKiAgIC0gYGcoMSwgMiwgMylgXG4gKlxuICogU2Vjb25kbHksIHRoZSBzcGVjaWFsIHBsYWNlaG9sZGVyIHZhbHVlIGBSLl9fYCBtYXkgYmUgdXNlZCB0byBzcGVjaWZ5XG4gKiBcImdhcHNcIiwgYWxsb3dpbmcgcGFydGlhbCBhcHBsaWNhdGlvbiBvZiBhbnkgY29tYmluYXRpb24gb2YgYXJndW1lbnRzLFxuICogcmVnYXJkbGVzcyBvZiB0aGVpciBwb3NpdGlvbnMuIElmIGBnYCBpcyBhcyBhYm92ZSBhbmQgYF9gIGlzIGBSLl9fYCwgdGhlXG4gKiBmb2xsb3dpbmcgYXJlIGVxdWl2YWxlbnQ6XG4gKlxuICogICAtIGBnKDEsIDIsIDMpYFxuICogICAtIGBnKF8sIDIsIDMpKDEpYFxuICogICAtIGBnKF8sIF8sIDMpKDEpKDIpYFxuICogICAtIGBnKF8sIF8sIDMpKDEsIDIpYFxuICogICAtIGBnKF8sIDIpKDEpKDMpYFxuICogICAtIGBnKF8sIDIpKDEsIDMpYFxuICogICAtIGBnKF8sIDIpKF8sIDMpKDEpYFxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjUuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAc2lnIE51bWJlciAtPiAoKiAtPiBhKSAtPiAoKiAtPiBhKVxuICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCBUaGUgYXJpdHkgZm9yIHRoZSByZXR1cm5lZCBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjdXJyeS5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBBIG5ldywgY3VycmllZCBmdW5jdGlvbi5cbiAqIEBzZWUgUi5jdXJyeVxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIHZhciBzdW1BcmdzID0gKC4uLmFyZ3MpID0+IFIuc3VtKGFyZ3MpO1xuICpcbiAqICAgICAgdmFyIGN1cnJpZWRBZGRGb3VyTnVtYmVycyA9IFIuY3VycnlOKDQsIHN1bUFyZ3MpO1xuICogICAgICB2YXIgZiA9IGN1cnJpZWRBZGRGb3VyTnVtYmVycygxLCAyKTtcbiAqICAgICAgdmFyIGcgPSBmKDMpO1xuICogICAgICBnKDQpOyAvLz0+IDEwXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MihmdW5jdGlvbiBjdXJyeU4obGVuZ3RoLCBmbikge1xuICBpZiAobGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIF9jdXJyeTEoZm4pO1xuICB9XG4gIHJldHVybiBfYXJpdHkobGVuZ3RoLCBfY3VycnlOKGxlbmd0aCwgW10sIGZuKSk7XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2hhcyhwcm9wLCBvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufTtcbiIsInZhciBfaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGFyZ3VtZW50cykgPT09ICdbb2JqZWN0IEFyZ3VtZW50c10nID9cbiAgICBmdW5jdGlvbiBfaXNBcmd1bWVudHMoeCkgeyByZXR1cm4gdG9TdHJpbmcuY2FsbCh4KSA9PT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7IH0gOlxuICAgIGZ1bmN0aW9uIF9pc0FyZ3VtZW50cyh4KSB7IHJldHVybiBfaGFzKCdjYWxsZWUnLCB4KTsgfTtcbn0oKSk7XG4iLCJ2YXIgX2N1cnJ5MSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MScpO1xudmFyIF9oYXMgPSByZXF1aXJlKCcuL2ludGVybmFsL19oYXMnKTtcbnZhciBfaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL2ludGVybmFsL19pc0FyZ3VtZW50cycpO1xuXG5cbi8qKlxuICogUmV0dXJucyBhIGxpc3QgY29udGFpbmluZyB0aGUgbmFtZXMgb2YgYWxsIHRoZSBlbnVtZXJhYmxlIG93biBwcm9wZXJ0aWVzIG9mXG4gKiB0aGUgc3VwcGxpZWQgb2JqZWN0LlxuICogTm90ZSB0aGF0IHRoZSBvcmRlciBvZiB0aGUgb3V0cHV0IGFycmF5IGlzIG5vdCBndWFyYW50ZWVkIHRvIGJlIGNvbnNpc3RlbnRcbiAqIGFjcm9zcyBkaWZmZXJlbnQgSlMgcGxhdGZvcm1zLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjEuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHNpZyB7azogdn0gLT4gW2tdXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gZXh0cmFjdCBwcm9wZXJ0aWVzIGZyb21cbiAqIEByZXR1cm4ge0FycmF5fSBBbiBhcnJheSBvZiB0aGUgb2JqZWN0J3Mgb3duIHByb3BlcnRpZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi5rZXlzKHthOiAxLCBiOiAyLCBjOiAzfSk7IC8vPT4gWydhJywgJ2InLCAnYyddXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICAvLyBjb3ZlciBJRSA8IDkga2V5cyBpc3N1ZXNcbiAgdmFyIGhhc0VudW1CdWcgPSAhKHt0b1N0cmluZzogbnVsbH0pLnByb3BlcnR5SXNFbnVtZXJhYmxlKCd0b1N0cmluZycpO1xuICB2YXIgbm9uRW51bWVyYWJsZVByb3BzID0gWydjb25zdHJ1Y3RvcicsICd2YWx1ZU9mJywgJ2lzUHJvdG90eXBlT2YnLCAndG9TdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsICdoYXNPd25Qcm9wZXJ0eScsICd0b0xvY2FsZVN0cmluZyddO1xuICAvLyBTYWZhcmkgYnVnXG4gIHZhciBoYXNBcmdzRW51bUJ1ZyA9IChmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5wcm9wZXJ0eUlzRW51bWVyYWJsZSgnbGVuZ3RoJyk7XG4gIH0oKSk7XG5cbiAgdmFyIGNvbnRhaW5zID0gZnVuY3Rpb24gY29udGFpbnMobGlzdCwgaXRlbSkge1xuICAgIHZhciBpZHggPSAwO1xuICAgIHdoaWxlIChpZHggPCBsaXN0Lmxlbmd0aCkge1xuICAgICAgaWYgKGxpc3RbaWR4XSA9PT0gaXRlbSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlkeCArPSAxO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgcmV0dXJuIHR5cGVvZiBPYmplY3Qua2V5cyA9PT0gJ2Z1bmN0aW9uJyAmJiAhaGFzQXJnc0VudW1CdWcgP1xuICAgIF9jdXJyeTEoZnVuY3Rpb24ga2V5cyhvYmopIHtcbiAgICAgIHJldHVybiBPYmplY3Qob2JqKSAhPT0gb2JqID8gW10gOiBPYmplY3Qua2V5cyhvYmopO1xuICAgIH0pIDpcbiAgICBfY3VycnkxKGZ1bmN0aW9uIGtleXMob2JqKSB7XG4gICAgICBpZiAoT2JqZWN0KG9iaikgIT09IG9iaikge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgICB2YXIgcHJvcCwgbklkeDtcbiAgICAgIHZhciBrcyA9IFtdO1xuICAgICAgdmFyIGNoZWNrQXJnc0xlbmd0aCA9IGhhc0FyZ3NFbnVtQnVnICYmIF9pc0FyZ3VtZW50cyhvYmopO1xuICAgICAgZm9yIChwcm9wIGluIG9iaikge1xuICAgICAgICBpZiAoX2hhcyhwcm9wLCBvYmopICYmICghY2hlY2tBcmdzTGVuZ3RoIHx8IHByb3AgIT09ICdsZW5ndGgnKSkge1xuICAgICAgICAgIGtzW2tzLmxlbmd0aF0gPSBwcm9wO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaGFzRW51bUJ1Zykge1xuICAgICAgICBuSWR4ID0gbm9uRW51bWVyYWJsZVByb3BzLmxlbmd0aCAtIDE7XG4gICAgICAgIHdoaWxlIChuSWR4ID49IDApIHtcbiAgICAgICAgICBwcm9wID0gbm9uRW51bWVyYWJsZVByb3BzW25JZHhdO1xuICAgICAgICAgIGlmIChfaGFzKHByb3AsIG9iaikgJiYgIWNvbnRhaW5zKGtzLCBwcm9wKSkge1xuICAgICAgICAgICAga3Nba3MubGVuZ3RoXSA9IHByb3A7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5JZHggLT0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGtzO1xuICAgIH0pO1xufSgpKTtcbiIsInZhciBfY3VycnkyID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkyJyk7XG52YXIgX2Rpc3BhdGNoYWJsZSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2Rpc3BhdGNoYWJsZScpO1xudmFyIF9tYXAgPSByZXF1aXJlKCcuL2ludGVybmFsL19tYXAnKTtcbnZhciBfcmVkdWNlID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fcmVkdWNlJyk7XG52YXIgX3htYXAgPSByZXF1aXJlKCcuL2ludGVybmFsL194bWFwJyk7XG52YXIgY3VycnlOID0gcmVxdWlyZSgnLi9jdXJyeU4nKTtcbnZhciBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cblxuLyoqXG4gKiBUYWtlcyBhIGZ1bmN0aW9uIGFuZFxuICogYSBbZnVuY3Rvcl0oaHR0cHM6Ly9naXRodWIuY29tL2ZhbnRhc3lsYW5kL2ZhbnRhc3ktbGFuZCNmdW5jdG9yKSxcbiAqIGFwcGxpZXMgdGhlIGZ1bmN0aW9uIHRvIGVhY2ggb2YgdGhlIGZ1bmN0b3IncyB2YWx1ZXMsIGFuZCByZXR1cm5zXG4gKiBhIGZ1bmN0b3Igb2YgdGhlIHNhbWUgc2hhcGUuXG4gKlxuICogUmFtZGEgcHJvdmlkZXMgc3VpdGFibGUgYG1hcGAgaW1wbGVtZW50YXRpb25zIGZvciBgQXJyYXlgIGFuZCBgT2JqZWN0YCxcbiAqIHNvIHRoaXMgZnVuY3Rpb24gbWF5IGJlIGFwcGxpZWQgdG8gYFsxLCAyLCAzXWAgb3IgYHt4OiAxLCB5OiAyLCB6OiAzfWAuXG4gKlxuICogRGlzcGF0Y2hlcyB0byB0aGUgYG1hcGAgbWV0aG9kIG9mIHRoZSBzZWNvbmQgYXJndW1lbnQsIGlmIHByZXNlbnQuXG4gKlxuICogQWN0cyBhcyBhIHRyYW5zZHVjZXIgaWYgYSB0cmFuc2Zvcm1lciBpcyBnaXZlbiBpbiBsaXN0IHBvc2l0aW9uLlxuICpcbiAqIEFsc28gdHJlYXRzIGZ1bmN0aW9ucyBhcyBmdW5jdG9ycyBhbmQgd2lsbCBjb21wb3NlIHRoZW0gdG9nZXRoZXIuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMS4wXG4gKiBAY2F0ZWdvcnkgTGlzdFxuICogQHNpZyBGdW5jdG9yIGYgPT4gKGEgLT4gYikgLT4gZiBhIC0+IGYgYlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCBvbiBldmVyeSBlbGVtZW50IG9mIHRoZSBpbnB1dCBgbGlzdGAuXG4gKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IHRvIGJlIGl0ZXJhdGVkIG92ZXIuXG4gKiBAcmV0dXJuIHtBcnJheX0gVGhlIG5ldyBsaXN0LlxuICogQHNlZSBSLnRyYW5zZHVjZSwgUi5hZGRJbmRleFxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIHZhciBkb3VibGUgPSB4ID0+IHggKiAyO1xuICpcbiAqICAgICAgUi5tYXAoZG91YmxlLCBbMSwgMiwgM10pOyAvLz0+IFsyLCA0LCA2XVxuICpcbiAqICAgICAgUi5tYXAoZG91YmxlLCB7eDogMSwgeTogMiwgejogM30pOyAvLz0+IHt4OiAyLCB5OiA0LCB6OiA2fVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTIoX2Rpc3BhdGNoYWJsZSgnbWFwJywgX3htYXAsIGZ1bmN0aW9uIG1hcChmbiwgZnVuY3Rvcikge1xuICBzd2l0Y2ggKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChmdW5jdG9yKSkge1xuICAgIGNhc2UgJ1tvYmplY3QgRnVuY3Rpb25dJzpcbiAgICAgIHJldHVybiBjdXJyeU4oZnVuY3Rvci5sZW5ndGgsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBmdW5jdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICAgICAgfSk7XG4gICAgY2FzZSAnW29iamVjdCBPYmplY3RdJzpcbiAgICAgIHJldHVybiBfcmVkdWNlKGZ1bmN0aW9uKGFjYywga2V5KSB7XG4gICAgICAgIGFjY1trZXldID0gZm4oZnVuY3RvcltrZXldKTtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sIHt9LCBrZXlzKGZ1bmN0b3IpKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIF9tYXAoZm4sIGZ1bmN0b3IpO1xuICB9XG59KSk7XG4iLCJ2YXIgX2N1cnJ5MiA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MicpO1xudmFyIG1hcCA9IHJlcXVpcmUoJy4vbWFwJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIGEgbGVucyBmb3IgdGhlIGdpdmVuIGdldHRlciBhbmQgc2V0dGVyIGZ1bmN0aW9ucy4gVGhlIGdldHRlciBcImdldHNcIlxuICogdGhlIHZhbHVlIG9mIHRoZSBmb2N1czsgdGhlIHNldHRlciBcInNldHNcIiB0aGUgdmFsdWUgb2YgdGhlIGZvY3VzLiBUaGUgc2V0dGVyXG4gKiBzaG91bGQgbm90IG11dGF0ZSB0aGUgZGF0YSBzdHJ1Y3R1cmUuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuOC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAdHlwZWRlZm4gTGVucyBzIGEgPSBGdW5jdG9yIGYgPT4gKGEgLT4gZiBhKSAtPiBzIC0+IGYgc1xuICogQHNpZyAocyAtPiBhKSAtPiAoKGEsIHMpIC0+IHMpIC0+IExlbnMgcyBhXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBnZXR0ZXJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHNldHRlclxuICogQHJldHVybiB7TGVuc31cbiAqIEBzZWUgUi52aWV3LCBSLnNldCwgUi5vdmVyLCBSLmxlbnNJbmRleCwgUi5sZW5zUHJvcFxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIHZhciB4TGVucyA9IFIubGVucyhSLnByb3AoJ3gnKSwgUi5hc3NvYygneCcpKTtcbiAqXG4gKiAgICAgIFIudmlldyh4TGVucywge3g6IDEsIHk6IDJ9KTsgICAgICAgICAgICAvLz0+IDFcbiAqICAgICAgUi5zZXQoeExlbnMsIDQsIHt4OiAxLCB5OiAyfSk7ICAgICAgICAgIC8vPT4ge3g6IDQsIHk6IDJ9XG4gKiAgICAgIFIub3Zlcih4TGVucywgUi5uZWdhdGUsIHt4OiAxLCB5OiAyfSk7ICAvLz0+IHt4OiAtMSwgeTogMn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkyKGZ1bmN0aW9uIGxlbnMoZ2V0dGVyLCBzZXR0ZXIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRvRnVuY3RvckZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgcmV0dXJuIG1hcChcbiAgICAgICAgZnVuY3Rpb24oZm9jdXMpIHtcbiAgICAgICAgICByZXR1cm4gc2V0dGVyKGZvY3VzLCB0YXJnZXQpO1xuICAgICAgICB9LFxuICAgICAgICB0b0Z1bmN0b3JGbihnZXR0ZXIodGFyZ2V0KSlcbiAgICAgICk7XG4gICAgfTtcbiAgfTtcbn0pO1xuIiwidmFyIF9jdXJyeTEgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTEnKTtcbnZhciBjdXJyeU4gPSByZXF1aXJlKCcuL2N1cnJ5TicpO1xuXG5cbi8qKlxuICogUmV0dXJucyBhIGN1cnJpZWQgZXF1aXZhbGVudCBvZiB0aGUgcHJvdmlkZWQgZnVuY3Rpb24uIFRoZSBjdXJyaWVkIGZ1bmN0aW9uXG4gKiBoYXMgdHdvIHVudXN1YWwgY2FwYWJpbGl0aWVzLiBGaXJzdCwgaXRzIGFyZ3VtZW50cyBuZWVkbid0IGJlIHByb3ZpZGVkIG9uZVxuICogYXQgYSB0aW1lLiBJZiBgZmAgaXMgYSB0ZXJuYXJ5IGZ1bmN0aW9uIGFuZCBgZ2AgaXMgYFIuY3VycnkoZilgLCB0aGVcbiAqIGZvbGxvd2luZyBhcmUgZXF1aXZhbGVudDpcbiAqXG4gKiAgIC0gYGcoMSkoMikoMylgXG4gKiAgIC0gYGcoMSkoMiwgMylgXG4gKiAgIC0gYGcoMSwgMikoMylgXG4gKiAgIC0gYGcoMSwgMiwgMylgXG4gKlxuICogU2Vjb25kbHksIHRoZSBzcGVjaWFsIHBsYWNlaG9sZGVyIHZhbHVlIGBSLl9fYCBtYXkgYmUgdXNlZCB0byBzcGVjaWZ5XG4gKiBcImdhcHNcIiwgYWxsb3dpbmcgcGFydGlhbCBhcHBsaWNhdGlvbiBvZiBhbnkgY29tYmluYXRpb24gb2YgYXJndW1lbnRzLFxuICogcmVnYXJkbGVzcyBvZiB0aGVpciBwb3NpdGlvbnMuIElmIGBnYCBpcyBhcyBhYm92ZSBhbmQgYF9gIGlzIGBSLl9fYCwgdGhlXG4gKiBmb2xsb3dpbmcgYXJlIGVxdWl2YWxlbnQ6XG4gKlxuICogICAtIGBnKDEsIDIsIDMpYFxuICogICAtIGBnKF8sIDIsIDMpKDEpYFxuICogICAtIGBnKF8sIF8sIDMpKDEpKDIpYFxuICogICAtIGBnKF8sIF8sIDMpKDEsIDIpYFxuICogICAtIGBnKF8sIDIpKDEpKDMpYFxuICogICAtIGBnKF8sIDIpKDEsIDMpYFxuICogICAtIGBnKF8sIDIpKF8sIDMpKDEpYFxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAc2lnICgqIC0+IGEpIC0+ICgqIC0+IGEpXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY3VycnkuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBuZXcsIGN1cnJpZWQgZnVuY3Rpb24uXG4gKiBAc2VlIFIuY3VycnlOXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgdmFyIGFkZEZvdXJOdW1iZXJzID0gKGEsIGIsIGMsIGQpID0+IGEgKyBiICsgYyArIGQ7XG4gKlxuICogICAgICB2YXIgY3VycmllZEFkZEZvdXJOdW1iZXJzID0gUi5jdXJyeShhZGRGb3VyTnVtYmVycyk7XG4gKiAgICAgIHZhciBmID0gY3VycmllZEFkZEZvdXJOdW1iZXJzKDEsIDIpO1xuICogICAgICB2YXIgZyA9IGYoMyk7XG4gKiAgICAgIGcoNCk7IC8vPT4gMTBcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkxKGZ1bmN0aW9uIGN1cnJ5KGZuKSB7XG4gIHJldHVybiBjdXJyeU4oZm4ubGVuZ3RoLCBmbik7XG59KTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5ldy1jYXAgKi9cblxuaW1wb3J0IEltbXV0YWJsZSBmcm9tIFwic2VhbWxlc3MtaW1tdXRhYmxlXCI7XG5pbXBvcnQgeyBjdXJyeSwgbGVucywgcHJvcCwgcHJlcGVuZCwgb3Zlciwgc2V0LCBwaXBlIH0gZnJvbSBcInJhbWRhXCI7XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVBdCA9IGN1cnJ5KChrZXlBcnJheSwgbmV3VmFsLCBvYmopID0+IHtcbiAgY29uc3QgZGVlcE5ld1ZhbCA9IGtleUFycmF5LnJlZHVjZVJpZ2h0KFxuICAgIChyZXN1bHQsIGtleSkgPT4gKHsgW2tleV06IHJlc3VsdCB9KVxuICAgICwgbmV3VmFsXG4gICk7XG5cbiAgcmV0dXJuIEltbXV0YWJsZShvYmopLm1lcmdlKGRlZXBOZXdWYWwsIHsgZGVlcDogdHJ1ZSB9KTtcbn0pO1xuXG4vLyBTdGF0ZSBsZW5zZXNcbmV4cG9ydCBjb25zdCBTdGF0ZUxlbnNlcyA9IHtcbiAgZmllbGRUeXBlczogbGVucyhwcm9wKFwiZmllbGRUeXBlc1wiKSwgdXBkYXRlQXQoW1wiZmllbGRUeXBlc1wiXSkpLFxuICBmaWVsZHNTdGF0ZTogbGVucyhwcm9wKFwiZmllbGRzU3RhdGVcIiksIHVwZGF0ZUF0KFtcImZpZWxkc1N0YXRlXCJdKSksXG4gIGZpZWxkc1N0YXRlSGlzdG9yeTogbGVucyhwcm9wKFwiZmllbGRzU3RhdGVIaXN0b3J5XCIpLCB1cGRhdGVBdChbXCJmaWVsZHNTdGF0ZUhpc3RvcnlcIl0pKSxcbn07XG5cbi8vIF8gPT4gU3RyaW5nXG5leHBvcnQgY29uc3QgY3JlYXRlSWQgPSBfID0+XG4gIERhdGUubm93KCkudG9TdHJpbmcoKTtcblxuLy8gU3RhdGUgLT4gW2ZpZWxkc1N0YXRlXSAtPiBTdGF0ZVxuZXhwb3J0IGNvbnN0IHB1c2hIaXN0b3J5U3RhdGUgPSBjdXJyeSgoc3RhdGUsIG5ld0hpc3RvcnlTdGF0ZSkgPT4gcGlwZShcbiAgLy8gQWRkIGN1cnJlbnQgc3RhdGUgdG8gaGlzdG9yeVxuICBvdmVyKFN0YXRlTGVuc2VzLmZpZWxkc1N0YXRlSGlzdG9yeSwgcHJlcGVuZChzdGF0ZS5maWVsZHNTdGF0ZSkpLFxuICAvLyBNYWtlIG5ldyBTdGF0ZSB0aGUgY3VycmVudFxuICBzZXQoU3RhdGVMZW5zZXMuZmllbGRzU3RhdGUsIG5ld0hpc3RvcnlTdGF0ZSlcbikoc3RhdGUpKTtcblxuXG4vLyBTdGF0ZSAtPiBTdGF0ZVxuZXhwb3J0IGNvbnN0IGhpZGVDb25maWdzID0gc3RhdGUgPT5cbiAgc2V0KFxuICAgIFN0YXRlTGVuc2VzLmZpZWxkc1N0YXRlLFxuICAgIHN0YXRlLmZpZWxkc1N0YXRlLm1hcChzID0+IE9iamVjdC5hc3NpZ24oe30sIHMsIHsgY29uZmlnU2hvd2luZzogZmFsc2UgfSkpLFxuICAgIHN0YXRlXG4gICk7XG4iLCJpbXBvcnQgeyBTdGF0ZUxlbnNlcyB9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgeyBzZXQsIG92ZXIsIHNsaWNlLCBwaXBlIH0gZnJvbSBcInJhbWRhXCI7XG5cbmNvbnN0IGxhc3RIaXN0b3J5U3RhdGUgPSBzdGF0ZSA9PlxuICBzdGF0ZS5maWVsZHNTdGF0ZUhpc3RvcnlbMF0gfHwgW107XG5cbmNvbnN0IHVuZG8gPSAoc3RhdGUsIF8pID0+IHBpcGUoXG4gIC8vIE1ha2UgbGFzdCBoaXN0b3J5IGxhc3Qgc3RhdGUgdGhlIGN1cnJlbnQgb25lXG4gIHNldChTdGF0ZUxlbnNlcy5maWVsZHNTdGF0ZSwgbGFzdEhpc3RvcnlTdGF0ZShzdGF0ZSkpLFxuICAvLyBSZW1vdmUgbGFzdCBoaXN0b3J5IHN0YXRlIGZyb20gdGhlIGhpc3RvcnkgYXJyYXlcbiAgb3ZlcihTdGF0ZUxlbnNlcy5maWVsZHNTdGF0ZUhpc3RvcnksIHNsaWNlKDEsIEluZmluaXR5KSlcbikoc3RhdGUpO1xuXG5leHBvcnQgZGVmYXVsdCB1bmRvO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfaWRlbnRpdHkoeCkgeyByZXR1cm4geDsgfTtcbiIsInZhciBfY3VycnkxID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkxJyk7XG52YXIgX2lkZW50aXR5ID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9faWRlbnRpdHknKTtcblxuXG4vKipcbiAqIEEgZnVuY3Rpb24gdGhhdCBkb2VzIG5vdGhpbmcgYnV0IHJldHVybiB0aGUgcGFyYW1ldGVyIHN1cHBsaWVkIHRvIGl0LiBHb29kXG4gKiBhcyBhIGRlZmF1bHQgb3IgcGxhY2Vob2xkZXIgZnVuY3Rpb24uXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBzaWcgYSAtPiBhXG4gKiBAcGFyYW0geyp9IHggVGhlIHZhbHVlIHRvIHJldHVybi5cbiAqIEByZXR1cm4geyp9IFRoZSBpbnB1dCB2YWx1ZSwgYHhgLlxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIFIuaWRlbnRpdHkoMSk7IC8vPT4gMVxuICpcbiAqICAgICAgdmFyIG9iaiA9IHt9O1xuICogICAgICBSLmlkZW50aXR5KG9iaikgPT09IG9iajsgLy89PiB0cnVlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MShfaWRlbnRpdHkpO1xuIiwidmFyIF9jdXJyeTIgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTInKTtcblxuXG4vKipcbiAqIFJldHJpZXZlIHRoZSB2YWx1ZSBhdCBhIGdpdmVuIHBhdGguXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMi4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAc2lnIFtTdHJpbmddIC0+IHtrOiB2fSAtPiB2IHwgVW5kZWZpbmVkXG4gKiBAcGFyYW0ge0FycmF5fSBwYXRoIFRoZSBwYXRoIHRvIHVzZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byByZXRyaWV2ZSB0aGUgbmVzdGVkIHByb3BlcnR5IGZyb20uXG4gKiBAcmV0dXJuIHsqfSBUaGUgZGF0YSBhdCBgcGF0aGAuXG4gKiBAc2VlIFIucHJvcFxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIFIucGF0aChbJ2EnLCAnYiddLCB7YToge2I6IDJ9fSk7IC8vPT4gMlxuICogICAgICBSLnBhdGgoWydhJywgJ2InXSwge2M6IHtiOiAyfX0pOyAvLz0+IHVuZGVmaW5lZFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTIoZnVuY3Rpb24gcGF0aChwYXRocywgb2JqKSB7XG4gIHZhciB2YWwgPSBvYmo7XG4gIHZhciBpZHggPSAwO1xuICB3aGlsZSAoaWR4IDwgcGF0aHMubGVuZ3RoKSB7XG4gICAgaWYgKHZhbCA9PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhbCA9IHZhbFtwYXRoc1tpZHhdXTtcbiAgICBpZHggKz0gMTtcbiAgfVxuICByZXR1cm4gdmFsO1xufSk7XG4iLCJ2YXIgX2NvbmNhdCA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2NvbmNhdCcpO1xudmFyIF9jdXJyeTIgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTInKTtcbnZhciBfcmVkdWNlID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fcmVkdWNlJyk7XG52YXIgbWFwID0gcmVxdWlyZSgnLi9tYXAnKTtcblxuXG4vKipcbiAqIGFwIGFwcGxpZXMgYSBsaXN0IG9mIGZ1bmN0aW9ucyB0byBhIGxpc3Qgb2YgdmFsdWVzLlxuICpcbiAqIERpc3BhdGNoZXMgdG8gdGhlIGBhcGAgbWV0aG9kIG9mIHRoZSBzZWNvbmQgYXJndW1lbnQsIGlmIHByZXNlbnQuIEFsc29cbiAqIHRyZWF0cyBjdXJyaWVkIGZ1bmN0aW9ucyBhcyBhcHBsaWNhdGl2ZXMuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMy4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBzaWcgW2EgLT4gYl0gLT4gW2FdIC0+IFtiXVxuICogQHNpZyBBcHBseSBmID0+IGYgKGEgLT4gYikgLT4gZiBhIC0+IGYgYlxuICogQHBhcmFtIHtBcnJheX0gZm5zIEFuIGFycmF5IG9mIGZ1bmN0aW9uc1xuICogQHBhcmFtIHtBcnJheX0gdnMgQW4gYXJyYXkgb2YgdmFsdWVzXG4gKiBAcmV0dXJuIHtBcnJheX0gQW4gYXJyYXkgb2YgcmVzdWx0cyBvZiBhcHBseWluZyBlYWNoIG9mIGBmbnNgIHRvIGFsbCBvZiBgdnNgIGluIHR1cm4uXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi5hcChbUi5tdWx0aXBseSgyKSwgUi5hZGQoMyldLCBbMSwyLDNdKTsgLy89PiBbMiwgNCwgNiwgNCwgNSwgNl1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkyKGZ1bmN0aW9uIGFwKGFwcGxpY2F0aXZlLCBmbikge1xuICByZXR1cm4gKFxuICAgIHR5cGVvZiBhcHBsaWNhdGl2ZS5hcCA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgICBhcHBsaWNhdGl2ZS5hcChmbikgOlxuICAgIHR5cGVvZiBhcHBsaWNhdGl2ZSA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgICBmdW5jdGlvbih4KSB7IHJldHVybiBhcHBsaWNhdGl2ZSh4KShmbih4KSk7IH0gOlxuICAgIC8vIGVsc2VcbiAgICAgIF9yZWR1Y2UoZnVuY3Rpb24oYWNjLCBmKSB7IHJldHVybiBfY29uY2F0KGFjYywgbWFwKGYsIGZuKSk7IH0sIFtdLCBhcHBsaWNhdGl2ZSlcbiAgKTtcbn0pO1xuIiwidmFyIF9jdXJyeTMgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTMnKTtcblxuXG4vKipcbiAqIFJldHVybnMgYSBzaW5nbGUgaXRlbSBieSBpdGVyYXRpbmcgdGhyb3VnaCB0aGUgbGlzdCwgc3VjY2Vzc2l2ZWx5IGNhbGxpbmdcbiAqIHRoZSBpdGVyYXRvciBmdW5jdGlvbiBhbmQgcGFzc2luZyBpdCBhbiBhY2N1bXVsYXRvciB2YWx1ZSBhbmQgdGhlIGN1cnJlbnRcbiAqIHZhbHVlIGZyb20gdGhlIGFycmF5LCBhbmQgdGhlbiBwYXNzaW5nIHRoZSByZXN1bHQgdG8gdGhlIG5leHQgY2FsbC5cbiAqXG4gKiBTaW1pbGFyIHRvIGByZWR1Y2VgLCBleGNlcHQgbW92ZXMgdGhyb3VnaCB0aGUgaW5wdXQgbGlzdCBmcm9tIHRoZSByaWdodCB0b1xuICogdGhlIGxlZnQuXG4gKlxuICogVGhlIGl0ZXJhdG9yIGZ1bmN0aW9uIHJlY2VpdmVzIHR3byB2YWx1ZXM6ICooYWNjLCB2YWx1ZSkqXG4gKlxuICogTm90ZTogYFIucmVkdWNlUmlnaHRgIGRvZXMgbm90IHNraXAgZGVsZXRlZCBvciB1bmFzc2lnbmVkIGluZGljZXMgKHNwYXJzZVxuICogYXJyYXlzKSwgdW5saWtlIHRoZSBuYXRpdmUgYEFycmF5LnByb3RvdHlwZS5yZWR1Y2VgIG1ldGhvZC4gRm9yIG1vcmUgZGV0YWlsc1xuICogb24gdGhpcyBiZWhhdmlvciwgc2VlOlxuICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvcmVkdWNlUmlnaHQjRGVzY3JpcHRpb25cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBMaXN0XG4gKiBAc2lnIChhLGIgLT4gYSkgLT4gYSAtPiBbYl0gLT4gYVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGl0ZXJhdG9yIGZ1bmN0aW9uLiBSZWNlaXZlcyB0d28gdmFsdWVzLCB0aGUgYWNjdW11bGF0b3IgYW5kIHRoZVxuICogICAgICAgIGN1cnJlbnQgZWxlbWVudCBmcm9tIHRoZSBhcnJheS5cbiAqIEBwYXJhbSB7Kn0gYWNjIFRoZSBhY2N1bXVsYXRvciB2YWx1ZS5cbiAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHJldHVybiB7Kn0gVGhlIGZpbmFsLCBhY2N1bXVsYXRlZCB2YWx1ZS5cbiAqIEBzZWUgUi5hZGRJbmRleFxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIHZhciBwYWlycyA9IFsgWydhJywgMV0sIFsnYicsIDJdLCBbJ2MnLCAzXSBdO1xuICogICAgICB2YXIgZmxhdHRlblBhaXJzID0gKGFjYywgcGFpcikgPT4gYWNjLmNvbmNhdChwYWlyKTtcbiAqXG4gKiAgICAgIFIucmVkdWNlUmlnaHQoZmxhdHRlblBhaXJzLCBbXSwgcGFpcnMpOyAvLz0+IFsgJ2MnLCAzLCAnYicsIDIsICdhJywgMSBdXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MyhmdW5jdGlvbiByZWR1Y2VSaWdodChmbiwgYWNjLCBsaXN0KSB7XG4gIHZhciBpZHggPSBsaXN0Lmxlbmd0aCAtIDE7XG4gIHdoaWxlIChpZHggPj0gMCkge1xuICAgIGFjYyA9IGZuKGFjYywgbGlzdFtpZHhdKTtcbiAgICBpZHggLT0gMTtcbiAgfVxuICByZXR1cm4gYWNjO1xufSk7XG4iLCJ2YXIgX2N1cnJ5MiA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MicpO1xudmFyIGFwID0gcmVxdWlyZSgnLi9hcCcpO1xudmFyIG1hcCA9IHJlcXVpcmUoJy4vbWFwJyk7XG52YXIgcHJlcGVuZCA9IHJlcXVpcmUoJy4vcHJlcGVuZCcpO1xudmFyIHJlZHVjZVJpZ2h0ID0gcmVxdWlyZSgnLi9yZWR1Y2VSaWdodCcpO1xuXG5cbi8qKlxuICogVHJhbnNmb3JtcyBhIFtUcmF2ZXJzYWJsZV0oaHR0cHM6Ly9naXRodWIuY29tL2ZhbnRhc3lsYW5kL2ZhbnRhc3ktbGFuZCN0cmF2ZXJzYWJsZSlcbiAqIG9mIFtBcHBsaWNhdGl2ZV0oaHR0cHM6Ly9naXRodWIuY29tL2ZhbnRhc3lsYW5kL2ZhbnRhc3ktbGFuZCNhcHBsaWNhdGl2ZSkgaW50byBhblxuICogQXBwbGljYXRpdmUgb2YgVHJhdmVyc2FibGUuXG4gKlxuICogRGlzcGF0Y2hlcyB0byB0aGUgYHNlcXVlbmNlYCBtZXRob2Qgb2YgdGhlIHNlY29uZCBhcmd1bWVudCwgaWYgcHJlc2VudC5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xOS4wXG4gKiBAY2F0ZWdvcnkgTGlzdFxuICogQHNpZyAoQXBwbGljYXRpdmUgZiwgVHJhdmVyc2FibGUgdCkgPT4gKGEgLT4gZiBhKSAtPiB0IChmIGEpIC0+IGYgKHQgYSlcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9mXG4gKiBAcGFyYW0geyp9IHRyYXZlcnNhYmxlXG4gKiBAcmV0dXJuIHsqfVxuICogQHNlZSBSLnRyYXZlcnNlXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi5zZXF1ZW5jZShNYXliZS5vZiwgW0p1c3QoMSksIEp1c3QoMiksIEp1c3QoMyldKTsgICAvLz0+IEp1c3QoWzEsIDIsIDNdKVxuICogICAgICBSLnNlcXVlbmNlKE1heWJlLm9mLCBbSnVzdCgxKSwgSnVzdCgyKSwgTm90aGluZygpXSk7IC8vPT4gTm90aGluZygpXG4gKlxuICogICAgICBSLnNlcXVlbmNlKFIub2YsIEp1c3QoWzEsIDIsIDNdKSk7IC8vPT4gW0p1c3QoMSksIEp1c3QoMiksIEp1c3QoMyldXG4gKiAgICAgIFIuc2VxdWVuY2UoUi5vZiwgTm90aGluZygpKTsgICAgICAgLy89PiBbTm90aGluZygpXVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTIoZnVuY3Rpb24gc2VxdWVuY2Uob2YsIHRyYXZlcnNhYmxlKSB7XG4gIHJldHVybiB0eXBlb2YgdHJhdmVyc2FibGUuc2VxdWVuY2UgPT09ICdmdW5jdGlvbicgP1xuICAgIHRyYXZlcnNhYmxlLnNlcXVlbmNlKG9mKSA6XG4gICAgcmVkdWNlUmlnaHQoZnVuY3Rpb24oYWNjLCB4KSB7IHJldHVybiBhcChtYXAocHJlcGVuZCwgeCksIGFjYyk7IH0sXG4gICAgICAgICAgICAgICAgb2YoW10pLFxuICAgICAgICAgICAgICAgIHRyYXZlcnNhYmxlKTtcbn0pO1xuIiwidmFyIF9jdXJyeTMgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTMnKTtcbnZhciBtYXAgPSByZXF1aXJlKCcuL21hcCcpO1xudmFyIHNlcXVlbmNlID0gcmVxdWlyZSgnLi9zZXF1ZW5jZScpO1xuXG5cbi8qKlxuICogTWFwcyBhbiBbQXBwbGljYXRpdmVdKGh0dHBzOi8vZ2l0aHViLmNvbS9mYW50YXN5bGFuZC9mYW50YXN5LWxhbmQjYXBwbGljYXRpdmUpLXJldHVybmluZ1xuICogZnVuY3Rpb24gb3ZlciBhIFtUcmF2ZXJzYWJsZV0oaHR0cHM6Ly9naXRodWIuY29tL2ZhbnRhc3lsYW5kL2ZhbnRhc3ktbGFuZCN0cmF2ZXJzYWJsZSksXG4gKiB0aGVuIHVzZXMgW2BzZXF1ZW5jZWBdKCNzZXF1ZW5jZSkgdG8gdHJhbnNmb3JtIHRoZSByZXN1bHRpbmcgVHJhdmVyc2FibGUgb2YgQXBwbGljYXRpdmVcbiAqIGludG8gYW4gQXBwbGljYXRpdmUgb2YgVHJhdmVyc2FibGUuXG4gKlxuICogRGlzcGF0Y2hlcyB0byB0aGUgYHNlcXVlbmNlYCBtZXRob2Qgb2YgdGhlIHRoaXJkIGFyZ3VtZW50LCBpZiBwcmVzZW50LlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjE5LjBcbiAqIEBjYXRlZ29yeSBMaXN0XG4gKiBAc2lnIChBcHBsaWNhdGl2ZSBmLCBUcmF2ZXJzYWJsZSB0KSA9PiAoYSAtPiBmIGEpIC0+IChhIC0+IGYgYikgLT4gdCBhIC0+IGYgKHQgYilcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9mXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmXG4gKiBAcGFyYW0geyp9IHRyYXZlcnNhYmxlXG4gKiBAcmV0dXJuIHsqfVxuICogQHNlZSBSLnNlcXVlbmNlXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgLy8gUmV0dXJucyBgTm90aGluZ2AgaWYgdGhlIGdpdmVuIGRpdmlzb3IgaXMgYDBgXG4gKiAgICAgIHNhZmVEaXYgPSBuID0+IGQgPT4gZCA9PT0gMCA/IE5vdGhpbmcoKSA6IEp1c3QobiAvIGQpXG4gKlxuICogICAgICBSLnRyYXZlcnNlKE1heWJlLm9mLCBzYWZlRGl2KDEwKSwgWzIsIDQsIDVdKTsgLy89PiBKdXN0KFs1LCAyLjUsIDJdKVxuICogICAgICBSLnRyYXZlcnNlKE1heWJlLm9mLCBzYWZlRGl2KDEwKSwgWzIsIDAsIDVdKTsgLy89PiBOb3RoaW5nXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MyhmdW5jdGlvbiB0cmF2ZXJzZShvZiwgZiwgdHJhdmVyc2FibGUpIHtcbiAgcmV0dXJuIHNlcXVlbmNlKG9mLCBtYXAoZiwgdHJhdmVyc2FibGUpKTtcbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfYXJyYXlGcm9tSXRlcmF0b3IoaXRlcikge1xuICB2YXIgbGlzdCA9IFtdO1xuICB2YXIgbmV4dDtcbiAgd2hpbGUgKCEobmV4dCA9IGl0ZXIubmV4dCgpKS5kb25lKSB7XG4gICAgbGlzdC5wdXNoKG5leHQudmFsdWUpO1xuICB9XG4gIHJldHVybiBsaXN0O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2Z1bmN0aW9uTmFtZShmKSB7XG4gIC8vIFN0cmluZyh4ID0+IHgpIGV2YWx1YXRlcyB0byBcInggPT4geFwiLCBzbyB0aGUgcGF0dGVybiBtYXkgbm90IG1hdGNoLlxuICB2YXIgbWF0Y2ggPSBTdHJpbmcoZikubWF0Y2goL15mdW5jdGlvbiAoXFx3KikvKTtcbiAgcmV0dXJuIG1hdGNoID09IG51bGwgPyAnJyA6IG1hdGNoWzFdO1xufTtcbiIsInZhciBfY3VycnkyID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkyJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgaXRzIGFyZ3VtZW50cyBhcmUgaWRlbnRpY2FsLCBmYWxzZSBvdGhlcndpc2UuIFZhbHVlcyBhcmVcbiAqIGlkZW50aWNhbCBpZiB0aGV5IHJlZmVyZW5jZSB0aGUgc2FtZSBtZW1vcnkuIGBOYU5gIGlzIGlkZW50aWNhbCB0byBgTmFOYDtcbiAqIGAwYCBhbmQgYC0wYCBhcmUgbm90IGlkZW50aWNhbC5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xNS4wXG4gKiBAY2F0ZWdvcnkgUmVsYXRpb25cbiAqIEBzaWcgYSAtPiBhIC0+IEJvb2xlYW5cbiAqIEBwYXJhbSB7Kn0gYVxuICogQHBhcmFtIHsqfSBiXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIHZhciBvID0ge307XG4gKiAgICAgIFIuaWRlbnRpY2FsKG8sIG8pOyAvLz0+IHRydWVcbiAqICAgICAgUi5pZGVudGljYWwoMSwgMSk7IC8vPT4gdHJ1ZVxuICogICAgICBSLmlkZW50aWNhbCgxLCAnMScpOyAvLz0+IGZhbHNlXG4gKiAgICAgIFIuaWRlbnRpY2FsKFtdLCBbXSk7IC8vPT4gZmFsc2VcbiAqICAgICAgUi5pZGVudGljYWwoMCwgLTApOyAvLz0+IGZhbHNlXG4gKiAgICAgIFIuaWRlbnRpY2FsKE5hTiwgTmFOKTsgLy89PiB0cnVlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MihmdW5jdGlvbiBpZGVudGljYWwoYSwgYikge1xuICAvLyBTYW1lVmFsdWUgYWxnb3JpdGhtXG4gIGlmIChhID09PSBiKSB7IC8vIFN0ZXBzIDEtNSwgNy0xMFxuICAgIC8vIFN0ZXBzIDYuYi02LmU6ICswICE9IC0wXG4gICAgcmV0dXJuIGEgIT09IDAgfHwgMSAvIGEgPT09IDEgLyBiO1xuICB9IGVsc2Uge1xuICAgIC8vIFN0ZXAgNi5hOiBOYU4gPT0gTmFOXG4gICAgcmV0dXJuIGEgIT09IGEgJiYgYiAhPT0gYjtcbiAgfVxufSk7XG4iLCJ2YXIgX2N1cnJ5MSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MScpO1xuXG5cbi8qKlxuICogR2l2ZXMgYSBzaW5nbGUtd29yZCBzdHJpbmcgZGVzY3JpcHRpb24gb2YgdGhlIChuYXRpdmUpIHR5cGUgb2YgYSB2YWx1ZSxcbiAqIHJldHVybmluZyBzdWNoIGFuc3dlcnMgYXMgJ09iamVjdCcsICdOdW1iZXInLCAnQXJyYXknLCBvciAnTnVsbCcuIERvZXMgbm90XG4gKiBhdHRlbXB0IHRvIGRpc3Rpbmd1aXNoIHVzZXIgT2JqZWN0IHR5cGVzIGFueSBmdXJ0aGVyLCByZXBvcnRpbmcgdGhlbSBhbGwgYXNcbiAqICdPYmplY3QnLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjguMFxuICogQGNhdGVnb3J5IFR5cGVcbiAqIEBzaWcgKCogLT4geyp9KSAtPiBTdHJpbmdcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi50eXBlKHt9KTsgLy89PiBcIk9iamVjdFwiXG4gKiAgICAgIFIudHlwZSgxKTsgLy89PiBcIk51bWJlclwiXG4gKiAgICAgIFIudHlwZShmYWxzZSk7IC8vPT4gXCJCb29sZWFuXCJcbiAqICAgICAgUi50eXBlKCdzJyk7IC8vPT4gXCJTdHJpbmdcIlxuICogICAgICBSLnR5cGUobnVsbCk7IC8vPT4gXCJOdWxsXCJcbiAqICAgICAgUi50eXBlKFtdKTsgLy89PiBcIkFycmF5XCJcbiAqICAgICAgUi50eXBlKC9bQS16XS8pOyAvLz0+IFwiUmVnRXhwXCJcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkxKGZ1bmN0aW9uIHR5cGUodmFsKSB7XG4gIHJldHVybiB2YWwgPT09IG51bGwgICAgICA/ICdOdWxsJyAgICAgIDpcbiAgICAgICAgIHZhbCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOlxuICAgICAgICAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbCkuc2xpY2UoOCwgLTEpO1xufSk7XG4iLCJ2YXIgX2FycmF5RnJvbUl0ZXJhdG9yID0gcmVxdWlyZSgnLi9fYXJyYXlGcm9tSXRlcmF0b3InKTtcbnZhciBfZnVuY3Rpb25OYW1lID0gcmVxdWlyZSgnLi9fZnVuY3Rpb25OYW1lJyk7XG52YXIgX2hhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIGlkZW50aWNhbCA9IHJlcXVpcmUoJy4uL2lkZW50aWNhbCcpO1xudmFyIGtleXMgPSByZXF1aXJlKCcuLi9rZXlzJyk7XG52YXIgdHlwZSA9IHJlcXVpcmUoJy4uL3R5cGUnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9lcXVhbHMoYSwgYiwgc3RhY2tBLCBzdGFja0IpIHtcbiAgaWYgKGlkZW50aWNhbChhLCBiKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKHR5cGUoYSkgIT09IHR5cGUoYikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoYSA9PSBudWxsIHx8IGIgPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgYS5lcXVhbHMgPT09ICdmdW5jdGlvbicgfHwgdHlwZW9mIGIuZXF1YWxzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBhLmVxdWFscyA9PT0gJ2Z1bmN0aW9uJyAmJiBhLmVxdWFscyhiKSAmJlxuICAgICAgICAgICB0eXBlb2YgYi5lcXVhbHMgPT09ICdmdW5jdGlvbicgJiYgYi5lcXVhbHMoYSk7XG4gIH1cblxuICBzd2l0Y2ggKHR5cGUoYSkpIHtcbiAgICBjYXNlICdBcmd1bWVudHMnOlxuICAgIGNhc2UgJ0FycmF5JzpcbiAgICBjYXNlICdPYmplY3QnOlxuICAgICAgaWYgKHR5cGVvZiBhLmNvbnN0cnVjdG9yID09PSAnZnVuY3Rpb24nICYmXG4gICAgICAgICAgX2Z1bmN0aW9uTmFtZShhLmNvbnN0cnVjdG9yKSA9PT0gJ1Byb21pc2UnKSB7XG4gICAgICAgIHJldHVybiBhID09PSBiO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnQm9vbGVhbic6XG4gICAgY2FzZSAnTnVtYmVyJzpcbiAgICBjYXNlICdTdHJpbmcnOlxuICAgICAgaWYgKCEodHlwZW9mIGEgPT09IHR5cGVvZiBiICYmIGlkZW50aWNhbChhLnZhbHVlT2YoKSwgYi52YWx1ZU9mKCkpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICdEYXRlJzpcbiAgICAgIGlmICghaWRlbnRpY2FsKGEudmFsdWVPZigpLCBiLnZhbHVlT2YoKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnRXJyb3InOlxuICAgICAgcmV0dXJuIGEubmFtZSA9PT0gYi5uYW1lICYmIGEubWVzc2FnZSA9PT0gYi5tZXNzYWdlO1xuICAgIGNhc2UgJ1JlZ0V4cCc6XG4gICAgICBpZiAoIShhLnNvdXJjZSA9PT0gYi5zb3VyY2UgJiZcbiAgICAgICAgICAgIGEuZ2xvYmFsID09PSBiLmdsb2JhbCAmJlxuICAgICAgICAgICAgYS5pZ25vcmVDYXNlID09PSBiLmlnbm9yZUNhc2UgJiZcbiAgICAgICAgICAgIGEubXVsdGlsaW5lID09PSBiLm11bHRpbGluZSAmJlxuICAgICAgICAgICAgYS5zdGlja3kgPT09IGIuc3RpY2t5ICYmXG4gICAgICAgICAgICBhLnVuaWNvZGUgPT09IGIudW5pY29kZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnTWFwJzpcbiAgICBjYXNlICdTZXQnOlxuICAgICAgaWYgKCFfZXF1YWxzKF9hcnJheUZyb21JdGVyYXRvcihhLmVudHJpZXMoKSksIF9hcnJheUZyb21JdGVyYXRvcihiLmVudHJpZXMoKSksIHN0YWNrQSwgc3RhY2tCKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICdJbnQ4QXJyYXknOlxuICAgIGNhc2UgJ1VpbnQ4QXJyYXknOlxuICAgIGNhc2UgJ1VpbnQ4Q2xhbXBlZEFycmF5JzpcbiAgICBjYXNlICdJbnQxNkFycmF5JzpcbiAgICBjYXNlICdVaW50MTZBcnJheSc6XG4gICAgY2FzZSAnSW50MzJBcnJheSc6XG4gICAgY2FzZSAnVWludDMyQXJyYXknOlxuICAgIGNhc2UgJ0Zsb2F0MzJBcnJheSc6XG4gICAgY2FzZSAnRmxvYXQ2NEFycmF5JzpcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ0FycmF5QnVmZmVyJzpcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICAvLyBWYWx1ZXMgb2Ygb3RoZXIgdHlwZXMgYXJlIG9ubHkgZXF1YWwgaWYgaWRlbnRpY2FsLlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIGtleXNBID0ga2V5cyhhKTtcbiAgaWYgKGtleXNBLmxlbmd0aCAhPT0ga2V5cyhiKS5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgaWR4ID0gc3RhY2tBLmxlbmd0aCAtIDE7XG4gIHdoaWxlIChpZHggPj0gMCkge1xuICAgIGlmIChzdGFja0FbaWR4XSA9PT0gYSkge1xuICAgICAgcmV0dXJuIHN0YWNrQltpZHhdID09PSBiO1xuICAgIH1cbiAgICBpZHggLT0gMTtcbiAgfVxuXG4gIHN0YWNrQS5wdXNoKGEpO1xuICBzdGFja0IucHVzaChiKTtcbiAgaWR4ID0ga2V5c0EubGVuZ3RoIC0gMTtcbiAgd2hpbGUgKGlkeCA+PSAwKSB7XG4gICAgdmFyIGtleSA9IGtleXNBW2lkeF07XG4gICAgaWYgKCEoX2hhcyhrZXksIGIpICYmIF9lcXVhbHMoYltrZXldLCBhW2tleV0sIHN0YWNrQSwgc3RhY2tCKSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWR4IC09IDE7XG4gIH1cbiAgc3RhY2tBLnBvcCgpO1xuICBzdGFja0IucG9wKCk7XG4gIHJldHVybiB0cnVlO1xufTtcbiIsInZhciBfY3VycnkyID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkyJyk7XG52YXIgX2VxdWFscyA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2VxdWFscycpO1xuXG5cbi8qKlxuICogUmV0dXJucyBgdHJ1ZWAgaWYgaXRzIGFyZ3VtZW50cyBhcmUgZXF1aXZhbGVudCwgYGZhbHNlYCBvdGhlcndpc2UuIEhhbmRsZXNcbiAqIGN5Y2xpY2FsIGRhdGEgc3RydWN0dXJlcy5cbiAqXG4gKiBEaXNwYXRjaGVzIHN5bW1ldHJpY2FsbHkgdG8gdGhlIGBlcXVhbHNgIG1ldGhvZHMgb2YgYm90aCBhcmd1bWVudHMsIGlmXG4gKiBwcmVzZW50LlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjE1LjBcbiAqIEBjYXRlZ29yeSBSZWxhdGlvblxuICogQHNpZyBhIC0+IGIgLT4gQm9vbGVhblxuICogQHBhcmFtIHsqfSBhXG4gKiBAcGFyYW0geyp9IGJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi5lcXVhbHMoMSwgMSk7IC8vPT4gdHJ1ZVxuICogICAgICBSLmVxdWFscygxLCAnMScpOyAvLz0+IGZhbHNlXG4gKiAgICAgIFIuZXF1YWxzKFsxLCAyLCAzXSwgWzEsIDIsIDNdKTsgLy89PiB0cnVlXG4gKlxuICogICAgICB2YXIgYSA9IHt9OyBhLnYgPSBhO1xuICogICAgICB2YXIgYiA9IHt9OyBiLnYgPSBiO1xuICogICAgICBSLmVxdWFscyhhLCBiKTsgLy89PiB0cnVlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MihmdW5jdGlvbiBlcXVhbHMoYSwgYikge1xuICByZXR1cm4gX2VxdWFscyhhLCBiLCBbXSwgW10pO1xufSk7XG4iLCIvLyBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNCBRdWlsZHJlZW4gTW90dGEgPHF1aWxkcmVlbkBnbWFpbC5jb20+XG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbi8vIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzXG4vLyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4vLyBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuLy8gcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbi8vIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4vLyBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuLy8gaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbi8vIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbi8vIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcbi8vIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cbi8vIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuLy8gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8qKlxuICogQG1vZHVsZSBsaWIvZWl0aGVyXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gRWl0aGVyXG5cbi8vIC0tIEFsaWFzZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGNsb25lICAgICAgICAgPSBPYmplY3QuY3JlYXRlXG52YXIgdW5pbXBsZW1lbnRlZCA9IGZ1bmN0aW9uKCl7IHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkLicpIH1cbnZhciBub29wICAgICAgICAgID0gZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXMgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG5cbi8vIC0tIEltcGxlbWVudGF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIFRoZSBgRWl0aGVyKGEsIGIpYCBzdHJ1Y3R1cmUgcmVwcmVzZW50cyB0aGUgbG9naWNhbCBkaXNqdW5jdGlvbiBiZXR3ZWVuIGBhYFxuICogYW5kIGBiYC4gSW4gb3RoZXIgd29yZHMsIGBFaXRoZXJgIG1heSBjb250YWluIGVpdGhlciBhIHZhbHVlIG9mIHR5cGUgYGFgIG9yXG4gKiBhIHZhbHVlIG9mIHR5cGUgYGJgLCBhdCBhbnkgZ2l2ZW4gdGltZS4gVGhpcyBwYXJ0aWN1bGFyIGltcGxlbWVudGF0aW9uIGlzXG4gKiBiaWFzZWQgb24gdGhlIHJpZ2h0IHZhbHVlIChgYmApLCB0aHVzIHByb2plY3Rpb25zIHdpbGwgdGFrZSB0aGUgcmlnaHQgdmFsdWVcbiAqIG92ZXIgdGhlIGxlZnQgb25lLlxuICpcbiAqIFRoaXMgY2xhc3MgbW9kZWxzIHR3byBkaWZmZXJlbnQgY2FzZXM6IGBMZWZ0IGFgIGFuZCBgUmlnaHQgYmAsIGFuZCBjYW4gaG9sZFxuICogb25lIG9mIHRoZSBjYXNlcyBhdCBhbnkgZ2l2ZW4gdGltZS4gVGhlIHByb2plY3Rpb25zIGFyZSwgbm9uZSB0aGUgbGVzcyxcbiAqIGJpYXNlZCBmb3IgdGhlIGBSaWdodGAgY2FzZSwgdGh1cyBhIGNvbW1vbiB1c2UgY2FzZSBmb3IgdGhpcyBzdHJ1Y3R1cmUgaXMgdG9cbiAqIGhvbGQgdGhlIHJlc3VsdHMgb2YgY29tcHV0YXRpb25zIHRoYXQgbWF5IGZhaWwsIHdoZW4geW91IHdhbnQgdG8gc3RvcmVcbiAqIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gb24gdGhlIGZhaWx1cmUgKGluc3RlYWQgb2YgdGhyb3dpbmcgYW4gZXhjZXB0aW9uKS5cbiAqXG4gKiBGdXJ0aGVybW9yZSwgdGhlIHZhbHVlcyBvZiBgRWl0aGVyKGEsIGIpYCBjYW4gYmUgY29tYmluZWQgYW5kIG1hbmlwdWxhdGVkIGJ5XG4gKiB1c2luZyB0aGUgZXhwcmVzc2l2ZSBtb25hZGljIG9wZXJhdGlvbnMuIFRoaXMgYWxsb3dzIHNhZmVseSBzZXF1ZW5jaW5nXG4gKiBvcGVyYXRpb25zIHRoYXQgbWF5IGZhaWwsIGFuZCBzYWZlbHkgY29tcG9zaW5nIHZhbHVlcyB0aGF0IHlvdSBkb24ndCBrbm93XG4gKiB3aGV0aGVyIHRoZXkncmUgcHJlc2VudCBvciBub3QsIGZhaWxpbmcgZWFybHkgKHJldHVybmluZyBhIGBMZWZ0IGFgKSBpZiBhbnlcbiAqIG9mIHRoZSBvcGVyYXRpb25zIGZhaWwuXG4gKlxuICogV2hpbGUgdGhpcyBjbGFzcyBjYW4gY2VydGFpbmx5IG1vZGVsIGlucHV0IHZhbGlkYXRpb25zLCB0aGUgW1ZhbGlkYXRpb25dW11cbiAqIHN0cnVjdHVyZSBsZW5kcyBpdHNlbGYgYmV0dGVyIHRvIHRoYXQgdXNlIGNhc2UsIHNpbmNlIGl0IGNhbiBuYXR1cmFsbHlcbiAqIGFnZ3JlZ2F0ZSBmYWlsdXJlcyDigJQgbW9uYWRzIHNob3J0Y3V0IG9uIHRoZSBmaXJzdCBmYWlsdXJlLlxuICpcbiAqIFtWYWxpZGF0aW9uXTogaHR0cHM6Ly9naXRodWIuY29tL2ZvbGt0YWxlL2RhdGEudmFsaWRhdGlvblxuICpcbiAqXG4gKiBAY2xhc3NcbiAqIEBzdW1tYXJ5XG4gKiBFaXRoZXJbzrEsIM6yXSA8OiBBcHBsaWNhdGl2ZVvOsl1cbiAqICAgICAgICAgICAgICAgLCBGdW5jdG9yW86yXVxuICogICAgICAgICAgICAgICAsIENoYWluW86yXVxuICogICAgICAgICAgICAgICAsIFNob3dcbiAqICAgICAgICAgICAgICAgLCBFcVxuICovXG5mdW5jdGlvbiBFaXRoZXIoKSB7IH1cblxuTGVmdC5wcm90b3R5cGUgPSBjbG9uZShFaXRoZXIucHJvdG90eXBlKVxuZnVuY3Rpb24gTGVmdChhKSB7XG4gIHRoaXMudmFsdWUgPSBhXG59XG5cblJpZ2h0LnByb3RvdHlwZSA9IGNsb25lKEVpdGhlci5wcm90b3R5cGUpXG5mdW5jdGlvbiBSaWdodChhKSB7XG4gIHRoaXMudmFsdWUgPSBhXG59XG5cbi8vIC0tIENvbnN0cnVjdG9ycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIENvbnN0cnVjdHMgYSBuZXcgYEVpdGhlclvOsSwgzrJdYCBzdHJ1Y3R1cmUgaG9sZGluZyBhIGBMZWZ0YCB2YWx1ZS4gVGhpc1xuICogdXN1YWxseSByZXByZXNlbnRzIGEgZmFpbHVyZSBkdWUgdG8gdGhlIHJpZ2h0LWJpYXMgb2YgdGhpcyBzdHJ1Y3R1cmUuXG4gKlxuICogQHN1bW1hcnkgYSDihpIgRWl0aGVyW86xLCDOsl1cbiAqL1xuRWl0aGVyLkxlZnQgPSBmdW5jdGlvbihhKSB7XG4gIHJldHVybiBuZXcgTGVmdChhKVxufVxuRWl0aGVyLnByb3RvdHlwZS5MZWZ0ID0gRWl0aGVyLkxlZnRcblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGEgbmV3IGBFaXRoZXJbzrEsIM6yXWAgc3RydWN0dXJlIGhvbGRpbmcgYSBgUmlnaHRgIHZhbHVlLiBUaGlzXG4gKiB1c3VhbGx5IHJlcHJlc2VudHMgYSBzdWNjZXNzZnVsIHZhbHVlIGR1ZSB0byB0aGUgcmlnaHQgYmlhcyBvZiB0aGlzXG4gKiBzdHJ1Y3R1cmUuXG4gKlxuICogQHN1bW1hcnkgzrIg4oaSIEVpdGhlclvOsSwgzrJdXG4gKi9cbkVpdGhlci5SaWdodCA9IGZ1bmN0aW9uKGEpIHtcbiAgcmV0dXJuIG5ldyBSaWdodChhKVxufVxuRWl0aGVyLnByb3RvdHlwZS5SaWdodCA9IEVpdGhlci5SaWdodFxuXG5cbi8vIC0tIENvbnZlcnNpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIENvbnN0cnVjdHMgYSBuZXcgYEVpdGhlclvOsSwgzrJdYCBzdHJ1Y3R1cmUgZnJvbSBhIG51bGxhYmxlIHR5cGUuXG4gKlxuICogVGFrZXMgdGhlIGBMZWZ0YCBjYXNlIGlmIHRoZSB2YWx1ZSBpcyBgbnVsbGAgb3IgYHVuZGVmaW5lZGAuIFRha2VzIHRoZVxuICogYFJpZ2h0YCBjYXNlIG90aGVyd2lzZS5cbiAqXG4gKiBAc3VtbWFyeSDOsSDihpIgRWl0aGVyW86xLCDOsV1cbiAqL1xuRWl0aGVyLmZyb21OdWxsYWJsZSA9IGZ1bmN0aW9uKGEpIHtcbiAgcmV0dXJuIGEgIT0gbnVsbD8gICAgICAgbmV3IFJpZ2h0KGEpXG4gIDogICAgICAvKiBvdGhlcndpc2UgKi8gIG5ldyBMZWZ0KGEpXG59XG5FaXRoZXIucHJvdG90eXBlLmZyb21OdWxsYWJsZSA9IEVpdGhlci5mcm9tTnVsbGFibGVcblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGEgbmV3IGBFaXRoZXJbzrEsIM6yXWAgc3RydWN0dXJlIGZyb20gYSBgVmFsaWRhdGlvblvOsSwgzrJdYCB0eXBlLlxuICpcbiAqIEBzdW1tYXJ5IFZhbGlkYXRpb25bzrEsIM6yXSDihpIgRWl0aGVyW86xLCDOsl1cbiAqL1xuRWl0aGVyLmZyb21WYWxpZGF0aW9uID0gZnVuY3Rpb24oYSkge1xuICByZXR1cm4gYS5mb2xkKEVpdGhlci5MZWZ0LCBFaXRoZXIuUmlnaHQpXG59XG5cbi8qKlxuICogRXhlY3V0ZXMgYSBzeW5jaHJvbm91cyBjb21wdXRhdGlvbiB0aGF0IG1heSB0aHJvdyBhbmQgY29udmVydHMgaXQgdG8gYW5cbiAqIEVpdGhlciB0eXBlLlxuICpcbiAqIEBzdW1tYXJ5ICjOseKCgSwgzrHigoIsIC4uLiwgzrHigpkgLT4gzrIgOjogdGhyb3dzIM6zKSAtPiAozrHigoEsIM6x4oKCLCAuLi4sIM6x4oKZIC0+IEVpdGhlclvOsywgzrJdKVxuICovXG5FaXRoZXIudHJ5ID0gZnVuY3Rpb24oZikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBuZXcgUmlnaHQoZi5hcHBseShudWxsLCBhcmd1bWVudHMpKVxuICAgIH0gY2F0Y2goZSkge1xuICAgICAgcmV0dXJuIG5ldyBMZWZ0KGUpXG4gICAgfVxuICB9XG59XG5cblxuLy8gLS0gUHJlZGljYXRlcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogVHJ1ZSBpZiB0aGUgYEVpdGhlclvOsSwgzrJdYCBjb250YWlucyBhIGBMZWZ0YCB2YWx1ZS5cbiAqXG4gKiBAc3VtbWFyeSBCb29sZWFuXG4gKi9cbkVpdGhlci5wcm90b3R5cGUuaXNMZWZ0ID0gZmFsc2VcbkxlZnQucHJvdG90eXBlLmlzTGVmdCAgID0gdHJ1ZVxuXG4vKipcbiAqIFRydWUgaWYgdGhlIGBFaXRoZXJbzrEsIM6yXWAgY29udGFpbnMgYSBgUmlnaHRgIHZhbHVlLlxuICpcbiAqIEBzdW1tYXJ5IEJvb2xlYW5cbiAqL1xuRWl0aGVyLnByb3RvdHlwZS5pc1JpZ2h0ID0gZmFsc2VcblJpZ2h0LnByb3RvdHlwZS5pc1JpZ2h0ICA9IHRydWVcblxuXG4vLyAtLSBBcHBsaWNhdGl2ZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGBFaXRoZXJbzrEsIM6yXWAgaW5zdGFuY2UgaG9sZGluZyB0aGUgYFJpZ2h0YCB2YWx1ZSBgYmAuXG4gKlxuICogYGJgIGNhbiBiZSBhbnkgdmFsdWUsIGluY2x1ZGluZyBgbnVsbGAsIGB1bmRlZmluZWRgIG9yIGFub3RoZXJcbiAqIGBFaXRoZXJbzrEsIM6yXWAgc3RydWN0dXJlLlxuICpcbiAqIEBzdW1tYXJ5IM6yIOKGkiBFaXRoZXJbzrEsIM6yXVxuICovXG5FaXRoZXIub2YgPSBmdW5jdGlvbihhKSB7XG4gIHJldHVybiBuZXcgUmlnaHQoYSlcbn1cbkVpdGhlci5wcm90b3R5cGUub2YgPSBFaXRoZXIub2ZcblxuXG4vKipcbiAqIEFwcGxpZXMgdGhlIGZ1bmN0aW9uIGluc2lkZSB0aGUgYFJpZ2h0YCBjYXNlIG9mIHRoZSBgRWl0aGVyW86xLCDOsl1gIHN0cnVjdHVyZVxuICogdG8gYW5vdGhlciBhcHBsaWNhdGl2ZSB0eXBlLlxuICpcbiAqIFRoZSBgRWl0aGVyW86xLCDOsl1gIHNob3VsZCBjb250YWluIGEgZnVuY3Rpb24gdmFsdWUsIG90aGVyd2lzZSBhIGBUeXBlRXJyb3JgXG4gKiBpcyB0aHJvd24uXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgKEBFaXRoZXJbzrEsIM6yIOKGkiDOs10sIGY6QXBwbGljYXRpdmVbX10pID0+IGZbzrJdIOKGkiBmW86zXVxuICovXG5FaXRoZXIucHJvdG90eXBlLmFwID0gdW5pbXBsZW1lbnRlZFxuXG5MZWZ0LnByb3RvdHlwZS5hcCA9IGZ1bmN0aW9uKGIpIHtcbiAgcmV0dXJuIHRoaXNcbn1cblxuUmlnaHQucHJvdG90eXBlLmFwID0gZnVuY3Rpb24oYikge1xuICByZXR1cm4gYi5tYXAodGhpcy52YWx1ZSlcbn1cblxuXG4vLyAtLSBGdW5jdG9yIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBUcmFuc2Zvcm1zIHRoZSBgUmlnaHRgIHZhbHVlIG9mIHRoZSBgRWl0aGVyW86xLCDOsl1gIHN0cnVjdHVyZSB1c2luZyBhIHJlZ3VsYXJcbiAqIHVuYXJ5IGZ1bmN0aW9uLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IChARWl0aGVyW86xLCDOsl0pID0+ICjOsiDihpIgzrMpIOKGkiBFaXRoZXJbzrEsIM6zXVxuICovXG5FaXRoZXIucHJvdG90eXBlLm1hcCA9IHVuaW1wbGVtZW50ZWRcbkxlZnQucHJvdG90eXBlLm1hcCAgID0gbm9vcFxuXG5SaWdodC5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24oZikge1xuICByZXR1cm4gdGhpcy5vZihmKHRoaXMudmFsdWUpKVxufVxuXG5cbi8vIC0tIENoYWluIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIFRyYW5zZm9ybXMgdGhlIGBSaWdodGAgdmFsdWUgb2YgdGhlIGBFaXRoZXJbzrEsIM6yXWAgc3RydWN0dXJlIHVzaW5nIGFuIHVuYXJ5XG4gKiBmdW5jdGlvbiB0byBtb25hZHMuXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgKEBFaXRoZXJbzrEsIM6yXSwgbTpNb25hZFtfXSkgPT4gKM6yIOKGkiBtW86zXSkg4oaSIG1bzrNdXG4gKi9cbkVpdGhlci5wcm90b3R5cGUuY2hhaW4gPSB1bmltcGxlbWVudGVkXG5MZWZ0LnByb3RvdHlwZS5jaGFpbiAgID0gbm9vcFxuXG5SaWdodC5wcm90b3R5cGUuY2hhaW4gPSBmdW5jdGlvbihmKSB7XG4gIHJldHVybiBmKHRoaXMudmFsdWUpXG59XG5cblxuLy8gLS0gU2hvdyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogUmV0dXJucyBhIHRleHR1YWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIGBFaXRoZXJbzrEsIM6yXWAgc3RydWN0dXJlLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IChARWl0aGVyW86xLCDOsl0pID0+IFZvaWQg4oaSIFN0cmluZ1xuICovXG5FaXRoZXIucHJvdG90eXBlLnRvU3RyaW5nID0gdW5pbXBsZW1lbnRlZFxuXG5MZWZ0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ0VpdGhlci5MZWZ0KCcgKyB0aGlzLnZhbHVlICsgJyknXG59XG5cblJpZ2h0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ0VpdGhlci5SaWdodCgnICsgdGhpcy52YWx1ZSArICcpJ1xufVxuXG5cbi8vIC0tIEVxIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIFRlc3RzIGlmIGFuIGBFaXRoZXJbzrEsIM6yXWAgc3RydWN0dXJlIGlzIGVxdWFsIHRvIGFub3RoZXIgYEVpdGhlclvOsSwgzrJdYFxuICogc3RydWN0dXJlLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IChARWl0aGVyW86xLCDOsl0pID0+IEVpdGhlclvOsSwgzrJdIOKGkiBCb29sZWFuXG4gKi9cbkVpdGhlci5wcm90b3R5cGUuaXNFcXVhbCA9IHVuaW1wbGVtZW50ZWRcblxuTGVmdC5wcm90b3R5cGUuaXNFcXVhbCA9IGZ1bmN0aW9uKGEpIHtcbiAgcmV0dXJuIGEuaXNMZWZ0ICYmIChhLnZhbHVlID09PSB0aGlzLnZhbHVlKVxufVxuXG5SaWdodC5wcm90b3R5cGUuaXNFcXVhbCA9IGZ1bmN0aW9uKGEpIHtcbiAgcmV0dXJuIGEuaXNSaWdodCAmJiAoYS52YWx1ZSA9PT0gdGhpcy52YWx1ZSlcbn1cblxuXG4vLyAtLSBFeHRyYWN0aW5nIGFuZCByZWNvdmVyaW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBFeHRyYWN0cyB0aGUgYFJpZ2h0YCB2YWx1ZSBvdXQgb2YgdGhlIGBFaXRoZXJbzrEsIM6yXWAgc3RydWN0dXJlLCBpZiBpdFxuICogZXhpc3RzLiBPdGhlcndpc2UgdGhyb3dzIGEgYFR5cGVFcnJvcmAuXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgKEBFaXRoZXJbzrEsIM6yXSkgPT4gVm9pZCDihpIgzrIgICAgICAgICA6OiBwYXJ0aWFsLCB0aHJvd3NcbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpsaWIvZWl0aGVyfkVpdGhlciNnZXRPckVsc2V9IOKAlCBBIGdldHRlciB0aGF0IGNhbiBoYW5kbGUgZmFpbHVyZXMuXG4gKiBAc2VlIHtAbGluayBtb2R1bGU6bGliL2VpdGhlcn5FaXRoZXIjbWVyZ2V9IOKAlCBUaGUgY29udmVyZ2VuY2Ugb2YgYm90aCB2YWx1ZXMuXG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9IGlmIHRoZSBzdHJ1Y3R1cmUgaGFzIG5vIGBSaWdodGAgdmFsdWUuXG4gKi9cbkVpdGhlci5wcm90b3R5cGUuZ2V0ID0gdW5pbXBsZW1lbnRlZFxuXG5MZWZ0LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbigpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbid0IGV4dHJhY3QgdGhlIHZhbHVlIG9mIGEgTGVmdChhKS5cIilcbn1cblxuUmlnaHQucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy52YWx1ZVxufVxuXG5cbi8qKlxuICogRXh0cmFjdHMgdGhlIGBSaWdodGAgdmFsdWUgb3V0IG9mIHRoZSBgRWl0aGVyW86xLCDOsl1gIHN0cnVjdHVyZS4gSWYgdGhlXG4gKiBzdHJ1Y3R1cmUgZG9lc24ndCBoYXZlIGEgYFJpZ2h0YCB2YWx1ZSwgcmV0dXJucyB0aGUgZ2l2ZW4gZGVmYXVsdC5cbiAqXG4gKiBAbWV0aG9kXG4gKiBAc3VtbWFyeSAoQEVpdGhlclvOsSwgzrJdKSA9PiDOsiDihpIgzrJcbiAqL1xuRWl0aGVyLnByb3RvdHlwZS5nZXRPckVsc2UgPSB1bmltcGxlbWVudGVkXG5cbkxlZnQucHJvdG90eXBlLmdldE9yRWxzZSA9IGZ1bmN0aW9uKGEpIHtcbiAgcmV0dXJuIGFcbn1cblxuUmlnaHQucHJvdG90eXBlLmdldE9yRWxzZSA9IGZ1bmN0aW9uKF8pIHtcbiAgcmV0dXJuIHRoaXMudmFsdWVcbn1cblxuXG4vKipcbiAqIFRyYW5zZm9ybXMgYSBgTGVmdGAgdmFsdWUgaW50byBhIG5ldyBgRWl0aGVyW86xLCDOsl1gIHN0cnVjdHVyZS4gRG9lcyBub3RoaW5nXG4gKiBpZiB0aGUgc3RydWN0dXJlIGNvbnRhaW4gYSBgUmlnaHRgIHZhbHVlLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IChARWl0aGVyW86xLCDOsl0pID0+ICjOsSDihpIgRWl0aGVyW86zLCDOsl0pIOKGkiBFaXRoZXJbzrMsIM6yXVxuICovXG5FaXRoZXIucHJvdG90eXBlLm9yRWxzZSA9IHVuaW1wbGVtZW50ZWRcblJpZ2h0LnByb3RvdHlwZS5vckVsc2UgID0gbm9vcFxuXG5MZWZ0LnByb3RvdHlwZS5vckVsc2UgPSBmdW5jdGlvbihmKSB7XG4gIHJldHVybiBmKHRoaXMudmFsdWUpXG59XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSB2YWx1ZSBvZiB3aGljaGV2ZXIgc2lkZSBvZiB0aGUgZGlzanVuY3Rpb24gdGhhdCBpcyBwcmVzZW50LlxuICpcbiAqIEBzdW1tYXJ5IChARWl0aGVyW86xLCDOsV0pID0+IFZvaWQg4oaSIM6xXG4gKi9cbkVpdGhlci5wcm90b3R5cGUubWVyZ2UgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMudmFsdWVcbn1cblxuXG4vLyAtLSBGb2xkcyBhbmQgRXh0ZW5kZWQgVHJhbnNmb3JtYXRpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBBcHBsaWVzIGEgZnVuY3Rpb24gdG8gZWFjaCBjYXNlIGluIHRoaXMgZGF0YSBzdHJ1Y3R1cmUuXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgKEBFaXRoZXJbzrEsIM6yXSkgPT4gKM6xIOKGkiDOsyksICjOsiDihpIgzrMpIOKGkiDOs1xuICovXG5FaXRoZXIucHJvdG90eXBlLmZvbGQgPSB1bmltcGxlbWVudGVkXG5cbkxlZnQucHJvdG90eXBlLmZvbGQgPSBmdW5jdGlvbihmLCBfKSB7XG4gIHJldHVybiBmKHRoaXMudmFsdWUpXG59XG5cblJpZ2h0LnByb3RvdHlwZS5mb2xkID0gZnVuY3Rpb24oXywgZykge1xuICByZXR1cm4gZyh0aGlzLnZhbHVlKVxufVxuXG4vKipcbiAqIENhdGFtb3JwaGlzbS5cbiAqIFxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgKEBFaXRoZXJbzrEsIM6yXSkgPT4geyBMZWZ0OiDOsSDihpIgzrMsIFJpZ2h0OiDOsiDihpIgzrMgfSDihpIgzrNcbiAqL1xuRWl0aGVyLnByb3RvdHlwZS5jYXRhID0gdW5pbXBsZW1lbnRlZFxuXG5MZWZ0LnByb3RvdHlwZS5jYXRhID0gZnVuY3Rpb24ocGF0dGVybikge1xuICByZXR1cm4gcGF0dGVybi5MZWZ0KHRoaXMudmFsdWUpXG59XG5cblJpZ2h0LnByb3RvdHlwZS5jYXRhID0gZnVuY3Rpb24ocGF0dGVybikge1xuICByZXR1cm4gcGF0dGVybi5SaWdodCh0aGlzLnZhbHVlKVxufVxuXG5cbi8qKlxuICogU3dhcHMgdGhlIGRpc2p1bmN0aW9uIHZhbHVlcy5cbiAqXG4gKiBAbWV0aG9kXG4gKiBAc3VtbWFyeSAoQEVpdGhlclvOsSwgzrJdKSA9PiBWb2lkIOKGkiBFaXRoZXJbzrIsIM6xXVxuICovXG5FaXRoZXIucHJvdG90eXBlLnN3YXAgPSB1bmltcGxlbWVudGVkXG5cbkxlZnQucHJvdG90eXBlLnN3YXAgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuUmlnaHQodGhpcy52YWx1ZSlcbn1cblxuUmlnaHQucHJvdG90eXBlLnN3YXAgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuTGVmdCh0aGlzLnZhbHVlKVxufVxuXG5cbi8qKlxuICogTWFwcyBib3RoIHNpZGVzIG9mIHRoZSBkaXNqdW5jdGlvbi5cbiAqXG4gKiBAbWV0aG9kXG4gKiBAc3VtbWFyeSAoQEVpdGhlclvOsSwgzrJdKSA9PiAozrEg4oaSIM6zKSwgKM6yIOKGkiDOtCkg4oaSIEVpdGhlclvOsywgzrRdXG4gKi9cbkVpdGhlci5wcm90b3R5cGUuYmltYXAgPSB1bmltcGxlbWVudGVkXG5cbkxlZnQucHJvdG90eXBlLmJpbWFwID0gZnVuY3Rpb24oZiwgXykge1xuICByZXR1cm4gdGhpcy5MZWZ0KGYodGhpcy52YWx1ZSkpXG59XG5cblJpZ2h0LnByb3RvdHlwZS5iaW1hcCA9IGZ1bmN0aW9uKF8sIGcpIHtcbiAgcmV0dXJuIHRoaXMuUmlnaHQoZyh0aGlzLnZhbHVlKSlcbn1cblxuXG4vKipcbiAqIE1hcHMgdGhlIGxlZnQgc2lkZSBvZiB0aGUgZGlzanVuY3Rpb24uXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgKEBFaXRoZXJbzrEsIM6yXSkgPT4gKM6xIOKGkiDOsykg4oaSIEVpdGhlclvOsywgzrJdXG4gKi9cbkVpdGhlci5wcm90b3R5cGUubGVmdE1hcCA9IHVuaW1wbGVtZW50ZWRcblJpZ2h0LnByb3RvdHlwZS5sZWZ0TWFwICA9IG5vb3BcblxuTGVmdC5wcm90b3R5cGUubGVmdE1hcCA9IGZ1bmN0aW9uKGYpIHtcbiAgcmV0dXJuIHRoaXMuTGVmdChmKHRoaXMudmFsdWUpKVxufVxuIiwiLy8gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTQgUXVpbGRyZWVuIE1vdHRhIDxxdWlsZHJlZW5AZ21haWwuY29tPlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4vLyBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlc1xuLy8gKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuLy8gaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbi8vIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4vLyBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuLy8gc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcbi8vIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4vLyBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4vLyBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG4vLyBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXG4vLyBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT05cbi8vIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZWl0aGVyJykiLCIvKiBAZmxvdyB3ZWFrICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuZXctY2FwICovXG5pbXBvcnQgeyBwdXNoSGlzdG9yeVN0YXRlLCBjcmVhdGVJZCB9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgeyBjdXJyeSwgZXF1YWxzLCB0cmF2ZXJzZSwgaWRlbnRpdHksIHBhdGggfSBmcm9tIFwicmFtZGFcIjtcbmltcG9ydCBFaXRoZXIgZnJvbSBcImRhdGEuZWl0aGVyXCI7XG5cbi8vIFthXSA9PiBFaXRoZXIgU3RyaW5nIFthXVxuY29uc3QgaXNBcnJheSA9IGFyciA9PlxuICBBcnJheS5pc0FycmF5KGFycilcbiAgICA/IEVpdGhlci5SaWdodChhcnIpXG4gICAgOiBFaXRoZXIuTGVmdChgSW52YWxpZCBzdGF0ZXMgc2VudCB3aXRoIGltcG9ydFN0YXRlLiBFeHBlY3RlZCBBcnJheSBidXQgcmVjZWl2ZWQgJHt0eXBlb2YgYXJyfWApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG1heC1sZW5cblxuY29uc3QgZmllbGRUeXBlSXNWYWxpZCA9IGN1cnJ5KCh2YWxpZFR5cGVzLCBmaWVsZCkgPT5cbiAgdmFsaWRUeXBlcy5maW5kKGVxdWFscyhmaWVsZC50eXBlKSlcbiAgICA/IEVpdGhlci5SaWdodChmaWVsZClcbiAgICA6IEVpdGhlci5MZWZ0KGBJbnZhbGlkIGZpZWxkIHR5cGUgJHtmaWVsZC50eXBlfWApXG4pO1xuXG5jb25zdCB2YWxpZEZpZWxkVHlwZXMgPSBjdXJyeSgodmFsaWRUeXBlcywgZmllbGRzU3RhdGUpID0+XG4gIHRyYXZlcnNlKEVpdGhlci5vZiwgZmllbGRUeXBlSXNWYWxpZCh2YWxpZFR5cGVzKSwgZmllbGRzU3RhdGUpXG4pO1xuXG5cbi8vIFthXSAtPiBbYV0gLT4gRWl0aGVyIFN0cmluZyBbYV1cbmNvbnN0IHZhbGlkYXRlRmllbGRzU3RhdGUgPSBjdXJyeSgoZmllbGRzU3RhdGUsIHN0YXRlKSA9PlxuICBFaXRoZXIub2YoZmllbGRzU3RhdGUpXG4gICAgLmNoYWluKGlzQXJyYXkpXG4gICAgLmNoYWluKHZhbGlkRmllbGRUeXBlcyhzdGF0ZS5maWVsZFR5cGVzLm1hcChwYXRoKFtcImluZm9cIixcInR5cGVcIl0pKSkpXG4pO1xuXG5cbi8vIEFkZCByZXF1aXJlZCBwcm9wZXJ0aWVzIHRoYXQgYXJlIG5vdCBtYW5hZ2VkIGJ5IHRoZSBmaWVsZFxuLy8gY29tcG9uZW50IGJ1dCBieSB0aGUgRm9ybUJ1aWxkZXIgY29tcG9uZW50IGl0c2VsZiwgc28gbWF5XG4vLyBub3QgYmUgdGhlcmUuXG4vLyBbYV0gPT4gW2FdXG5jb25zdCBhZGRSZXF1aXJlZFByb3BlcnRpZXMgPSBmaWVsZFN0YXRlcyA9PlxuICBmaWVsZFN0YXRlc1xuICAgIC5tYXAocyA9PiBPYmplY3QuYXNzaWduKFxuICAgICAge1xuICAgICAgICBjb25maWdTaG93aW5nOiBmYWxzZSxcbiAgICAgICAgaWQ6IGNyZWF0ZUlkKCksXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgIH0sIHNcbiAgICApKTtcblxuXG4vLyBJZiB0aGVyZSBhcmUgYW55IHByb2JsZW1zIHdpdGggdGhlIGltcG9ydCwgdGhlIHNhbWUgc3RhdGVcbi8vIHdpbGwgYmUgcmV0dXJuZWRcbmV4cG9ydCBkZWZhdWx0IChzdGF0ZSwgeyBuZXdGaWVsZHNTdGF0ZSB9KSA9PlxuICB2YWxpZGF0ZUZpZWxkc1N0YXRlKG5ld0ZpZWxkc1N0YXRlLCBzdGF0ZSlcbiAgICAubWFwKGFkZFJlcXVpcmVkUHJvcGVydGllcylcbiAgICAubWFwKHB1c2hIaXN0b3J5U3RhdGUoc3RhdGUpKVxuICAgIC5iaW1hcChjb25zb2xlLmVycm9yLCBpZGVudGl0eSlcbiAgICAuZ2V0T3JFbHNlKHN0YXRlKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX3JlZHVjZWQoeCkge1xuICByZXR1cm4geCAmJiB4WydAQHRyYW5zZHVjZXIvcmVkdWNlZCddID8geCA6XG4gICAge1xuICAgICAgJ0BAdHJhbnNkdWNlci92YWx1ZSc6IHgsXG4gICAgICAnQEB0cmFuc2R1Y2VyL3JlZHVjZWQnOiB0cnVlXG4gICAgfTtcbn07XG4iLCJ2YXIgX2N1cnJ5MiA9IHJlcXVpcmUoJy4vX2N1cnJ5MicpO1xudmFyIF9yZWR1Y2VkID0gcmVxdWlyZSgnLi9fcmVkdWNlZCcpO1xudmFyIF94ZkJhc2UgPSByZXF1aXJlKCcuL194ZkJhc2UnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gWEZpbmQoZiwgeGYpIHtcbiAgICB0aGlzLnhmID0geGY7XG4gICAgdGhpcy5mID0gZjtcbiAgICB0aGlzLmZvdW5kID0gZmFsc2U7XG4gIH1cbiAgWEZpbmQucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvaW5pdCddID0gX3hmQmFzZS5pbml0O1xuICBYRmluZC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXSA9IGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgIGlmICghdGhpcy5mb3VuZCkge1xuICAgICAgcmVzdWx0ID0gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXShyZXN1bHQsIHZvaWQgMCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnhmWydAQHRyYW5zZHVjZXIvcmVzdWx0J10ocmVzdWx0KTtcbiAgfTtcbiAgWEZpbmQucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvc3RlcCddID0gZnVuY3Rpb24ocmVzdWx0LCBpbnB1dCkge1xuICAgIGlmICh0aGlzLmYoaW5wdXQpKSB7XG4gICAgICB0aGlzLmZvdW5kID0gdHJ1ZTtcbiAgICAgIHJlc3VsdCA9IF9yZWR1Y2VkKHRoaXMueGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10ocmVzdWx0LCBpbnB1dCkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIHJldHVybiBfY3VycnkyKGZ1bmN0aW9uIF94ZmluZChmLCB4ZikgeyByZXR1cm4gbmV3IFhGaW5kKGYsIHhmKTsgfSk7XG59KCkpO1xuIiwidmFyIF9jdXJyeTIgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTInKTtcbnZhciBfZGlzcGF0Y2hhYmxlID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fZGlzcGF0Y2hhYmxlJyk7XG52YXIgX3hmaW5kID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9feGZpbmQnKTtcblxuXG4vKipcbiAqIFJldHVybnMgdGhlIGZpcnN0IGVsZW1lbnQgb2YgdGhlIGxpc3Qgd2hpY2ggbWF0Y2hlcyB0aGUgcHJlZGljYXRlLCBvclxuICogYHVuZGVmaW5lZGAgaWYgbm8gZWxlbWVudCBtYXRjaGVzLlxuICpcbiAqIERpc3BhdGNoZXMgdG8gdGhlIGBmaW5kYCBtZXRob2Qgb2YgdGhlIHNlY29uZCBhcmd1bWVudCwgaWYgcHJlc2VudC5cbiAqXG4gKiBBY3RzIGFzIGEgdHJhbnNkdWNlciBpZiBhIHRyYW5zZm9ybWVyIGlzIGdpdmVuIGluIGxpc3QgcG9zaXRpb24uXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMS4wXG4gKiBAY2F0ZWdvcnkgTGlzdFxuICogQHNpZyAoYSAtPiBCb29sZWFuKSAtPiBbYV0gLT4gYSB8IHVuZGVmaW5lZFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIHByZWRpY2F0ZSBmdW5jdGlvbiB1c2VkIHRvIGRldGVybWluZSBpZiB0aGUgZWxlbWVudCBpcyB0aGVcbiAqICAgICAgICBkZXNpcmVkIG9uZS5cbiAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGFycmF5IHRvIGNvbnNpZGVyLlxuICogQHJldHVybiB7T2JqZWN0fSBUaGUgZWxlbWVudCBmb3VuZCwgb3IgYHVuZGVmaW5lZGAuXG4gKiBAc2VlIFIudHJhbnNkdWNlXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgdmFyIHhzID0gW3thOiAxfSwge2E6IDJ9LCB7YTogM31dO1xuICogICAgICBSLmZpbmQoUi5wcm9wRXEoJ2EnLCAyKSkoeHMpOyAvLz0+IHthOiAyfVxuICogICAgICBSLmZpbmQoUi5wcm9wRXEoJ2EnLCA0KSkoeHMpOyAvLz0+IHVuZGVmaW5lZFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTIoX2Rpc3BhdGNoYWJsZSgnZmluZCcsIF94ZmluZCwgZnVuY3Rpb24gZmluZChmbiwgbGlzdCkge1xuICB2YXIgaWR4ID0gMDtcbiAgdmFyIGxlbiA9IGxpc3QubGVuZ3RoO1xuICB3aGlsZSAoaWR4IDwgbGVuKSB7XG4gICAgaWYgKGZuKGxpc3RbaWR4XSkpIHtcbiAgICAgIHJldHVybiBsaXN0W2lkeF07XG4gICAgfVxuICAgIGlkeCArPSAxO1xuICB9XG59KSk7XG4iLCIndXNlIHN0cmljdCc7XG5cblxuLyoqXG4gKiBBIGhlbHBlciBmb3IgZGVsYXlpbmcgdGhlIGV4ZWN1dGlvbiBvZiBhIGZ1bmN0aW9uLlxuICogQHByaXZhdGVcbiAqIEBzdW1tYXJ5IChBbnkuLi4gLT4gQW55KSAtPiBWb2lkXG4gKi9cbnZhciBkZWxheWVkID0gdHlwZW9mIHNldEltbWVkaWF0ZSAhPT0gJ3VuZGVmaW5lZCc/ICBzZXRJbW1lZGlhdGVcbiAgICAgICAgICAgIDogdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnPyAgICAgICBwcm9jZXNzLm5leHRUaWNrXG4gICAgICAgICAgICA6IC8qIG90aGVyd2lzZSAqLyAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dFxuXG4vKipcbiAqIEBtb2R1bGUgbGliL3Rhc2tcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBUYXNrO1xuXG4vLyAtLSBJbXBsZW1lbnRhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBUaGUgYFRhc2tbzrEsIM6yXWAgc3RydWN0dXJlIHJlcHJlc2VudHMgdmFsdWVzIHRoYXQgZGVwZW5kIG9uIHRpbWUuIFRoaXNcbiAqIGFsbG93cyBvbmUgdG8gbW9kZWwgdGltZS1iYXNlZCBlZmZlY3RzIGV4cGxpY2l0bHksIHN1Y2ggdGhhdCBvbmUgY2FuIGhhdmVcbiAqIGZ1bGwga25vd2xlZGdlIG9mIHdoZW4gdGhleSdyZSBkZWFsaW5nIHdpdGggZGVsYXllZCBjb21wdXRhdGlvbnMsIGxhdGVuY3ksXG4gKiBvciBhbnl0aGluZyB0aGF0IGNhbiBub3QgYmUgY29tcHV0ZWQgaW1tZWRpYXRlbHkuXG4gKlxuICogQSBjb21tb24gdXNlIGZvciB0aGlzIHN0cnVjdHVyZSBpcyB0byByZXBsYWNlIHRoZSB1c3VhbCBDb250aW51YXRpb24tUGFzc2luZ1xuICogU3R5bGUgZm9ybSBvZiBwcm9ncmFtbWluZywgaW4gb3JkZXIgdG8gYmUgYWJsZSB0byBjb21wb3NlIGFuZCBzZXF1ZW5jZVxuICogdGltZS1kZXBlbmRlbnQgZWZmZWN0cyB1c2luZyB0aGUgZ2VuZXJpYyBhbmQgcG93ZXJmdWwgbW9uYWRpYyBvcGVyYXRpb25zLlxuICpcbiAqIEBjbGFzc1xuICogQHN1bW1hcnlcbiAqICgozrEg4oaSIFZvaWQpLCAozrIg4oaSIFZvaWQpIOKGkiBWb2lkKSwgKFZvaWQg4oaSIFZvaWQpIOKGkiBUYXNrW86xLCDOsl1cbiAqXG4gKiBUYXNrW86xLCDOsl0gPDogQ2hhaW5bzrJdXG4gKiAgICAgICAgICAgICAgICwgTW9uYWRbzrJdXG4gKiAgICAgICAgICAgICAgICwgRnVuY3RvclvOsl1cbiAqICAgICAgICAgICAgICAgLCBBcHBsaWNhdGl2ZVvOsl1cbiAqICAgICAgICAgICAgICAgLCBTZW1pZ3JvdXBbzrJdXG4gKiAgICAgICAgICAgICAgICwgTW9ub2lkW86yXVxuICogICAgICAgICAgICAgICAsIFNob3dcbiAqL1xuZnVuY3Rpb24gVGFzayhjb21wdXRhdGlvbiwgY2xlYW51cCkge1xuICB0aGlzLmZvcmsgPSBjb21wdXRhdGlvbjtcblxuICB0aGlzLmNsZWFudXAgPSBjbGVhbnVwIHx8IGZ1bmN0aW9uKCkge307XG59XG5cbi8qKlxuICogQ29uc3RydWN0cyBhIG5ldyBgVGFza1vOsSwgzrJdYCBjb250YWluaW5nIHRoZSBzaW5nbGUgdmFsdWUgYM6yYC5cbiAqXG4gKiBgzrJgIGNhbiBiZSBhbnkgdmFsdWUsIGluY2x1ZGluZyBgbnVsbGAsIGB1bmRlZmluZWRgLCBvciBhbm90aGVyXG4gKiBgVGFza1vOsSwgzrJdYCBzdHJ1Y3R1cmUuXG4gKlxuICogQHN1bW1hcnkgzrIg4oaSIFRhc2tbzrEsIM6yXVxuICovXG5UYXNrLnByb3RvdHlwZS5vZiA9IGZ1bmN0aW9uIF9vZihiKSB7XG4gIHJldHVybiBuZXcgVGFzayhmdW5jdGlvbihfLCByZXNvbHZlKSB7XG4gICAgcmV0dXJuIHJlc29sdmUoYik7XG4gIH0pO1xufTtcblxuVGFzay5vZiA9IFRhc2sucHJvdG90eXBlLm9mO1xuXG4vKipcbiAqIENvbnN0cnVjdHMgYSBuZXcgYFRhc2tbzrEsIM6yXWAgY29udGFpbmluZyB0aGUgc2luZ2xlIHZhbHVlIGDOsWAuXG4gKlxuICogYM6xYCBjYW4gYmUgYW55IHZhbHVlLCBpbmNsdWRpbmcgYG51bGxgLCBgdW5kZWZpbmVkYCwgb3IgYW5vdGhlclxuICogYFRhc2tbzrEsIM6yXWAgc3RydWN0dXJlLlxuICpcbiAqIEBzdW1tYXJ5IM6xIOKGkiBUYXNrW86xLCDOsl1cbiAqL1xuVGFzay5wcm90b3R5cGUucmVqZWN0ZWQgPSBmdW5jdGlvbiBfcmVqZWN0ZWQoYSkge1xuICByZXR1cm4gbmV3IFRhc2soZnVuY3Rpb24ocmVqZWN0KSB7XG4gICAgcmV0dXJuIHJlamVjdChhKTtcbiAgfSk7XG59O1xuXG5UYXNrLnJlamVjdGVkID0gVGFzay5wcm90b3R5cGUucmVqZWN0ZWQ7XG5cbi8vIC0tIEZ1bmN0b3IgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIFRyYW5zZm9ybXMgdGhlIHN1Y2Nlc3NmdWwgdmFsdWUgb2YgdGhlIGBUYXNrW86xLCDOsl1gIHVzaW5nIGEgcmVndWxhciB1bmFyeVxuICogZnVuY3Rpb24uXG4gKlxuICogQHN1bW1hcnkgQFRhc2tbzrEsIM6yXSA9PiAozrIg4oaSIM6zKSDihpIgVGFza1vOsSwgzrNdXG4gKi9cblRhc2sucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uIF9tYXAoZikge1xuICB2YXIgZm9yayA9IHRoaXMuZm9yaztcbiAgdmFyIGNsZWFudXAgPSB0aGlzLmNsZWFudXA7XG5cbiAgcmV0dXJuIG5ldyBUYXNrKGZ1bmN0aW9uKHJlamVjdCwgcmVzb2x2ZSkge1xuICAgIHJldHVybiBmb3JrKGZ1bmN0aW9uKGEpIHtcbiAgICAgIHJldHVybiByZWplY3QoYSk7XG4gICAgfSwgZnVuY3Rpb24oYikge1xuICAgICAgcmV0dXJuIHJlc29sdmUoZihiKSk7XG4gICAgfSk7XG4gIH0sIGNsZWFudXApO1xufTtcblxuLy8gLS0gQ2hhaW4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogVHJhbnNmb3JtcyB0aGUgc3VjY2VzZnVsIHZhbHVlIG9mIHRoZSBgVGFza1vOsSwgzrJdYCB1c2luZyBhIGZ1bmN0aW9uIHRvIGFcbiAqIG1vbmFkLlxuICpcbiAqIEBzdW1tYXJ5IEBUYXNrW86xLCDOsl0gPT4gKM6yIOKGkiBUYXNrW86xLCDOs10pIOKGkiBUYXNrW86xLCDOs11cbiAqL1xuVGFzay5wcm90b3R5cGUuY2hhaW4gPSBmdW5jdGlvbiBfY2hhaW4oZikge1xuICB2YXIgZm9yayA9IHRoaXMuZm9yaztcbiAgdmFyIGNsZWFudXAgPSB0aGlzLmNsZWFudXA7XG5cbiAgcmV0dXJuIG5ldyBUYXNrKGZ1bmN0aW9uKHJlamVjdCwgcmVzb2x2ZSkge1xuICAgIHJldHVybiBmb3JrKGZ1bmN0aW9uKGEpIHtcbiAgICAgIHJldHVybiByZWplY3QoYSk7XG4gICAgfSwgZnVuY3Rpb24oYikge1xuICAgICAgcmV0dXJuIGYoYikuZm9yayhyZWplY3QsIHJlc29sdmUpO1xuICAgIH0pO1xuICB9LCBjbGVhbnVwKTtcbn07XG5cbi8vIC0tIEFwcGx5IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIEFwcGx5cyB0aGUgc3VjY2Vzc2Z1bCB2YWx1ZSBvZiB0aGUgYFRhc2tbzrEsICjOsiDihpIgzrMpXWAgdG8gdGhlIHN1Y2Nlc3NmdWxcbiAqIHZhbHVlIG9mIHRoZSBgVGFza1vOsSwgzrJdYFxuICpcbiAqIEBzdW1tYXJ5IEBUYXNrW86xLCAozrIg4oaSIM6zKV0gPT4gVGFza1vOsSwgzrJdIOKGkiBUYXNrW86xLCDOs11cbiAqL1xuXG5UYXNrLnByb3RvdHlwZS5hcCA9IGZ1bmN0aW9uIF9hcCh0aGF0KSB7XG4gIHZhciBmb3JrVGhpcyA9IHRoaXMuZm9yaztcbiAgdmFyIGZvcmtUaGF0ID0gdGhhdC5mb3JrO1xuICB2YXIgY2xlYW51cFRoaXMgPSB0aGlzLmNsZWFudXA7XG4gIHZhciBjbGVhbnVwVGhhdCA9IHRoYXQuY2xlYW51cDtcblxuICBmdW5jdGlvbiBjbGVhbnVwQm90aChzdGF0ZSkge1xuICAgIGNsZWFudXBUaGlzKHN0YXRlWzBdKTtcbiAgICBjbGVhbnVwVGhhdChzdGF0ZVsxXSk7XG4gIH1cblxuICByZXR1cm4gbmV3IFRhc2soZnVuY3Rpb24ocmVqZWN0LCByZXNvbHZlKSB7XG4gICAgdmFyIGZ1bmMsIGZ1bmNMb2FkZWQgPSBmYWxzZTtcbiAgICB2YXIgdmFsLCB2YWxMb2FkZWQgPSBmYWxzZTtcbiAgICB2YXIgcmVqZWN0ZWQgPSBmYWxzZTtcbiAgICB2YXIgYWxsU3RhdGU7XG5cbiAgICB2YXIgdGhpc1N0YXRlID0gZm9ya1RoaXMoZ3VhcmRSZWplY3QsIGd1YXJkUmVzb2x2ZShmdW5jdGlvbih4KSB7XG4gICAgICBmdW5jTG9hZGVkID0gdHJ1ZTtcbiAgICAgIGZ1bmMgPSB4O1xuICAgIH0pKTtcblxuICAgIHZhciB0aGF0U3RhdGUgPSBmb3JrVGhhdChndWFyZFJlamVjdCwgZ3VhcmRSZXNvbHZlKGZ1bmN0aW9uKHgpIHtcbiAgICAgIHZhbExvYWRlZCA9IHRydWU7XG4gICAgICB2YWwgPSB4O1xuICAgIH0pKTtcblxuICAgIGZ1bmN0aW9uIGd1YXJkUmVzb2x2ZShzZXR0ZXIpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbih4KSB7XG4gICAgICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldHRlcih4KTtcbiAgICAgICAgaWYgKGZ1bmNMb2FkZWQgJiYgdmFsTG9hZGVkKSB7XG4gICAgICAgICAgZGVsYXllZChmdW5jdGlvbigpeyBjbGVhbnVwQm90aChhbGxTdGF0ZSkgfSk7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoZnVuYyh2YWwpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4geDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGd1YXJkUmVqZWN0KHgpIHtcbiAgICAgIGlmICghcmVqZWN0ZWQpIHtcbiAgICAgICAgcmVqZWN0ZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4gcmVqZWN0KHgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhbGxTdGF0ZSA9IFt0aGlzU3RhdGUsIHRoYXRTdGF0ZV07XG4gIH0sIGNsZWFudXBCb3RoKTtcbn07XG5cbi8vIC0tIFNlbWlncm91cCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBTZWxlY3RzIHRoZSBlYXJsaWVyIG9mIHRoZSB0d28gdGFza3MgYFRhc2tbzrEsIM6yXWBcbiAqXG4gKiBAc3VtbWFyeSBAVGFza1vOsSwgzrJdID0+IFRhc2tbzrEsIM6yXSDihpIgVGFza1vOsSwgzrJdXG4gKi9cblxuVGFzay5wcm90b3R5cGUuY29uY2F0ID0gZnVuY3Rpb24gX2NvbmNhdCh0aGF0KSB7XG4gIHZhciBmb3JrVGhpcyA9IHRoaXMuZm9yaztcbiAgdmFyIGZvcmtUaGF0ID0gdGhhdC5mb3JrO1xuICB2YXIgY2xlYW51cFRoaXMgPSB0aGlzLmNsZWFudXA7XG4gIHZhciBjbGVhbnVwVGhhdCA9IHRoYXQuY2xlYW51cDtcblxuICBmdW5jdGlvbiBjbGVhbnVwQm90aChzdGF0ZSkge1xuICAgIGNsZWFudXBUaGlzKHN0YXRlWzBdKTtcbiAgICBjbGVhbnVwVGhhdChzdGF0ZVsxXSk7XG4gIH1cblxuICByZXR1cm4gbmV3IFRhc2soZnVuY3Rpb24ocmVqZWN0LCByZXNvbHZlKSB7XG4gICAgdmFyIGRvbmUgPSBmYWxzZTtcbiAgICB2YXIgYWxsU3RhdGU7XG4gICAgdmFyIHRoaXNTdGF0ZSA9IGZvcmtUaGlzKGd1YXJkKHJlamVjdCksIGd1YXJkKHJlc29sdmUpKTtcbiAgICB2YXIgdGhhdFN0YXRlID0gZm9ya1RoYXQoZ3VhcmQocmVqZWN0KSwgZ3VhcmQocmVzb2x2ZSkpO1xuXG4gICAgcmV0dXJuIGFsbFN0YXRlID0gW3RoaXNTdGF0ZSwgdGhhdFN0YXRlXTtcblxuICAgIGZ1bmN0aW9uIGd1YXJkKGYpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbih4KSB7XG4gICAgICAgIGlmICghZG9uZSkge1xuICAgICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICAgIGRlbGF5ZWQoZnVuY3Rpb24oKXsgY2xlYW51cEJvdGgoYWxsU3RhdGUpIH0pXG4gICAgICAgICAgcmV0dXJuIGYoeCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9LCBjbGVhbnVwQm90aCk7XG5cbn07XG5cbi8vIC0tIE1vbm9pZCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBSZXR1cm5zIGEgVGFzayB0aGF0IHdpbGwgbmV2ZXIgcmVzb2x2ZVxuICpcbiAqIEBzdW1tYXJ5IFZvaWQg4oaSIFRhc2tbzrEsIF9dXG4gKi9cblRhc2suZW1wdHkgPSBmdW5jdGlvbiBfZW1wdHkoKSB7XG4gIHJldHVybiBuZXcgVGFzayhmdW5jdGlvbigpIHt9KTtcbn07XG5cblRhc2sucHJvdG90eXBlLmVtcHR5ID0gVGFzay5lbXB0eTtcblxuLy8gLS0gU2hvdyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogUmV0dXJucyBhIHRleHR1YWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIGBUYXNrW86xLCDOsl1gXG4gKlxuICogQHN1bW1hcnkgQFRhc2tbzrEsIM6yXSA9PiBWb2lkIOKGkiBTdHJpbmdcbiAqL1xuVGFzay5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiBfdG9TdHJpbmcoKSB7XG4gIHJldHVybiAnVGFzayc7XG59O1xuXG4vLyAtLSBFeHRyYWN0aW5nIGFuZCByZWNvdmVyaW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBUcmFuc2Zvcm1zIGEgZmFpbHVyZSB2YWx1ZSBpbnRvIGEgbmV3IGBUYXNrW86xLCDOsl1gLiBEb2VzIG5vdGhpbmcgaWYgdGhlXG4gKiBzdHJ1Y3R1cmUgYWxyZWFkeSBjb250YWlucyBhIHN1Y2Nlc3NmdWwgdmFsdWUuXG4gKlxuICogQHN1bW1hcnkgQFRhc2tbzrEsIM6yXSA9PiAozrEg4oaSIFRhc2tbzrMsIM6yXSkg4oaSIFRhc2tbzrMsIM6yXVxuICovXG5UYXNrLnByb3RvdHlwZS5vckVsc2UgPSBmdW5jdGlvbiBfb3JFbHNlKGYpIHtcbiAgdmFyIGZvcmsgPSB0aGlzLmZvcms7XG4gIHZhciBjbGVhbnVwID0gdGhpcy5jbGVhbnVwO1xuXG4gIHJldHVybiBuZXcgVGFzayhmdW5jdGlvbihyZWplY3QsIHJlc29sdmUpIHtcbiAgICByZXR1cm4gZm9yayhmdW5jdGlvbihhKSB7XG4gICAgICByZXR1cm4gZihhKS5mb3JrKHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgfSwgZnVuY3Rpb24oYikge1xuICAgICAgcmV0dXJuIHJlc29sdmUoYik7XG4gICAgfSk7XG4gIH0sIGNsZWFudXApO1xufTtcblxuLy8gLS0gRm9sZHMgYW5kIGV4dGVuZGVkIHRyYW5zZm9ybWF0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogQ2F0YW1vcnBoaXNtLiBUYWtlcyB0d28gZnVuY3Rpb25zLCBhcHBsaWVzIHRoZSBsZWZ0bW9zdCBvbmUgdG8gdGhlIGZhaWx1cmVcbiAqIHZhbHVlLCBhbmQgdGhlIHJpZ2h0bW9zdCBvbmUgdG8gdGhlIHN1Y2Nlc3NmdWwgdmFsdWUsIGRlcGVuZGluZyBvbiB3aGljaCBvbmVcbiAqIGlzIHByZXNlbnQuXG4gKlxuICogQHN1bW1hcnkgQFRhc2tbzrEsIM6yXSA9PiAozrEg4oaSIM6zKSwgKM6yIOKGkiDOsykg4oaSIFRhc2tbzrQsIM6zXVxuICovXG5UYXNrLnByb3RvdHlwZS5mb2xkID0gZnVuY3Rpb24gX2ZvbGQoZiwgZykge1xuICB2YXIgZm9yayA9IHRoaXMuZm9yaztcbiAgdmFyIGNsZWFudXAgPSB0aGlzLmNsZWFudXA7XG5cbiAgcmV0dXJuIG5ldyBUYXNrKGZ1bmN0aW9uKHJlamVjdCwgcmVzb2x2ZSkge1xuICAgIHJldHVybiBmb3JrKGZ1bmN0aW9uKGEpIHtcbiAgICAgIHJldHVybiByZXNvbHZlKGYoYSkpO1xuICAgIH0sIGZ1bmN0aW9uKGIpIHtcbiAgICAgIHJldHVybiByZXNvbHZlKGcoYikpO1xuICAgIH0pO1xuICB9LCBjbGVhbnVwKTtcbn07XG5cbi8qKlxuICogQ2F0YW1vcnBoaXNtLlxuICpcbiAqIEBzdW1tYXJ5IEBUYXNrW86xLCDOsl0gPT4geyBSZWplY3RlZDogzrEg4oaSIM6zLCBSZXNvbHZlZDogzrIg4oaSIM6zIH0g4oaSIFRhc2tbzrQsIM6zXVxuICovXG5UYXNrLnByb3RvdHlwZS5jYXRhID0gZnVuY3Rpb24gX2NhdGEocGF0dGVybikge1xuICByZXR1cm4gdGhpcy5mb2xkKHBhdHRlcm4uUmVqZWN0ZWQsIHBhdHRlcm4uUmVzb2x2ZWQpO1xufTtcblxuLyoqXG4gKiBTd2FwcyB0aGUgZGlzanVuY3Rpb24gdmFsdWVzLlxuICpcbiAqIEBzdW1tYXJ5IEBUYXNrW86xLCDOsl0gPT4gVm9pZCDihpIgVGFza1vOsiwgzrFdXG4gKi9cblRhc2sucHJvdG90eXBlLnN3YXAgPSBmdW5jdGlvbiBfc3dhcCgpIHtcbiAgdmFyIGZvcmsgPSB0aGlzLmZvcms7XG4gIHZhciBjbGVhbnVwID0gdGhpcy5jbGVhbnVwO1xuXG4gIHJldHVybiBuZXcgVGFzayhmdW5jdGlvbihyZWplY3QsIHJlc29sdmUpIHtcbiAgICByZXR1cm4gZm9yayhmdW5jdGlvbihhKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZShhKTtcbiAgICB9LCBmdW5jdGlvbihiKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KGIpO1xuICAgIH0pO1xuICB9LCBjbGVhbnVwKTtcbn07XG5cbi8qKlxuICogTWFwcyBib3RoIHNpZGVzIG9mIHRoZSBkaXNqdW5jdGlvbi5cbiAqXG4gKiBAc3VtbWFyeSBAVGFza1vOsSwgzrJdID0+ICjOsSDihpIgzrMpLCAozrIg4oaSIM60KSDihpIgVGFza1vOsywgzrRdXG4gKi9cblRhc2sucHJvdG90eXBlLmJpbWFwID0gZnVuY3Rpb24gX2JpbWFwKGYsIGcpIHtcbiAgdmFyIGZvcmsgPSB0aGlzLmZvcms7XG4gIHZhciBjbGVhbnVwID0gdGhpcy5jbGVhbnVwO1xuXG4gIHJldHVybiBuZXcgVGFzayhmdW5jdGlvbihyZWplY3QsIHJlc29sdmUpIHtcbiAgICByZXR1cm4gZm9yayhmdW5jdGlvbihhKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KGYoYSkpO1xuICAgIH0sIGZ1bmN0aW9uKGIpIHtcbiAgICAgIHJldHVybiByZXNvbHZlKGcoYikpO1xuICAgIH0pO1xuICB9LCBjbGVhbnVwKTtcbn07XG5cbi8qKlxuICogTWFwcyB0aGUgbGVmdCBzaWRlIG9mIHRoZSBkaXNqdW5jdGlvbiAoZmFpbHVyZSkuXG4gKlxuICogQHN1bW1hcnkgQFRhc2tbzrEsIM6yXSA9PiAozrEg4oaSIM6zKSDihpIgVGFza1vOsywgzrJdXG4gKi9cblRhc2sucHJvdG90eXBlLnJlamVjdGVkTWFwID0gZnVuY3Rpb24gX3JlamVjdGVkTWFwKGYpIHtcbiAgdmFyIGZvcmsgPSB0aGlzLmZvcms7XG4gIHZhciBjbGVhbnVwID0gdGhpcy5jbGVhbnVwO1xuXG4gIHJldHVybiBuZXcgVGFzayhmdW5jdGlvbihyZWplY3QsIHJlc29sdmUpIHtcbiAgICByZXR1cm4gZm9yayhmdW5jdGlvbihhKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KGYoYSkpO1xuICAgIH0sIGZ1bmN0aW9uKGIpIHtcbiAgICAgIHJldHVybiByZXNvbHZlKGIpO1xuICAgIH0pO1xuICB9LCBjbGVhbnVwKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vdGFzaycpO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbmV3LWNhcCAqL1xuaW1wb3J0IHsgcHJvcCwgZmluZCwgaWRlbnRpdHksIHBpcGUgfSBmcm9tIFwicmFtZGFcIjtcbmltcG9ydCB7IGNyZWF0ZUlkIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCBFaXRoZXIgZnJvbSBcImRhdGEuZWl0aGVyXCI7XG5pbXBvcnQgVGFzayBmcm9tIFwiZGF0YS50YXNrXCI7XG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gXCJzZWFtbGVzcy1pbW11dGFibGVcIjtcbmltcG9ydCB7IGZpZWxkQ3JlYXRlZCB9IGZyb20gXCIuLi9BY3Rpb25zXCI7XG5cbi8vIFN0YXRlIC0+IFN0cmluZyAtPiBFaXRoZXIgU3RyaW5nIEZ1bmN0aW9uXG5jb25zdCB0eXBlQ29uc3RydWN0b3IgPSAoc3RhdGUsIGZpZWxkVHlwZSkgPT4ge1xuICByZXR1cm4gRWl0aGVyLm9mKHN0YXRlKVxuICAgIC5tYXAocHJvcChcImZpZWxkVHlwZXNcIikpXG4gICAgLm1hcChmaW5kKHYgPT4gdi5pbmZvLnR5cGUgPT09IGZpZWxkVHlwZSkpXG4gICAgLmNoYWluKEVpdGhlci5mcm9tTnVsbGFibGUpXG4gICAgLmJpbWFwKF8gPT4gYEZpZWxkIFwiJHtmaWVsZFR5cGV9XCIgZG9lcyBub3QgZXhpc3QuYCwgaWRlbnRpdHkpO1xufTtcblxuLy8geyBpbml0aWFsU3RhdGU6IEZ1bmN0aW9uIH0gLT4gVGFzayBTdHJpbmcgT2JqZWN0XG5jb25zdCBjcmVhdGVGaWVsZCA9IGNvbnN0ciA9PlxuICBuZXcgVGFzaygocmVqZWN0LCByZXNvbHZlKSA9PiB7XG4gICAgLy8gTWFrZSBzdXJlIHRoZSBwcm9taXNlIGlzIG9ubHkgcmVzb2x2ZWQgb25jZVxuICAgIGxldCBjYWxsZWQgPSBmYWxzZTtcbiAgICBjb25zdCBmaWVsZFN0YXRlID0gY29uc3RyLmluaXRpYWxTdGF0ZSgpO1xuXG4gICAgaWYgKCEoZmllbGRTdGF0ZSBpbnN0YW5jZW9mIFByb21pc2UpKSB7XG4gICAgICByZXNvbHZlKGZpZWxkU3RhdGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaWVsZFN0YXRlXG4gICAgICAudGhlbih2ID0+IHtcbiAgICAgICAgaWYgKGNhbGxlZCkgeyByZXR1cm47IH1cbiAgICAgICAgY2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgcmVzb2x2ZSh2KTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2godiA9PiB7XG4gICAgICAgIGlmIChjYWxsZWQpIHsgdGhyb3cgdjsgfVxuICAgICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgICByZWplY3Qodik7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4vLyBPYmplY3QgLT4gT2JqZWN0XG5jb25zdCBpbnNlcnRSZXF1aXJlZFByb3BzID0gZmllbGQgPT5cbiAgSW1tdXRhYmxlKGZpZWxkKS5tZXJnZSh7XG4gICAgaWQ6IGNyZWF0ZUlkKCksXG4gICAgY29uZmlnU2hvd2luZzogdHJ1ZSxcbiAgfSwge1xuICAgIGRlZXA6IHRydWUsXG4gIH0pO1xuXG5jb25zdCBjcmVhdGVGaWVsZEFzeW5jaHJvbm91c2x5ID0gKHN0YXRlLCBmaWVsZFR5cGUsIGFzeW5jRGlzcGF0Y2gpID0+XG4gIHR5cGVDb25zdHJ1Y3RvcihzdGF0ZSwgZmllbGRUeXBlKVxuICAubWFwKGNyZWF0ZUZpZWxkKSAvLyBFaXRoZXIgU3RyaW5nIChUYXNrIFN0cmluZyBPYmplY3QpXG4gIC5sZWZ0TWFwKFRhc2sucmVqZWN0ZWQpXG4gIC5tZXJnZSgpIC8vIFRhc2sgU3RyaW5nIE9iamVjdFxuICAubWFwKGluc2VydFJlcXVpcmVkUHJvcHMpXG4gIC5mb3JrKCAvLyBleGVjdXRlIHRhc2tcbiAgICBlcnIgPT4gY29uc29sZS5lcnJvcihcIlRhc2sgcmVqZWN0ZWRcIiwgZXJyKSxcbiAgICBwaXBlKGZpZWxkQ3JlYXRlZCwgYXN5bmNEaXNwYXRjaClcbiAgKTtcblxuLy8gVGhpcyBpcyBhbiBhc3luYyBhY3Rpb24uIFdoZW4gaXQgaXMgZmluaXNoZWQgaXQgd2lsbCB0cmlnZ2VyIHRoZVxuLy8gZmllbGQgY3JlYXRlZCBhY3Rpb25cbmV4cG9ydCBkZWZhdWx0IChzdGF0ZSwgeyBmaWVsZFR5cGUsIGFzeW5jRGlzcGF0Y2ggfSkgPT4ge1xuICBjcmVhdGVGaWVsZEFzeW5jaHJvbm91c2x5KHN0YXRlLCBmaWVsZFR5cGUsIGFzeW5jRGlzcGF0Y2gpO1xuICByZXR1cm4gc3RhdGU7XG59O1xuIiwidmFyIF9jb25jYXQgPSByZXF1aXJlKCcuL2ludGVybmFsL19jb25jYXQnKTtcbnZhciBfY3VycnkyID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkyJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIGEgbmV3IGxpc3QgY29udGFpbmluZyB0aGUgY29udGVudHMgb2YgdGhlIGdpdmVuIGxpc3QsIGZvbGxvd2VkIGJ5XG4gKiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBMaXN0XG4gKiBAc2lnIGEgLT4gW2FdIC0+IFthXVxuICogQHBhcmFtIHsqfSBlbCBUaGUgZWxlbWVudCB0byBhZGQgdG8gdGhlIGVuZCBvZiB0aGUgbmV3IGxpc3QuXG4gKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IHdob3NlIGNvbnRlbnRzIHdpbGwgYmUgYWRkZWQgdG8gdGhlIGJlZ2lubmluZyBvZiB0aGUgb3V0cHV0XG4gKiAgICAgICAgbGlzdC5cbiAqIEByZXR1cm4ge0FycmF5fSBBIG5ldyBsaXN0IGNvbnRhaW5pbmcgdGhlIGNvbnRlbnRzIG9mIHRoZSBvbGQgbGlzdCBmb2xsb3dlZCBieSBgZWxgLlxuICogQHNlZSBSLnByZXBlbmRcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLmFwcGVuZCgndGVzdHMnLCBbJ3dyaXRlJywgJ21vcmUnXSk7IC8vPT4gWyd3cml0ZScsICdtb3JlJywgJ3Rlc3RzJ11cbiAqICAgICAgUi5hcHBlbmQoJ3Rlc3RzJywgW10pOyAvLz0+IFsndGVzdHMnXVxuICogICAgICBSLmFwcGVuZChbJ3Rlc3RzJ10sIFsnd3JpdGUnLCAnbW9yZSddKTsgLy89PiBbJ3dyaXRlJywgJ21vcmUnLCBbJ3Rlc3RzJ11dXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MihmdW5jdGlvbiBhcHBlbmQoZWwsIGxpc3QpIHtcbiAgcmV0dXJuIF9jb25jYXQobGlzdCwgW2VsXSk7XG59KTtcbiIsIi8vIENvcHlyaWdodCAoYykgMjAxMy0yMDE0IFF1aWxkcmVlbiBNb3R0YSA8cXVpbGRyZWVuQGdtYWlsLmNvbT5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuLy8gb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXNcbi8vICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbi8vIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4vLyBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuLy8gYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbi8vIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG4vLyBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuLy8gRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuLy8gTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuLy8gTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTlxuLy8gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG4vLyBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLyoqXG4gKiBAbW9kdWxlIGxpYi9tYXliZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IE1heWJlXG5cbi8vIC0tIEFsaWFzZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGNsb25lICAgICAgICAgPSBPYmplY3QuY3JlYXRlXG52YXIgdW5pbXBsZW1lbnRlZCA9IGZ1bmN0aW9uKCl7IHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkLicpIH1cbnZhciBub29wICAgICAgICAgID0gZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXMgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4vLyAtLSBJbXBsZW1lbnRhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBBIHN0cnVjdHVyZSBmb3IgdmFsdWVzIHRoYXQgbWF5IG5vdCBiZSBwcmVzZW50LCBvciBjb21wdXRhdGlvbnMgdGhhdCBtYXlcbiAqIGZhaWwuIGBNYXliZShhKWAgZXhwbGljaXRseSBtb2RlbHMgdGhlIGVmZmVjdHMgdGhhdCBhcmUgaW1wbGljaXQgaW5cbiAqIGBOdWxsYWJsZWAgdHlwZXMsIHRodXMgaGFzIG5vbmUgb2YgdGhlIHByb2JsZW1zIGFzc29jaWF0ZWQgd2l0aFxuICogYG51bGxgIG9yIGB1bmRlZmluZWRgIOKAlCBsaWtlIGBOdWxsUG9pbnRlckV4Y2VwdGlvbnNgLlxuICpcbiAqIFRoZSBjbGFzcyBtb2RlbHMgdHdvIGRpZmZlcmVudCBjYXNlczpcbiAqXG4gKiAgKyBgSnVzdCBhYCDigJQgcmVwcmVzZW50cyBhIGBNYXliZShhKWAgdGhhdCBjb250YWlucyBhIHZhbHVlLiBgYWAgbWF5XG4gKiAgICAgYmUgYW55IHZhbHVlLCBpbmNsdWRpbmcgYG51bGxgIG9yIGB1bmRlZmluZWRgLlxuICpcbiAqICArIGBOb3RoaW5nYCDigJQgcmVwcmVzZW50cyBhIGBNYXliZShhKWAgdGhhdCBoYXMgbm8gdmFsdWVzLiBPciBhXG4gKiAgICAgZmFpbHVyZSB0aGF0IG5lZWRzIG5vIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gKlxuICogQ29tbW9uIHVzZXMgb2YgdGhpcyBzdHJ1Y3R1cmUgaW5jbHVkZXMgbW9kZWxsaW5nIHZhbHVlcyB0aGF0IG1heSBvciBtYXlcbiAqIG5vdCBiZSBwcmVzZW50IGluIGEgY29sbGVjdGlvbiwgdGh1cyBpbnN0ZWFkIG9mIG5lZWRpbmcgYVxuICogYGNvbGxlY3Rpb24uaGFzKGEpYCwgdGhlIGBjb2xsZWN0aW9uLmdldChhKWAgb3BlcmF0aW9uIGdpdmVzIHlvdSBhbGxcbiAqIHRoZSBpbmZvcm1hdGlvbiB5b3UgbmVlZCDigJQgYGNvbGxlY3Rpb24uZ2V0KGEpLmlzLW5vdGhpbmdgIGJlaW5nXG4gKiBlcXVpdmFsZW50IHRvIGBjb2xsZWN0aW9uLmhhcyhhKWA7IFNpbWlsYXJseSB0aGUgc2FtZSByZWFzb25pbmcgbWF5XG4gKiBiZSBhcHBsaWVkIHRvIGNvbXB1dGF0aW9ucyB0aGF0IG1heSBmYWlsIHRvIHByb3ZpZGUgYSB2YWx1ZSwgZS5nLjpcbiAqIGBjb2xsZWN0aW9uLmZpbmQocHJlZGljYXRlKWAgY2FuIHNhZmVseSByZXR1cm4gYSBgTWF5YmUoYSlgIGluc3RhbmNlLFxuICogZXZlbiBpZiB0aGUgY29sbGVjdGlvbiBjb250YWlucyBudWxsYWJsZSB2YWx1ZXMuXG4gKlxuICogRnVydGhlcm1vcmUsIHRoZSB2YWx1ZXMgb2YgYE1heWJlKGEpYCBjYW4gYmUgY29tYmluZWQgYW5kIG1hbmlwdWxhdGVkXG4gKiBieSB1c2luZyB0aGUgZXhwcmVzc2l2ZSBtb25hZGljIG9wZXJhdGlvbnMuIFRoaXMgYWxsb3dzIHNhZmVseVxuICogc2VxdWVuY2luZyBvcGVyYXRpb25zIHRoYXQgbWF5IGZhaWwsIGFuZCBzYWZlbHkgY29tcG9zaW5nIHZhbHVlcyB0aGF0XG4gKiB5b3UgZG9uJ3Qga25vdyB3aGV0aGVyIHRoZXkncmUgcHJlc2VudCBvciBub3QsIGZhaWxpbmcgZWFybHlcbiAqIChyZXR1cm5pbmcgYSBgTm90aGluZ2ApIGlmIGFueSBvZiB0aGUgb3BlcmF0aW9ucyBmYWlsLlxuICpcbiAqIElmIG9uZSB3YW50cyB0byBzdG9yZSBhZGRpdGlvbmFsIGluZm9ybWF0aW9uIGFib3V0IGZhaWx1cmVzLCB0aGVcbiAqIFtFaXRoZXJdW10gYW5kIFtWYWxpZGF0aW9uXVtdIHN0cnVjdHVyZXMgcHJvdmlkZSBzdWNoIGEgY2FwYWJpbGl0eSwgYW5kXG4gKiBzaG91bGQgYmUgdXNlZCBpbnN0ZWFkIG9mIHRoZSBgTWF5YmUoYSlgIHN0cnVjdHVyZS5cbiAqXG4gKiBbRWl0aGVyXTogaHR0cHM6Ly9naXRodWIuY29tL2ZvbGt0YWxlL2RhdGEuZWl0aGVyXG4gKiBbVmFsaWRhdGlvbl06IGh0dHBzOi8vZ2l0aHViLmNvbS9mb2xrdGFsZS9kYXRhLnZhbGlkYXRpb25cbiAqXG4gKlxuICogQGNsYXNzXG4gKi9cbmZ1bmN0aW9uIE1heWJlKCkge31cblxuLy8gVGhlIGNhc2UgZm9yIHN1Y2Nlc3NmdWwgdmFsdWVzXG5KdXN0LnByb3RvdHlwZSA9IGNsb25lKE1heWJlLnByb3RvdHlwZSlcbmZ1bmN0aW9uIEp1c3QoYSl7XG4gIHRoaXMudmFsdWUgPSBhXG59XG5cbi8vIFRoZSBjYXNlIGZvciBmYWlsdXJlIHZhbHVlc1xuTm90aGluZy5wcm90b3R5cGUgPSBjbG9uZShNYXliZS5wcm90b3R5cGUpXG5mdW5jdGlvbiBOb3RoaW5nKCl7fVxuXG5cbi8vIC0tIENvbnN0cnVjdG9ycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIENvbnN0cnVjdHMgYSBuZXcgYE1heWJlW86xXWAgc3RydWN0dXJlIHdpdGggYW4gYWJzZW50IHZhbHVlLiBDb21tb25seSB1c2VkXG4gKiB0byByZXByZXNlbnQgYSBmYWlsdXJlLlxuICpcbiAqIEBzdW1tYXJ5IFZvaWQg4oaSIE1heWJlW86xXVxuICovXG5NYXliZS5Ob3RoaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgTm90aGluZ1xufVxuTWF5YmUucHJvdG90eXBlLk5vdGhpbmcgPSBNYXliZS5Ob3RoaW5nXG5cbi8qKlxuICogQ29uc3RydWN0cyBhIG5ldyBgTWF5YmVbzrFdYCBzdHJ1Y3R1cmUgdGhhdCBob2xkcyB0aGUgc2luZ2xlIHZhbHVlXG4gKiBgzrFgLiBDb21tb25seSB1c2VkIHRvIHJlcHJlc2VudCBhIHN1Y2Nlc3MuXG4gKlxuICogYM6xYCBjYW4gYmUgYW55IHZhbHVlLCBpbmNsdWRpbmcgYG51bGxgLCBgdW5kZWZpbmVkYCBvciBhbm90aGVyXG4gKiBgTWF5YmVbzrFdYCBzdHJ1Y3R1cmUuXG4gKlxuICogQHN1bW1hcnkgzrEg4oaSIE1heWJlW86xXVxuICovXG5NYXliZS5KdXN0ID0gZnVuY3Rpb24oYSkge1xuICByZXR1cm4gbmV3IEp1c3QoYSlcbn1cbk1heWJlLnByb3RvdHlwZS5KdXN0ID0gTWF5YmUuSnVzdFxuXG5cbi8vIC0tIENvbnZlcnNpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIENvbnN0cnVjdHMgYSBuZXcgYE1heWJlW86xXWAgc3RydWN0dXJlIGZyb20gYSBudWxsYWJsZSB0eXBlLlxuICpcbiAqIElmIHRoZSB2YWx1ZSBpcyBlaXRoZXIgYG51bGxgIG9yIGB1bmRlZmluZWRgLCB0aGlzIGZ1bmN0aW9uIHJldHVybnMgYVxuICogYE5vdGhpbmdgLCBvdGhlcndpc2UgdGhlIHZhbHVlIGlzIHdyYXBwZWQgaW4gYSBgSnVzdCjOsSlgLlxuICpcbiAqIEBzdW1tYXJ5IM6xIOKGkiBNYXliZVvOsV1cbiAqL1xuTWF5YmUuZnJvbU51bGxhYmxlID0gZnVuY3Rpb24oYSkge1xuICByZXR1cm4gYSAhPSBudWxsPyAgICAgICBuZXcgSnVzdChhKVxuICA6ICAgICAgLyogb3RoZXJ3aXNlICovICBuZXcgTm90aGluZ1xufVxuTWF5YmUucHJvdG90eXBlLmZyb21OdWxsYWJsZSA9IE1heWJlLmZyb21OdWxsYWJsZVxuXG4vKipcbiAqIENvbnN0cnVjdHMgYSBuZXcgYE1heWJlW86yXWAgc3RydWN0dXJlIGZyb20gYW4gYEVpdGhlclvOsSwgzrJdYCB0eXBlLlxuICpcbiAqIFRoZSBsZWZ0IHNpZGUgb2YgdGhlIGBFaXRoZXJgIGJlY29tZXMgYE5vdGhpbmdgLCBhbmQgdGhlIHJpZ2h0IHNpZGVcbiAqIGlzIHdyYXBwZWQgaW4gYSBgSnVzdCjOsilgLlxuICpcbiAqIEBzdW1tYXJ5IEVpdGhlclvOsSwgzrJdIOKGkiBNYXliZVvOsl1cbiAqL1xuTWF5YmUuZnJvbUVpdGhlciA9IGZ1bmN0aW9uKGEpIHtcbiAgcmV0dXJuIGEuZm9sZChNYXliZS5Ob3RoaW5nLCBNYXliZS5KdXN0KVxufVxuTWF5YmUucHJvdG90eXBlLmZyb21FaXRoZXIgPSBNYXliZS5mcm9tRWl0aGVyXG5cbi8qKlxuICogQ29uc3RydWN0cyBhIG5ldyBgTWF5YmVbzrJdYCBzdHJ1Y3R1cmUgZnJvbSBhIGBWYWxpZGF0aW9uW86xLCDOsl1gIHR5cGUuXG4gKlxuICogVGhlIGZhaWx1cmUgc2lkZSBvZiB0aGUgYFZhbGlkYXRpb25gIGJlY29tZXMgYE5vdGhpbmdgLCBhbmQgdGhlIHJpZ2h0XG4gKiBzaWRlIGlzIHdyYXBwZWQgaW4gYSBgSnVzdCjOsilgLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IFZhbGlkYXRpb25bzrEsIM6yXSDihpIgTWF5YmVbzrJdXG4gKi9cbk1heWJlLmZyb21WYWxpZGF0aW9uICAgICAgICAgICA9IE1heWJlLmZyb21FaXRoZXJcbk1heWJlLnByb3RvdHlwZS5mcm9tVmFsaWRhdGlvbiA9IE1heWJlLmZyb21FaXRoZXJcblxuXG4vLyAtLSBQcmVkaWNhdGVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBUcnVlIGlmIHRoZSBgTWF5YmVbzrFdYCBzdHJ1Y3R1cmUgY29udGFpbnMgYSBmYWlsdXJlIChpLmUuOiBgTm90aGluZ2ApLlxuICpcbiAqIEBzdW1tYXJ5IEJvb2xlYW5cbiAqL1xuTWF5YmUucHJvdG90eXBlLmlzTm90aGluZyAgID0gZmFsc2Vcbk5vdGhpbmcucHJvdG90eXBlLmlzTm90aGluZyA9IHRydWVcblxuXG4vKipcbiAqIFRydWUgaWYgdGhlIGBNYXliZVvOsV1gIHN0cnVjdHVyZSBjb250YWlucyBhIHNpbmdsZSB2YWx1ZSAoaS5lLjogYEp1c3QozrEpYCkuXG4gKlxuICogQHN1bW1hcnkgQm9vbGVhblxuICovXG5NYXliZS5wcm90b3R5cGUuaXNKdXN0ID0gZmFsc2Vcbkp1c3QucHJvdG90eXBlLmlzSnVzdCAgPSB0cnVlXG5cblxuLy8gLS0gQXBwbGljYXRpdmUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBgTWF5YmVbzrFdYCBzdHJ1Y3R1cmUgaG9sZGluZyB0aGUgc2luZ2xlIHZhbHVlIGDOsWAuXG4gKlxuICogYM6xYCBjYW4gYmUgYW55IHZhbHVlLCBpbmNsdWRpbmcgYG51bGxgLCBgdW5kZWZpbmVkYCwgb3IgYW5vdGhlclxuICogYE1heWJlW86xXWAgc3RydWN0dXJlLlxuICpcbiAqIEBzdW1tYXJ5IM6xIOKGkiBNYXliZVvOsV1cbiAqL1xuTWF5YmUub2YgPSBmdW5jdGlvbihhKSB7XG4gIHJldHVybiBuZXcgSnVzdChhKVxufVxuTWF5YmUucHJvdG90eXBlLm9mID0gTWF5YmUub2ZcblxuXG4vKipcbiAqIEFwcGxpZXMgdGhlIGZ1bmN0aW9uIGluc2lkZSB0aGUgYE1heWJlW86xXWAgc3RydWN0dXJlIHRvIGFub3RoZXJcbiAqIGFwcGxpY2F0aXZlIHR5cGUuXG4gKlxuICogVGhlIGBNYXliZVvOsV1gIHN0cnVjdHVyZSBzaG91bGQgY29udGFpbiBhIGZ1bmN0aW9uIHZhbHVlLCBvdGhlcndpc2UgYVxuICogYFR5cGVFcnJvcmAgaXMgdGhyb3duLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IChATWF5YmVbzrEg4oaSIM6yXSwgZjpBcHBsaWNhdGl2ZVtfXSkgPT4gZlvOsV0g4oaSIGZbzrJdXG4gKi9cbk1heWJlLnByb3RvdHlwZS5hcCA9IHVuaW1wbGVtZW50ZWRcblxuTm90aGluZy5wcm90b3R5cGUuYXAgPSBub29wXG5cbkp1c3QucHJvdG90eXBlLmFwID0gZnVuY3Rpb24oYikge1xuICByZXR1cm4gYi5tYXAodGhpcy52YWx1ZSlcbn1cblxuXG5cblxuLy8gLS0gRnVuY3RvciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogVHJhbnNmb3JtcyB0aGUgdmFsdWUgb2YgdGhlIGBNYXliZVvOsV1gIHN0cnVjdHVyZSB1c2luZyBhIHJlZ3VsYXIgdW5hcnlcbiAqIGZ1bmN0aW9uLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IEBNYXliZVvOsV0gPT4gKM6xIOKGkiDOsikg4oaSIE1heWJlW86yXVxuICovXG5NYXliZS5wcm90b3R5cGUubWFwICAgPSB1bmltcGxlbWVudGVkXG5Ob3RoaW5nLnByb3RvdHlwZS5tYXAgPSBub29wXG5cbkp1c3QucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uKGYpIHtcbiAgcmV0dXJuIHRoaXMub2YoZih0aGlzLnZhbHVlKSlcbn1cblxuXG4vLyAtLSBDaGFpbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBUcmFuc2Zvcm1zIHRoZSB2YWx1ZSBvZiB0aGUgYE1heWJlW86xXWAgc3RydWN0dXJlIHVzaW5nIGFuIHVuYXJ5IGZ1bmN0aW9uXG4gKiB0byBtb25hZHMuXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgKEBNYXliZVvOsV0sIG06TW9uYWRbX10pID0+ICjOsSDihpIgbVvOsl0pIOKGkiBtW86yXVxuICovXG5NYXliZS5wcm90b3R5cGUuY2hhaW4gICA9IHVuaW1wbGVtZW50ZWRcbk5vdGhpbmcucHJvdG90eXBlLmNoYWluID0gbm9vcFxuXG5KdXN0LnByb3RvdHlwZS5jaGFpbiA9IGZ1bmN0aW9uKGYpIHtcbiAgcmV0dXJuIGYodGhpcy52YWx1ZSlcbn1cblxuXG4vLyAtLSBTaG93IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBSZXR1cm5zIGEgdGV4dHVhbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgYE1heWJlW86xXWAgc3RydWN0dXJlLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IEBNYXliZVvOsV0gPT4gVm9pZCDihpIgU3RyaW5nXG4gKi9cbk1heWJlLnByb3RvdHlwZS50b1N0cmluZyA9IHVuaW1wbGVtZW50ZWRcblxuTm90aGluZy5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdNYXliZS5Ob3RoaW5nJ1xufVxuXG5KdXN0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ01heWJlLkp1c3QoJyArIHRoaXMudmFsdWUgKyAnKSdcbn1cblxuXG4vLyAtLSBFcSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBUZXN0cyBpZiBhIGBNYXliZVvOsV1gIHN0cnVjdHVyZSBpcyBlcXVhbCB0byBhbm90aGVyIGBNYXliZVvOsV1gIHN0cnVjdHVyZS5cbiAqXG4gKiBAbWV0aG9kXG4gKiBAc3VtbWFyeSBATWF5YmVbzrFdID0+IE1heWJlW86xXSDihpIgQm9vbGVhblxuICovXG5NYXliZS5wcm90b3R5cGUuaXNFcXVhbCA9IHVuaW1wbGVtZW50ZWRcblxuTm90aGluZy5wcm90b3R5cGUuaXNFcXVhbCA9IGZ1bmN0aW9uKGIpIHtcbiAgcmV0dXJuIGIuaXNOb3RoaW5nXG59XG5cbkp1c3QucHJvdG90eXBlLmlzRXF1YWwgPSBmdW5jdGlvbihiKSB7XG4gIHJldHVybiBiLmlzSnVzdFxuICAmJiAgICAgYi52YWx1ZSA9PT0gdGhpcy52YWx1ZVxufVxuXG5cbi8vIC0tIEV4dHJhY3RpbmcgYW5kIHJlY292ZXJpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIEV4dHJhY3RzIHRoZSB2YWx1ZSBvdXQgb2YgdGhlIGBNYXliZVvOsV1gIHN0cnVjdHVyZSwgaWYgaXRcbiAqIGV4aXN0cy4gT3RoZXJ3aXNlIHRocm93cyBhIGBUeXBlRXJyb3JgLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IEBNYXliZVvOsV0gPT4gVm9pZCDihpIgYSwgICAgICA6OiBwYXJ0aWFsLCB0aHJvd3NcbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpsaWIvbWF5YmV+TWF5YmUjZ2V0T3JFbHNlfSDigJQgQSBnZXR0ZXIgdGhhdCBjYW4gaGFuZGxlIGZhaWx1cmVzXG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9IGlmIHRoZSBzdHJ1Y3R1cmUgaGFzIG5vIHZhbHVlIChgTm90aGluZ2ApLlxuICovXG5NYXliZS5wcm90b3R5cGUuZ2V0ID0gdW5pbXBsZW1lbnRlZFxuXG5Ob3RoaW5nLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbigpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbid0IGV4dHJhY3QgdGhlIHZhbHVlIG9mIGEgTm90aGluZy5cIilcbn1cblxuSnVzdC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnZhbHVlXG59XG5cblxuLyoqXG4gKiBFeHRyYWN0cyB0aGUgdmFsdWUgb3V0IG9mIHRoZSBgTWF5YmVbzrFdYCBzdHJ1Y3R1cmUuIElmIHRoZXJlIGlzIG5vIHZhbHVlLFxuICogcmV0dXJucyB0aGUgZ2l2ZW4gZGVmYXVsdC5cbiAqXG4gKiBAbWV0aG9kXG4gKiBAc3VtbWFyeSBATWF5YmVbzrFdID0+IM6xIOKGkiDOsVxuICovXG5NYXliZS5wcm90b3R5cGUuZ2V0T3JFbHNlID0gdW5pbXBsZW1lbnRlZFxuXG5Ob3RoaW5nLnByb3RvdHlwZS5nZXRPckVsc2UgPSBmdW5jdGlvbihhKSB7XG4gIHJldHVybiBhXG59XG5cbkp1c3QucHJvdG90eXBlLmdldE9yRWxzZSA9IGZ1bmN0aW9uKF8pIHtcbiAgcmV0dXJuIHRoaXMudmFsdWVcbn1cblxuXG4vKipcbiAqIFRyYW5zZm9ybXMgYSBmYWlsdXJlIGludG8gYSBuZXcgYE1heWJlW86xXWAgc3RydWN0dXJlLiBEb2VzIG5vdGhpbmcgaWYgdGhlXG4gKiBzdHJ1Y3R1cmUgYWxyZWFkeSBjb250YWlucyBhIHZhbHVlLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IEBNYXliZVvOsV0gPT4gKFZvaWQg4oaSIE1heWJlW86xXSkg4oaSIE1heWJlW86xXVxuICovXG5NYXliZS5wcm90b3R5cGUub3JFbHNlID0gdW5pbXBsZW1lbnRlZFxuXG5Ob3RoaW5nLnByb3RvdHlwZS5vckVsc2UgPSBmdW5jdGlvbihmKSB7XG4gIHJldHVybiBmKClcbn1cblxuSnVzdC5wcm90b3R5cGUub3JFbHNlID0gZnVuY3Rpb24oXykge1xuICByZXR1cm4gdGhpc1xufVxuXG5cbi8qKlxuICogQ2F0YW1vcnBoaXNtLlxuICogXG4gKiBAbWV0aG9kXG4gKiBAc3VtbWFyeSBATWF5YmVbzrFdID0+IHsgTm90aGluZzogVm9pZCDihpIgzrIsIEp1c3Q6IM6xIOKGkiDOsiB9IOKGkiDOslxuICovXG5NYXliZS5wcm90b3R5cGUuY2F0YSA9IHVuaW1wbGVtZW50ZWRcblxuTm90aGluZy5wcm90b3R5cGUuY2F0YSA9IGZ1bmN0aW9uKHBhdHRlcm4pIHtcbiAgcmV0dXJuIHBhdHRlcm4uTm90aGluZygpXG59XG5cbkp1c3QucHJvdG90eXBlLmNhdGEgPSBmdW5jdGlvbihwYXR0ZXJuKSB7XG4gIHJldHVybiBwYXR0ZXJuLkp1c3QodGhpcy52YWx1ZSk7XG59XG5cblxuLyoqXG4gKiBKU09OIHNlcmlhbGlzYXRpb25cbiAqXG4gKiBAbWV0aG9kXG4gKiBAc3VtbWFyeSBATWF5YmVbzrFdID0+IFZvaWQg4oaSIE9iamVjdFxuICovXG5NYXliZS5wcm90b3R5cGUudG9KU09OID0gdW5pbXBsZW1lbnRlZFxuXG5Ob3RoaW5nLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHsgJyN0eXBlJzogJ2ZvbGt0YWxlOk1heWJlLk5vdGhpbmcnIH1cbn1cblxuSnVzdC5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7ICcjdHlwZSc6ICdmb2xrdGFsZTpNYXliZS5KdXN0J1xuICAgICAgICAgLCB2YWx1ZTogdGhpcy52YWx1ZSB9XG59XG4iLCIvLyBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNCBRdWlsZHJlZW4gTW90dGEgPHF1aWxkcmVlbkBnbWFpbC5jb20+XG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbi8vIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzXG4vLyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4vLyBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuLy8gcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbi8vIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4vLyBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuLy8gaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbi8vIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbi8vIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcbi8vIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cbi8vIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuLy8gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9tYXliZScpIiwiaW1wb3J0IHsgY3VycnksIHBpcGUsIHByb3AsIG92ZXIsIGFwcGVuZCB9IGZyb20gXCJyYW1kYVwiO1xuaW1wb3J0IHsgaGlkZUNvbmZpZ3MsIFN0YXRlTGVuc2VzLCBwdXNoSGlzdG9yeVN0YXRlIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCBNYXliZSBmcm9tIFwiZGF0YS5tYXliZVwiO1xuXG4vLyBTdGF0ZSAtPiBPYmplY3QgLT4gU3RhdGVcbmNvbnN0IGhpc3RvcnlTdGF0ZVdpdGhOZXdGaWVsZCA9IGN1cnJ5KChzdGF0ZSwgbmV3RmllbGQpID0+IHBpcGUoXG4gIGhpZGVDb25maWdzLFxuICBvdmVyKFN0YXRlTGVuc2VzLmZpZWxkc1N0YXRlLCBhcHBlbmQobmV3RmllbGQpKVxuKShzdGF0ZSkpO1xuXG5leHBvcnQgZGVmYXVsdCAoc3RhdGUsIHsgY3JlYXRlZEZpZWxkU3RhdGUgfSkgPT5cbiAgTWF5YmUuZnJvbU51bGxhYmxlKGNyZWF0ZWRGaWVsZFN0YXRlKVxuICAubWFwKGhpc3RvcnlTdGF0ZVdpdGhOZXdGaWVsZChzdGF0ZSkpXG4gIC5tYXAocHJvcChcImZpZWxkc1N0YXRlXCIpKVxuICAubWFwKHB1c2hIaXN0b3J5U3RhdGUoc3RhdGUpKVxuICAuZ2V0T3JFbHNlKHN0YXRlKTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5ldy1jYXAgKi9cbmltcG9ydCB7IGN1cnJ5IH0gZnJvbSBcInJhbWRhXCI7XG5pbXBvcnQgTWF5YmUgZnJvbSBcImRhdGEubWF5YmVcIjtcbmltcG9ydCBJbW11dGFibGUgZnJvbSBcInNlYW1sZXNzLWltbXV0YWJsZVwiO1xuaW1wb3J0IHsgcHVzaEhpc3RvcnlTdGF0ZSB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmNvbnN0IHRvZ2dsZUNvbmZpZyA9IGZpZWxkU3RhdGUgPT5cbiAgSW1tdXRhYmxlKGZpZWxkU3RhdGUpLnNldChcImNvbmZpZ1Nob3dpbmdcIiwgIWZpZWxkU3RhdGUuY29uZmlnU2hvd2luZyk7XG5cbmNvbnN0IHJlcGxhY2VGaWVsZFN0YXRlID0gY3VycnkoKHN0YXRlLCBmaWVsZFN0YXRlKSA9PlxuICBzdGF0ZVxuICAgIC5maWVsZHNTdGF0ZVxuICAgIC5tYXAoYUZpZWxkID0+IGFGaWVsZC5pZCA9PT0gZmllbGRTdGF0ZS5pZFxuICAgICAgPyBmaWVsZFN0YXRlXG4gICAgICA6IGFGaWVsZFxuICAgIClcbik7XG5cbmV4cG9ydCBkZWZhdWx0IChzdGF0ZSwgeyBmaWVsZFN0YXRlIH0pID0+XG4gIE1heWJlLmZyb21OdWxsYWJsZShmaWVsZFN0YXRlKVxuICAubWFwKHRvZ2dsZUNvbmZpZylcbiAgLm1hcChyZXBsYWNlRmllbGRTdGF0ZShzdGF0ZSkpXG4gIC5tYXAocHVzaEhpc3RvcnlTdGF0ZShzdGF0ZSkpXG4gIC5nZXRPckVsc2Uoc3RhdGUpO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tbmVzdGVkLXRlcm5hcnkgKi9cbmltcG9ydCBhc3NlcnQgZnJvbSBcImZsLWFzc2VydFwiO1xuaW1wb3J0IHVuZG8gZnJvbSBcIi4vdW5kb1wiO1xuaW1wb3J0IGltcG9ydFN0YXRlIGZyb20gXCIuL2ltcG9ydFN0YXRlXCI7XG5pbXBvcnQgY3JlYXRlRmllbGQgZnJvbSBcIi4vY3JlYXRlRmllbGRcIjtcbmltcG9ydCBmaWVsZENyZWF0ZWQgZnJvbSBcIi4vZmllbGRDcmVhdGVkXCI7XG5pbXBvcnQgdG9nZ2xlQ29uZmlnIGZyb20gXCIuL2ZpZWxkLnRvZ2dsZUNvbmZpZ1wiO1xuXG5jb25zdCBhY3Rpb25IYW5kbGVycyA9IHtcbiAgdW5kbyxcbiAgaW1wb3J0U3RhdGUsXG4gIGNyZWF0ZUZpZWxkLFxuICBmaWVsZENyZWF0ZWQsXG4gIHRvZ2dsZUNvbmZpZyxcbn07XG5cbmNvbnN0IGlzRXhwZWN0ZWRBY3Rpb24gPSBhID0+IGEgJiYgYS50eXBlICYmIGFjdGlvbkhhbmRsZXJzW2EudHlwZV07XG5jb25zdCBpc1JlZHV4QWN0aW9uID0gYSA9PiBhICYmIGEudHlwZSAmJiBhLnR5cGUuaW5jbHVkZXMoXCJAQHJlZHV4XCIpO1xuXG5cbmNvbnN0IHVwZGF0ZSA9IChzdGF0ZSwgYWN0aW9uKSA9PlxuICBpc0V4cGVjdGVkQWN0aW9uKGFjdGlvbilcbiAgICA/IGFjdGlvbkhhbmRsZXJzW2FjdGlvbi50eXBlXShzdGF0ZSwgYWN0aW9uKVxuICA6IGlzUmVkdXhBY3Rpb24oYWN0aW9uKVxuICAgID8gc3RhdGVcbiAgOiBhc3NlcnQoZmFsc2UsIGBJbnZhbGlkIGFjdGlvbiB0eXBlOiAke2FjdGlvbi50eXBlfWApO1xuXG5leHBvcnQgZGVmYXVsdCB1cGRhdGU7XG4iLCIvKiBlc2xpbnQtZW52IGphc21pbmUgKi9cblxuaW1wb3J0IHsgdW5kbyBhcyB1bmRvQWN0aW9uIH0gZnJvbSBcIi4uLy4uL2pzL0FjdGlvbnNcIjtcbmltcG9ydCB1cGRhdGUgZnJvbSBcIi4uLy4uL2pzL1VwZGF0ZVwiO1xuXG5jb25zdCBjdXJyZW50RmllbGRzU3RhdGUgPSBbXCJjdXJyZW50XCJdO1xuY29uc3Qgb2xkRmllbGRzU3RhdGUgPSBbXCJvbGRcIl07XG5jb25zdCBtb2NrU3RhdGUgPSB7XG4gIGZpZWxkVHlwZXM6IFtdLFxuICBmaWVsZHNTdGF0ZTogY3VycmVudEZpZWxkc1N0YXRlLFxuICBmaWVsZHNTdGF0ZUhpc3Rvcnk6IFtvbGRGaWVsZHNTdGF0ZV0sXG59O1xuXG5jb25zdCBlbXB0eU1vY2tTdGF0ZSA9IHtcbiAgZmllbGRUeXBlczogW10sXG4gIGZpZWxkc1N0YXRlOiBbXSxcbiAgZmllbGRzU3RhdGVIaXN0b3J5OiBbXSxcbn07XG5cbmNvbnN0IGVtcHR5SGlzdG9yeU1vY2tTdGF0ZSA9IHtcbiAgZmllbGRUeXBlczogW10sXG4gIGZpZWxkc1N0YXRlOiBjdXJyZW50RmllbGRzU3RhdGUsXG4gIGZpZWxkc1N0YXRlSGlzdG9yeTogW10sXG59O1xuXG5kZXNjcmliZShcIlVwZGF0ZS51bmRvXCIsICgpID0+IHtcbiAgaXQoXCJyZW1vdmVzIGZpcnN0IG9sZCBzdGF0ZSBmcm9tIGhpc3RvcnlcIiwgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGlmaWVkU3RhdGUgPSB1cGRhdGUobW9ja1N0YXRlLCB1bmRvQWN0aW9uKCkpO1xuICAgIGV4cGVjdChtb2RpZmllZFN0YXRlLmZpZWxkc1N0YXRlSGlzdG9yeS5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gIH0pO1xuXG4gIGl0KFwic2V0cyBmaXJzdCBvbGQgc3RhdGUgYXMgY3VycmVudCBzdGF0ZVwiLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kaWZpZWRTdGF0ZSA9IHVwZGF0ZShtb2NrU3RhdGUsIHVuZG9BY3Rpb24oKSk7XG4gICAgZXhwZWN0KG1vZGlmaWVkU3RhdGUuZmllbGRzU3RhdGUpLnRvRXF1YWwob2xkRmllbGRzU3RhdGUpO1xuICB9KTtcblxuICBpdChcImRvZXNuJ3QgbW9kaWZ5IHRoZSBzdGF0ZSBpZiB0aGVyZSBhcmVuJ3QgbW9yZSBoaXN0b3J5IHN0YXRlcyB0byB1bmRvXCIsICgpID0+IHtcbiAgICBjb25zdCBtb2RpZmllZFN0YXRlID0gdXBkYXRlKGVtcHR5TW9ja1N0YXRlLCB1bmRvQWN0aW9uKCkpO1xuICAgIGV4cGVjdChtb2RpZmllZFN0YXRlKS50b0VxdWFsKGVtcHR5TW9ja1N0YXRlKTtcbiAgfSk7XG5cbiAgaXQoXCJzZXQncyB0aGUgY3VycmVudCBzdGF0ZSB0byBlbXB0eSBpZiB0aGVyZSBhcmUgbm8gbW9yZSBoaXN0b3J5IHN0YXRlc1wiLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kaWZpZWRTdGF0ZSA9IHVwZGF0ZShlbXB0eUhpc3RvcnlNb2NrU3RhdGUsIHVuZG9BY3Rpb24oKSk7XG4gICAgZXhwZWN0KG1vZGlmaWVkU3RhdGUuZmllbGRzU3RhdGUubGVuZ3RoKS50b0VxdWFsKDApO1xuICB9KTtcbn0pO1xuIiwiLyogZXNsaW50LWVudiBqYXNtaW5lICovXG4vKiBlc2xpbnQtZGlzYWJsZSBxdW90ZS1wcm9wcyAqL1xuXG5pbXBvcnQgeyBpbXBvcnRTdGF0ZSB9IGZyb20gXCIuLi8uLi9qcy9BY3Rpb25zXCI7XG5pbXBvcnQgdXBkYXRlIGZyb20gXCIuLi8uLi9qcy9VcGRhdGVcIjtcblxuY29uc3QgdHlwZXNBcnJheSA9IFt7XG4gIFwiaW5mb1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiUmFkaW9CdXR0b25zXCIsXG4gIH0sXG59LCB7XG4gIFwiaW5mb1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiQ2hlY2tib3hlc1wiLFxuICB9LFxufSwge1xuICBcImluZm9cIjoge1xuICAgIFwidHlwZVwiOiBcIkRyb3Bkb3duXCIsXG4gIH0sXG59LCB7XG4gIFwiaW5mb1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiVGV4dEJveFwiLFxuICB9LFxufSwge1xuICBcImluZm9cIjoge1xuICAgIFwidHlwZVwiOiBcIkVtYWlsQm94XCIsXG4gIH0sXG59LCB7XG4gIFwiaW5mb1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiVGVsZXBob25lQm94XCIsXG4gIH0sXG59LCB7XG4gIFwiaW5mb1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiTnVtYmVyQm94XCIsXG4gIH0sXG59LCB7XG4gIFwiaW5mb1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiVGV4dEFyZWFcIixcbiAgfSxcbn0sIHtcbiAgXCJpbmZvXCI6IHtcbiAgICBcInR5cGVcIjogXCJEYXRlRmllbGRcIixcbiAgfSxcbn1dO1xuXG5jb25zdCBtb2NrQ3VycmVudFN0YXRlID0gW1wiYVwiLCBcImJcIl07XG5jb25zdCBtb2NrSGlzdG9yeSA9IFtdO1xuY29uc3QgbW9ja1N0YXRlID0ge1xuICBmaWVsZFR5cGVzOiB0eXBlc0FycmF5LFxuICBmaWVsZHNTdGF0ZTogbW9ja0N1cnJlbnRTdGF0ZSxcbiAgZmllbGRzU3RhdGVIaXN0b3J5OiBtb2NrSGlzdG9yeSxcbn07XG5cbmNvbnN0IG5ld1ZhbGlkU3RhdGUgPSBbe1xuICBcInR5cGVcIjogXCJDaGVja2JveGVzXCIsXG4gIFwiZGlzcGxheU5hbWVcIjogXCJDaGVja2JveGVzXCIsXG4gIFwiZ3JvdXBcIjogXCJPcHRpb25zIENvbXBvbmVudHNcIixcbiAgXCJodG1sSW5wdXRUeXBlXCI6IFwiY2hlY2tib3hcIixcbiAgXCJ0aXRsZVwiOiBcIkFkZCBhIHRpdGxlXCIsXG4gIFwib3B0aW9uc1wiOiBbe1xuICAgIFwiY2FwdGlvblwiOiBcIkluc2VydCBhbiBvcHRpb25cIixcbiAgfV0sXG4gIFwibmV3T3B0aW9uQ2FwdGlvblwiOiBcIlwiLFxufV07XG5cbmNvbnN0IG5ld0ludmFsaWRTdGF0ZSA9IFt7XG4gIFwidHlwZVwiOiBcIkludmFsaWQgdHlwZVwiLFxuICBcImRpc3BsYXlOYW1lXCI6IFwiQ2hlY2tib3hlc1wiLFxuICBcImdyb3VwXCI6IFwiT3B0aW9ucyBDb21wb25lbnRzXCIsXG4gIFwiaHRtbElucHV0VHlwZVwiOiBcImNoZWNrYm94XCIsXG4gIFwidGl0bGVcIjogXCJBZGQgYSB0aXRsZVwiLFxuICBcIm9wdGlvbnNcIjogW3tcbiAgICBcImNhcHRpb25cIjogXCJJbnNlcnQgYW4gb3B0aW9uXCIsXG4gIH1dLFxuICBcIm5ld09wdGlvbkNhcHRpb25cIjogXCJcIixcbn1dO1xuXG5kZXNjcmliZShcIlVwZGF0ZS5pbXBvcnRTdGF0ZVwiLCAoKSA9PiB7XG4gIGl0KFwiUmV0dXJucyBhbiB1bmNoYW5nZWQgYXJyYXkgaWYgdGhlIG5ldyBzdGF0ZSBpcyBpbnZhbGlkXCIsICgpID0+IHtcbiAgICBleHBlY3QodXBkYXRlKG1vY2tTdGF0ZSwgaW1wb3J0U3RhdGUoe30pKSkudG9FcXVhbChtb2NrU3RhdGUpO1xuICAgIGV4cGVjdCh1cGRhdGUobW9ja1N0YXRlLCBpbXBvcnRTdGF0ZShudWxsKSkpLnRvRXF1YWwobW9ja1N0YXRlKTtcbiAgfSk7XG5cbiAgaXQoXCJSZXR1cm5zIGFuIHVuY2hhbmdlZCBhcnJheSBpZiB0aGUgYSBmaWVsZCdzIHR5cGUgaXMgbm90IGluIGZpZWxkVHlwZXNcIiwgKCkgPT4ge1xuICAgIGV4cGVjdCh1cGRhdGUobW9ja1N0YXRlLCBpbXBvcnRTdGF0ZShuZXdJbnZhbGlkU3RhdGUpKSkudG9FcXVhbChtb2NrU3RhdGUpO1xuICB9KTtcblxuICBpdChcIlNlbmRzIHRoZSBsYXN0IGN1cnJlbnQgc3RhdGUgdG8gdGhlIGhpc3RvcnlcIiwgKCkgPT4ge1xuICAgIGNvbnN0IHVwZGF0ZWQgPSB1cGRhdGUobW9ja1N0YXRlLCBpbXBvcnRTdGF0ZShuZXdWYWxpZFN0YXRlKSk7XG4gICAgZXhwZWN0KHVwZGF0ZWQuZmllbGRzU3RhdGVIaXN0b3J5WzBdLnRvU3RyaW5nKCkpLnRvRXF1YWwobW9ja0N1cnJlbnRTdGF0ZS50b1N0cmluZygpKTtcbiAgICBleHBlY3QodXBkYXRlZC5maWVsZHNTdGF0ZUhpc3RvcnkubGVuZ3RoKS50b0VxdWFsKG1vY2tIaXN0b3J5Lmxlbmd0aCArIDEpO1xuICB9KTtcblxuICBpdChcIlNldHMgdGhlIG5ldyBzdGF0ZSBhcyBjdXJyZW50XCIsICgpID0+IHtcbiAgICBjb25zdCB1cGRhdGVkID0gdXBkYXRlKG1vY2tTdGF0ZSwgaW1wb3J0U3RhdGUobmV3VmFsaWRTdGF0ZSkpO1xuICAgIGV4cGVjdCh1cGRhdGVkLmZpZWxkc1N0YXRlWzBdLnR5cGUpLnRvRXF1YWwobmV3VmFsaWRTdGF0ZVswXS50eXBlKTtcbiAgICBleHBlY3QodXBkYXRlZC5maWVsZHNTdGF0ZVswXS50eXBlKS5ub3QudG9FcXVhbCh1bmRlZmluZWQpO1xuICAgIGV4cGVjdCh1cGRhdGVkLmZpZWxkc1N0YXRlWzBdLmRpc3BsYXlOYW1lKS50b0VxdWFsKG5ld1ZhbGlkU3RhdGVbMF0uZGlzcGxheU5hbWUpO1xuICAgIGV4cGVjdCh1cGRhdGVkLmZpZWxkc1N0YXRlWzBdLmRpc3BsYXlOYW1lKS5ub3QudG9FcXVhbCh1bmRlZmluZWQpO1xuICAgIGV4cGVjdCh1cGRhdGVkLmZpZWxkc1N0YXRlWzBdLmdyb3VwKS50b0VxdWFsKG5ld1ZhbGlkU3RhdGVbMF0uZ3JvdXApO1xuICAgIGV4cGVjdCh1cGRhdGVkLmZpZWxkc1N0YXRlWzBdLmdyb3VwKS5ub3QudG9FcXVhbCh1bmRlZmluZWQpO1xuICB9KTtcbn0pO1xuIiwiLyogZXNsaW50LWVudiBqYXNtaW5lICovXG4vKiBlc2xpbnQtZGlzYWJsZSBxdW90ZS1wcm9wcyAqL1xuXG5pbXBvcnQgeyBjcmVhdGVGaWVsZCB9IGZyb20gXCIuLi8uLi9qcy9BY3Rpb25zXCI7XG5pbXBvcnQgdXBkYXRlIGZyb20gXCIuLi8uLi9qcy9VcGRhdGVcIjtcblxuY29uc3QgcHJvbWlzZVR5cGVJbnN0YW5jZSA9IHsgdHlwZTogXCJwcm9taXNlLWluc3RhbmNlXCIgfTtcbmNvbnN0IHByb21pc2VUeXBlID0ge1xuICBpbmZvOiB7IHR5cGU6IFwiUHJvbWlzZVR5cGVcIiB9LFxuICBpbml0aWFsU3RhdGU6ICgpID0+IFByb21pc2UucmVzb2x2ZShwcm9taXNlVHlwZUluc3RhbmNlKSxcbn07XG5cbmNvbnN0IHN5bmNUeXBlSW5zdGFuY2UgPSB7IHR5cGU6IFwic3luYy1pbnN0YW5jZVwiIH07XG5jb25zdCBzeW5jVHlwZSA9IHtcbiAgaW5mbzogeyB0eXBlOiBcIlN5bmNUeXBlXCIgfSxcbiAgaW5pdGlhbFN0YXRlOiAoKSA9PiBzeW5jVHlwZUluc3RhbmNlLFxufTtcblxuY29uc3QgdHlwZXNBcnJheSA9IFtwcm9taXNlVHlwZSwgc3luY1R5cGVdO1xuY29uc3QgbW9ja0N1cnJlbnRTdGF0ZSA9IFtcImFcIiwgXCJiXCJdO1xuY29uc3QgbW9ja0hpc3RvcnkgPSBbXTtcbmNvbnN0IG1vY2tTdGF0ZSA9IHtcbiAgZmllbGRUeXBlczogdHlwZXNBcnJheSxcbiAgZmllbGRzU3RhdGU6IG1vY2tDdXJyZW50U3RhdGUsXG4gIGZpZWxkc1N0YXRlSGlzdG9yeTogbW9ja0hpc3RvcnksXG59O1xuXG5kZXNjcmliZShcIlVwZGF0ZS5jcmVhdGVGaWVsZFwiLCAoKSA9PiB7XG4gIGl0KFwiY3JlYXRlcyBmaWVsZHMgYXN5bmNocm9ub3VzbHlcIiwgZG9uZSA9PiB7XG4gICAgY29uc3QgYXN5bmNEaXNwYXRjaCA9IHYgPT4ge1xuICAgICAgZXhwZWN0KHYpLm5vdC50b0VxdWFsKHVuZGVmaW5lZCk7XG4gICAgICBkb25lKCk7XG4gICAgfTtcblxuICAgIGNvbnN0IGFzeW5jQWNpb24gPSBPYmplY3QuYXNzaWduKFxuICAgICAgeyBhc3luY0Rpc3BhdGNoIH0sXG4gICAgICBjcmVhdGVGaWVsZChzeW5jVHlwZS5pbmZvLnR5cGUpXG4gICAgKTtcblxuICAgIHVwZGF0ZShtb2NrU3RhdGUsIGFzeW5jQWNpb24pO1xuICB9KTtcblxuICBpdChcInJldHVybnMgYSAnZmllbGRDcmVhdGVkJyBhY3Rpb24gd2hlbiBmaWVsZCBpcyBjcmVhdGVkXCIsIGRvbmUgPT4ge1xuICAgIGNvbnN0IGFzeW5jRGlzcGF0Y2ggPSBhY3Rpb24gPT4ge1xuICAgICAgZXhwZWN0KGFjdGlvbi50eXBlKS50b0VxdWFsKFwiZmllbGRDcmVhdGVkXCIpO1xuICAgICAgZG9uZSgpO1xuICAgIH07XG5cbiAgICBjb25zdCBhc3luY0FjaW9uID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHsgYXN5bmNEaXNwYXRjaCB9LFxuICAgICAgY3JlYXRlRmllbGQoc3luY1R5cGUuaW5mby50eXBlKVxuICAgICk7XG5cbiAgICB1cGRhdGUobW9ja1N0YXRlLCBhc3luY0FjaW9uKTtcbiAgfSk7XG5cbiAgaXQoXCJjcmVhdGVzIHR5cGVzIHdpdGggY29uc3RydWN0b3JzIHRoYXQgcmV0dXJuIGEgcGxhaW4gb2JqZWN0XCIsIGRvbmUgPT4ge1xuICAgIGNvbnN0IGFzeW5jRGlzcGF0Y2ggPSBhY3Rpb24gPT4ge1xuICAgICAgZXhwZWN0KGFjdGlvbi5jcmVhdGVkRmllbGRTdGF0ZSkubm90LnRvRXF1YWwodW5kZWZpbmVkKTtcbiAgICAgIGV4cGVjdChhY3Rpb24uY3JlYXRlZEZpZWxkU3RhdGUudHlwZSkudG9FcXVhbChzeW5jVHlwZUluc3RhbmNlLnR5cGUpO1xuICAgICAgZG9uZSgpO1xuICAgIH07XG5cbiAgICBjb25zdCBhc3luY0FjaW9uID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHsgYXN5bmNEaXNwYXRjaCB9LFxuICAgICAgY3JlYXRlRmllbGQoc3luY1R5cGUuaW5mby50eXBlKVxuICAgICk7XG5cbiAgICB1cGRhdGUobW9ja1N0YXRlLCBhc3luY0FjaW9uKTtcbiAgfSk7XG5cbiAgaXQoXCJjcmVhdGVzIHR5cGVzIHdpdGggY29uc3RydWN0b3JzIHRoYXQgcmV0dXJuIGEgcHJvbWlzZVwiLCBkb25lID0+IHtcbiAgICBjb25zdCBhc3luY0Rpc3BhdGNoID0gYWN0aW9uID0+IHtcbiAgICAgIGV4cGVjdChhY3Rpb24uY3JlYXRlZEZpZWxkU3RhdGUpLm5vdC50b0VxdWFsKHVuZGVmaW5lZCk7XG4gICAgICBleHBlY3QoYWN0aW9uLmNyZWF0ZWRGaWVsZFN0YXRlLnR5cGUpLnRvRXF1YWwocHJvbWlzZVR5cGVJbnN0YW5jZS50eXBlKTtcbiAgICAgIGRvbmUoKTtcbiAgICB9O1xuXG4gICAgY29uc3QgYXN5bmNBY2lvbiA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB7IGFzeW5jRGlzcGF0Y2ggfSxcbiAgICAgIGNyZWF0ZUZpZWxkKHByb21pc2VUeXBlLmluZm8udHlwZSlcbiAgICApO1xuXG4gICAgdXBkYXRlKG1vY2tTdGF0ZSwgYXN5bmNBY2lvbik7XG4gIH0pO1xuXG4gIGl0KFwiYWRkcyByZXF1aXJlZCBmaWVsZHMgdG8gaW5zdGFuY2VcIiwgZG9uZSA9PiB7XG4gICAgY29uc3QgYXN5bmNEaXNwYXRjaCA9IGFjdGlvbiA9PiB7XG4gICAgICBleHBlY3QoYWN0aW9uLmNyZWF0ZWRGaWVsZFN0YXRlLmlkKS5ub3QudG9FcXVhbCh1bmRlZmluZWQpO1xuICAgICAgZXhwZWN0KHR5cGVvZiBhY3Rpb24uY3JlYXRlZEZpZWxkU3RhdGUuY29uZmlnU2hvd2luZykudG9FcXVhbChcImJvb2xlYW5cIik7XG4gICAgICBkb25lKCk7XG4gICAgfTtcblxuICAgIGNvbnN0IGFzeW5jQWNpb24gPSBPYmplY3QuYXNzaWduKFxuICAgICAgeyBhc3luY0Rpc3BhdGNoIH0sXG4gICAgICBjcmVhdGVGaWVsZChwcm9taXNlVHlwZS5pbmZvLnR5cGUpXG4gICAgKTtcblxuICAgIHVwZGF0ZShtb2NrU3RhdGUsIGFzeW5jQWNpb24pO1xuICB9KTtcblxuICBpdChcImRvZXMgbm90IGNyZWF0ZSBhIGZpZWxkIGlmIHR5cGUgaXMgbm90IGluIG1vZGVsLmZpZWxkVHlwZXNcIiwgZG9uZSA9PiB7XG4gICAgY29uc3QgYXN5bmNEaXNwYXRjaCA9IGphc21pbmUuY3JlYXRlU3B5KFwiYXN5bmNEaXNwYXRjaFwiKTtcblxuICAgIGNvbnN0IGFzeW5jQWNpb24gPSBPYmplY3QuYXNzaWduKFxuICAgICAgeyBhc3luY0Rpc3BhdGNoIH0sXG4gICAgICBjcmVhdGVGaWVsZChcIm5vbi1leGlzdGluZy10eXBlXCIpXG4gICAgKTtcblxuICAgIHVwZGF0ZShtb2NrU3RhdGUsIGFzeW5jQWNpb24pO1xuXG4gICAgc2V0VGltZW91dChcbiAgICAgICgpID0+IHsgZXhwZWN0KGFzeW5jRGlzcGF0Y2gpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7IGRvbmUoKTsgfSxcbiAgICAgIDUwXG4gICAgKTtcbiAgfSk7XG59KTtcbiIsIi8qIGVzbGludC1lbnYgamFzbWluZSAqL1xuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxuaW1wb3J0IHsgZmllbGRDcmVhdGVkIH0gZnJvbSBcIi4uLy4uL2pzL0FjdGlvbnNcIjtcbmltcG9ydCB1cGRhdGUgZnJvbSBcIi4uLy4uL2pzL1VwZGF0ZVwiO1xuXG5jb25zdCBjcmVhdGVkRmllbGRTdGF0ZSA9IHsgdHlwZTogXCJmaWN0aXRpb3VzLWluc3RhbmNlXCIgfTtcbmNvbnN0IG1vY2tDdXJyZW50U3RhdGUgPSBbXCJhXCIsIFwiYlwiXTtcbmNvbnN0IG1vY2tIaXN0b3J5ID0gW107XG5jb25zdCBtb2NrU3RhdGUgPSB7XG4gIGZpZWxkVHlwZXM6IFt7IGluZm86IHsgdHlwZTogXCJmaWN0aXRpb3VzLWluc3RhbmNlXCIgfSB9XSxcbiAgZmllbGRzU3RhdGU6IG1vY2tDdXJyZW50U3RhdGUsXG4gIGZpZWxkc1N0YXRlSGlzdG9yeTogbW9ja0hpc3RvcnksXG59O1xuXG5jb25zdCBmaWVsZENyZWF0ZWRBY3Rpb24gPSBmaWVsZENyZWF0ZWQoY3JlYXRlZEZpZWxkU3RhdGUpO1xuY29uc3QgbmV3U3RhdGUgPSB1cGRhdGUobW9ja1N0YXRlLCBmaWVsZENyZWF0ZWRBY3Rpb24pO1xuXG5kZXNjcmliZShcIlVwZGF0ZS5maWVsZENyZWF0ZWRcIiwgKCkgPT4ge1xuICBpdChcIm91dHB1dHMgYSBmaWVsZCB3aXRoIHRoZSBuZXcgc3RhdGUgaW5jbHVkZWRcIiwgKCkgPT4ge1xuICAgIGV4cGVjdChuZXdTdGF0ZS5maWVsZHNTdGF0ZS5sZW5ndGgpLnRvRXF1YWwobW9ja1N0YXRlLmZpZWxkc1N0YXRlLmxlbmd0aCArIDEpO1xuICAgIGV4cGVjdChcbiAgICAgIG5ld1N0YXRlLmZpZWxkc1N0YXRlXG4gICAgICAuZmluZCh2ID0+IHYudHlwZSA9PT0gY3JlYXRlZEZpZWxkU3RhdGUudHlwZSlcbiAgICApLm5vdC50b0VxdWFsKHVuZGVmaW5lZCk7XG4gIH0pO1xuXG4gIGl0KFwic2VuZHMgdGhlIGN1cnJlbnQgc3RhdGUgdG8gaGlzdG9yeVwiLCAoKSA9PiB7XG4gICAgZXhwZWN0KG5ld1N0YXRlLmZpZWxkc1N0YXRlSGlzdG9yeVswXVswXSkudG9FcXVhbChtb2NrQ3VycmVudFN0YXRlWzBdKTtcbiAgICBleHBlY3QobmV3U3RhdGUuZmllbGRzU3RhdGVIaXN0b3J5WzBdWzFdKS50b0VxdWFsKG1vY2tDdXJyZW50U3RhdGVbMV0pO1xuICB9KTtcblxuICBpdChcIlJldHVybnMgdGhlIGN1cnJlbnQgc3RhdGUgaWYgbm8gbmV3IGZpZWxkIGlzIGdpdmVuIHRvIGl0XCIsICgpID0+IHtcbiAgICBjb25zdCBzYW1lU3RhdGUgPSB1cGRhdGUobW9ja1N0YXRlLCBmaWVsZENyZWF0ZWQobnVsbCkpO1xuICAgIGV4cGVjdChzYW1lU3RhdGUuZmllbGRUeXBlcy5sZW5ndGgpLnRvRXF1YWwobW9ja1N0YXRlLmZpZWxkVHlwZXMubGVuZ3RoKTtcbiAgICBleHBlY3Qoc2FtZVN0YXRlLmZpZWxkc1N0YXRlLmxlbmd0aCkudG9FcXVhbChtb2NrU3RhdGUuZmllbGRzU3RhdGUubGVuZ3RoKTtcbiAgICBleHBlY3Qoc2FtZVN0YXRlLmZpZWxkc1N0YXRlSGlzdG9yeS5sZW5ndGgpLnRvRXF1YWwobW9ja1N0YXRlLmZpZWxkc1N0YXRlSGlzdG9yeS5sZW5ndGgpO1xuICB9KTtcblxuICBpdChcImRvZXMgbm90IGJyZWFrIHRoZSBzdGF0ZSBhZnRlciBjcmVhdGluZyBvbmUgb2JqZWN0XCIsICgpID0+IHtcbiAgICBjb25zdCBjaGFuZ2VkMSA9IHVwZGF0ZShtb2NrU3RhdGUsIGZpZWxkQ3JlYXRlZChjcmVhdGVkRmllbGRTdGF0ZSkpO1xuICAgIGNvbnN0IGNoYW5nZWQyID0gdXBkYXRlKGNoYW5nZWQxLCBmaWVsZENyZWF0ZWQoY3JlYXRlZEZpZWxkU3RhdGUpKTtcbiAgICBjb25zdCBjaGFuZ2VkMyA9IHVwZGF0ZShjaGFuZ2VkMiwgZmllbGRDcmVhdGVkKGNyZWF0ZWRGaWVsZFN0YXRlKSk7XG4gICAgZXhwZWN0KGNoYW5nZWQzLmZpZWxkVHlwZXMubGVuZ3RoKS50b0VxdWFsKG1vY2tTdGF0ZS5maWVsZFR5cGVzLmxlbmd0aCk7XG4gICAgZXhwZWN0KGNoYW5nZWQzLmZpZWxkc1N0YXRlLmxlbmd0aCkudG9FcXVhbChtb2NrQ3VycmVudFN0YXRlLmxlbmd0aCArIDMpO1xuICAgIGV4cGVjdChjaGFuZ2VkMy5maWVsZHNTdGF0ZUhpc3RvcnkubGVuZ3RoKS50b0VxdWFsKDMpO1xuICB9KTtcbn0pO1xuIiwiLyogZXNsaW50LWVudiBqYXNtaW5lICovXG5cbmltcG9ydCB7IHRvZ2dsZUNvbmZpZyB9IGZyb20gXCIuLi8uLi9qcy9BY3Rpb25zXCI7XG5pbXBvcnQgdXBkYXRlIGZyb20gXCIuLi8uLi9qcy9VcGRhdGVcIjtcblxuXG5jb25zdCBmaWVsZFN0YXRlQ29uZmlnU2hvd2luZyA9IHtcbiAgaWQ6IDEyMyxcbiAgY29uZmlnU2hvd2luZzogdHJ1ZSxcbn07XG5cbmNvbnN0IGZpZWxkU3RhdGVDb25maWdOb3RTaG93aW5nID0ge1xuICBpZDogMzIxLFxuICBjb25maWdTaG93aW5nOiBmYWxzZSxcbn07XG5cbmNvbnN0IG1vY2tTdGF0ZSA9IHtcbiAgZmllbGRUeXBlczogW10sXG4gIGZpZWxkc1N0YXRlOiBbZmllbGRTdGF0ZUNvbmZpZ1Nob3dpbmcsIGZpZWxkU3RhdGVDb25maWdOb3RTaG93aW5nXSxcbiAgZmllbGRzU3RhdGVIaXN0b3J5OiBbXSxcbn07XG5cbmRlc2NyaWJlKFwiVXBkYXRlLnRvZ2dsZUNvbmZpZ1wiLCAoKSA9PiB7XG4gIGl0KFwidHVybnMgdGhlIGNvbmZpZyBvcHRpb24gdG8gZmFsc2Ugd2hlbiBuZWVkZWRcIiwgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGlmaWVkU3RhdGUgPSB1cGRhdGUobW9ja1N0YXRlLCB0b2dnbGVDb25maWcoZmllbGRTdGF0ZUNvbmZpZ1Nob3dpbmcpKTtcbiAgICBleHBlY3QoXG4gICAgICBtb2RpZmllZFN0YXRlLmZpZWxkc1N0YXRlXG4gICAgICAuZmluZChmID0+IGYuaWQgPT09IGZpZWxkU3RhdGVDb25maWdTaG93aW5nLmlkKVxuICAgICAgLmNvbmZpZ1Nob3dpbmdcbiAgICApLnRvRXF1YWwoZmFsc2UpO1xuICB9KTtcblxuICBpdChcInR1cm5zIHRoZSBjb25maWcgb3B0aW9uIHRvIHRydWUgd2hlbiBuZWVkZWRcIiwgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGlmaWVkU3RhdGUgPSB1cGRhdGUobW9ja1N0YXRlLCB0b2dnbGVDb25maWcoZmllbGRTdGF0ZUNvbmZpZ05vdFNob3dpbmcpKTtcbiAgICBleHBlY3QoXG4gICAgICBtb2RpZmllZFN0YXRlLmZpZWxkc1N0YXRlXG4gICAgICAuZmluZChmID0+IGYuaWQgPT09IGZpZWxkU3RhdGVDb25maWdTaG93aW5nLmlkKVxuICAgICAgLmNvbmZpZ1Nob3dpbmdcbiAgICApLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIGl0KFwiYWRkcyB0aGUgbGFzdCBzdGF0ZSB0byB0aGUgaGlzdG9yeVwiLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kaWZpZWRTdGF0ZSA9IHVwZGF0ZShtb2NrU3RhdGUsIHRvZ2dsZUNvbmZpZyhmaWVsZFN0YXRlQ29uZmlnU2hvd2luZykpO1xuICAgIGV4cGVjdChtb2RpZmllZFN0YXRlLmZpZWxkc1N0YXRlSGlzdG9yeS5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KG1vZGlmaWVkU3RhdGUuZmllbGRzU3RhdGVIaXN0b3J5WzBdWzBdLmlkKS50b0VxdWFsKG1vY2tTdGF0ZS5maWVsZHNTdGF0ZVswXS5pZCk7XG4gICAgZXhwZWN0KG1vZGlmaWVkU3RhdGUuZmllbGRzU3RhdGVIaXN0b3J5WzBdWzFdLmlkKS50b0VxdWFsKG1vY2tTdGF0ZS5maWVsZHNTdGF0ZVsxXS5pZCk7XG4gIH0pO1xufSk7XG4iXSwibmFtZXMiOlsidW5kbyIsIl8iLCJpbXBvcnRTdGF0ZSIsIm5ld0ZpZWxkc1N0YXRlIiwiY3JlYXRlRmllbGQiLCJmaWVsZFR5cGUiLCJmaWVsZENyZWF0ZWQiLCJjcmVhdGVkRmllbGRTdGF0ZSIsInRvZ2dsZUNvbmZpZyIsImZpZWxkU3RhdGUiLCJkZXNjcmliZSIsImFjdGlvbiIsInR5cGUiLCJ0b0VxdWFsIiwibW9ja1N0YXRlVG9JbXBvcnQiLCJnbG9iYWwiLCJhc3luY0Rpc3BhdGNoTWlkZGxld2FyZSIsInN0b3JlIiwibmV4dCIsInN5bmNBY3Rpdml0eUZpbmlzaGVkIiwiYWN0aW9uUXVldWUiLCJmbHVzaFF1ZXVlIiwiZm9yRWFjaCIsImEiLCJkaXNwYXRjaCIsImFzeW5jRGlzcGF0Y2giLCJhc3luY0FjdGlvbiIsImNvbmNhdCIsImFjdGlvbldpdGhBc3luY0Rpc3BhdGNoIiwiSW1tdXRhYmxlIiwibWVyZ2UiLCJmYWtlQWN0aW9uIiwiZG9uZSIsInJldHVybmVkQWN0aW9uIiwibm90IiwidW5kZWZpbmVkIiwiZmFrZUFzeW5jQWN0aW9uIiwiZmFrZVN0b3JlIiwiX2lzQXJyYXkiLCJfc2xpY2UiLCJyZXF1aXJlJCQxIiwicmVxdWlyZSQkMCIsIl9jaGVja0Zvck1ldGhvZCIsIl9pc1BsYWNlaG9sZGVyIiwiX2N1cnJ5MSIsIl9jdXJyeTIiLCJyZXF1aXJlJCQyIiwiX2N1cnJ5MyIsImFsd2F5cyIsIm92ZXIiLCJfYXJpdHkiLCJfcGlwZSIsIl94d3JhcCIsImJpbmQiLCJfaXNTdHJpbmciLCJpc0FycmF5TGlrZSIsIl9yZWR1Y2UiLCJzbGljZSIsInJlcXVpcmUkJDMiLCJfY29uY2F0IiwicHJvcCIsIl9pc1RyYW5zZm9ybWVyIiwiX2Rpc3BhdGNoYWJsZSIsIl9tYXAiLCJfeG1hcCIsIl9jdXJyeU4iLCJjdXJyeU4iLCJfaGFzIiwiX2lzQXJndW1lbnRzIiwia2V5cyIsInJlcXVpcmUkJDYiLCJyZXF1aXJlJCQ1IiwicmVxdWlyZSQkNCIsIm1hcCIsImxlbnMiLCJjdXJyeSIsInVwZGF0ZUF0IiwiX2RlZmF1bHQiLCJrZXlBcnJheSIsIm5ld1ZhbCIsIm9iaiIsImRlZXBOZXdWYWwiLCJyZWR1Y2VSaWdodCIsInJlc3VsdCIsImtleSIsImRlZXAiLCJTdGF0ZUxlbnNlcyIsIl9kZWZhdWx0MiIsIl9kZWZhdWx0MyIsImNyZWF0ZUlkIiwiRGF0ZSIsIm5vdyIsInRvU3RyaW5nIiwicHVzaEhpc3RvcnlTdGF0ZSIsInN0YXRlIiwibmV3SGlzdG9yeVN0YXRlIiwiX2RlZmF1bHQ0IiwiX2RlZmF1bHQ1IiwiZmllbGRzU3RhdGVIaXN0b3J5IiwiX2RlZmF1bHQ2IiwiZmllbGRzU3RhdGUiLCJfZGVmYXVsdDciLCJoaWRlQ29uZmlncyIsInMiLCJPYmplY3QiLCJhc3NpZ24iLCJjb25maWdTaG93aW5nIiwibGFzdEhpc3RvcnlTdGF0ZSIsIkluZmluaXR5IiwiX2lkZW50aXR5IiwiYXAiLCJwcmVwZW5kIiwic2VxdWVuY2UiLCJfYXJyYXlGcm9tSXRlcmF0b3IiLCJfZnVuY3Rpb25OYW1lIiwiaWRlbnRpY2FsIiwiX2VxdWFscyIsIkVpdGhlciIsImlzQXJyYXkiLCJhcnIiLCJBcnJheSIsIlJpZ2h0IiwiTGVmdCIsImZpZWxkVHlwZUlzVmFsaWQiLCJ2YWxpZFR5cGVzIiwiZmllbGQiLCJmaW5kIiwidmFsaWRGaWVsZFR5cGVzIiwib2YiLCJ2YWxpZGF0ZUZpZWxkc1N0YXRlIiwiY2hhaW4iLCJmaWVsZFR5cGVzIiwiYWRkUmVxdWlyZWRQcm9wZXJ0aWVzIiwiZmllbGRTdGF0ZXMiLCJiaW1hcCIsImNvbnNvbGUiLCJlcnJvciIsImdldE9yRWxzZSIsIl9yZWR1Y2VkIiwiX3hmQmFzZSIsIl94ZmluZCIsIlRhc2siLCJ0eXBlQ29uc3RydWN0b3IiLCJ2IiwiaW5mbyIsImZyb21OdWxsYWJsZSIsImNvbnN0ciIsInJlamVjdCIsInJlc29sdmUiLCJjYWxsZWQiLCJpbml0aWFsU3RhdGUiLCJQcm9taXNlIiwidGhlbiIsImNhdGNoIiwiaW5zZXJ0UmVxdWlyZWRQcm9wcyIsImNyZWF0ZUZpZWxkQXN5bmNocm9ub3VzbHkiLCJsZWZ0TWFwIiwicmVqZWN0ZWQiLCJmb3JrIiwiZXJyIiwiTWF5YmUiLCJjbG9uZSIsInVuaW1wbGVtZW50ZWQiLCJub29wIiwiaGlzdG9yeVN0YXRlV2l0aE5ld0ZpZWxkIiwibmV3RmllbGQiLCJzZXQiLCJyZXBsYWNlRmllbGRTdGF0ZSIsImFGaWVsZCIsImlkIiwiYWN0aW9uSGFuZGxlcnMiLCJpc0V4cGVjdGVkQWN0aW9uIiwiaXNSZWR1eEFjdGlvbiIsImluY2x1ZGVzIiwidXBkYXRlIiwiYXNzZXJ0IiwiY3VycmVudEZpZWxkc1N0YXRlIiwib2xkRmllbGRzU3RhdGUiLCJtb2NrU3RhdGUiLCJlbXB0eU1vY2tTdGF0ZSIsImVtcHR5SGlzdG9yeU1vY2tTdGF0ZSIsIm1vZGlmaWVkU3RhdGUiLCJ1bmRvQWN0aW9uIiwibGVuZ3RoIiwidHlwZXNBcnJheSIsIm1vY2tDdXJyZW50U3RhdGUiLCJtb2NrSGlzdG9yeSIsIm5ld1ZhbGlkU3RhdGUiLCJuZXdJbnZhbGlkU3RhdGUiLCJ1cGRhdGVkIiwiZGlzcGxheU5hbWUiLCJncm91cCIsInByb21pc2VUeXBlSW5zdGFuY2UiLCJwcm9taXNlVHlwZSIsInN5bmNUeXBlSW5zdGFuY2UiLCJzeW5jVHlwZSIsImFzeW5jQWNpb24iLCJqYXNtaW5lIiwiY3JlYXRlU3B5IiwidG9IYXZlQmVlbkNhbGxlZCIsImZpZWxkQ3JlYXRlZEFjdGlvbiIsIm5ld1N0YXRlIiwic2FtZVN0YXRlIiwiY2hhbmdlZDEiLCJjaGFuZ2VkMiIsImNoYW5nZWQzIiwiZmllbGRTdGF0ZUNvbmZpZ1Nob3dpbmciLCJmaWVsZFN0YXRlQ29uZmlnTm90U2hvd2luZyIsImYiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBSUEsQUFBTyxNQUFNQSxPQUFPQyxNQUNuQjtRQUNPO0NBRlksQ0FBYjs7QUFLUCxBQUFPLE1BQU1DLGNBQWNDLG1CQUMxQjtRQUNPLGFBRFA7O0NBRDBCLENBQXBCOztBQU1QLEFBQU8sTUFBTUMsY0FBY0MsY0FDMUI7UUFDTyxhQURQOztDQUQwQixDQUFwQjs7QUFNUCxBQUFPLE1BQU1DLGVBQWVDLHNCQUMzQjtRQUNPLGNBRFA7O0NBRDJCLENBQXJCOztBQU1QLEFBQU8sTUFBTUMsZUFBZUMsZUFDM0I7UUFDTyxjQURQOztDQUQyQixDQUFyQjs7QUMzQlA7O0FBRUEsQUFRQUMsU0FBUyxRQUFULEVBQW1CLE1BQU07V0FDZCxNQUFULEVBQWlCLE1BQU07T0FDbEIsaUNBQUgsRUFBc0MsTUFBTTtZQUNwQ0MsU0FBU1gsTUFBZjthQUNPVyxPQUFPQyxJQUFkLEVBQW9CQyxPQUFwQixDQUE0QixNQUE1QjtLQUZGO0dBREY7O1dBT1MsYUFBVCxFQUF3QixNQUFNO1VBQ3RCQyxvQkFBb0IsQ0FBQyxHQUFELEVBQU0sR0FBTixDQUExQjs7T0FFRyxpQ0FBSCxFQUFzQyxNQUFNO1lBQ3BDSCxTQUFTVCxZQUFZWSxpQkFBWixDQUFmO2FBQ09ILE9BQU9DLElBQWQsRUFBb0JDLE9BQXBCLENBQTRCLGFBQTVCO0tBRkY7O09BS0csK0JBQUgsRUFBb0MsTUFBTTtZQUNsQ0YsU0FBU1QsWUFBWVksaUJBQVosQ0FBZjthQUNPSCxPQUFPUixjQUFkLEVBQThCVSxPQUE5QixDQUFzQ0MsaUJBQXRDO0tBRkY7R0FSRjs7V0FjUyxhQUFULEVBQXdCLE1BQU07VUFDdEJULFlBQVks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QUFDLENBQUMsRUFBRSxDQUFDO2VBQ3ZFLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7TUFDeEQ7UUFDRSxPQUFPLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksY0FBYyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUU7ZUFDaEUsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7ZUFDNUYsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7ZUFDNUYsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7ZUFDNUYsY0FBYyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2VBQ2xFLGNBQWMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFF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LENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDdEUsS0FBSyxDQUFDLEVBQUUsT0FBTyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDMUUsS0FBSyxDQUFDLEVBQUUsT0FBTyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzlFLEtBQUssQ0FBQyxFQUFFLE9BQU8sU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDbEYsS0FBSyxDQUFDLEVBQUUsT0FBTyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDdEYsS0FBSyxDQUFDLEVBQUUsT0FBTyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzFGLEtBQUssQ0FBQyxFQUFFLE9BQU8sU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FB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