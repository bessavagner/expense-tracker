# JavaScript Component Library

This library provides a set of tools for creating reusable and customizable web components. It focuses on **separation of concerns**, **flexibility**, and **performance**. The library is designed to be lightweight, modular, and easy to extend.

---

## **Core Concepts**

### **Components**
The fundamental building blocks of the UI. Components encapsulate their own state, logic, and rendering. They can be nested, reused, and composed to build complex user interfaces.

### **DOM Manipulation**
Utilities for creating, resolving, and manipulating DOM elements. This includes creating new elements, resolving existing ones, and rendering components into the DOM.

### **Event Handling**
A system for managing event listeners on components. It supports adding, removing, and clearing event listeners efficiently.

### **Rendering**
Strategies for inserting components into the DOM. The library supports multiple rendering methods, such as `append`, `before`, `replace`, `beforeSibling`, and `afterSibling`.

### **Benchmarking**
A built-in benchmarking system to measure and compare the performance of your components against vanilla JavaScript and other libraries.

---

## **Modules**

### **`DOM.js`**
Provides utilities for working with the DOM.

#### **`DOMUtil`**
- **`resolveElement(target)`**: Resolves a target element from a selector, `HTMLElement`, or `Component`. Throws an error if the target cannot be resolved.
- **`createElement(tagName)`**: Creates a new `HTMLElement` with the specified tag name.

#### **`RenderEngine`**
- **`render(element, target, method, reference)`**: Renders a component into a target element using the specified method.
- **`renderStrategies`**: An object containing different rendering strategies:
  - `append`: Appends the element to the target.
  - `before`: Inserts the element before the reference element.
  - `replace`: Replaces the reference element with the new element.
  - `beforeSibling`: Inserts the element as a sibling before the target.
  - `afterSibling`: Inserts the element as a sibling after the target.

---

### **`core.js`**
Defines the core `Component` class.

#### **`Component`**
- **`constructor(tagOrElement, classList)`**: Initializes a new `Component`. Accepts a tag name, `HTMLElement`, or another `Component` as the base element.
- **`setState(newState)`**: Updates the component's state and triggers a re-render.
- **`setAttribute(attr, value)`**: Sets an attribute on the component's element.
- **`setAttributes(attributes)`**: Sets multiple attributes on the component's element.
- **`getAttribute(attr)`**: Retrieves the value of a named attribute.
- **`setId(id)`**: Sets the `id` attribute on the component's element.
- **`setClassList(classList)`**: Sets the class names on the component's element.
- **`addClass(classItem)`**: Adds a class to the component's element.
- **`removeClass(classItem)`**: Removes a class from the component's element.
- **`toggleClass(classItem)`**: Toggles a class on the component's element.
- **`setContent(content)`**: Sets the `innerHTML` of the component's element or appends an `HTMLElement` or `Component`.
- **`setText(content)`**: Sets the `textContent` of the component's element.
- **`setStyle(styles)`**: Sets the style of the component's element.
- **`appendTo(parent)`**: Appends the component to the given parent.
- **`addEventListener(event, callback)`**: Adds an event listener to the component's element.
- **`removeEventListener(event, callback)`**: Removes an event listener from the component's element.
- **`clearEventListeners()`**: Removes all event listeners from the component's element.
- **`render(options)`**: Renders the component into another element.
- **`update()`**: Updates the component in the DOM.
- **`renderContent()`**: Override this method to define how the component's content is rendered.
- **Lifecycle Hooks**:
  - `beforeMount()`: Called before the component is mounted to the DOM.
  - `afterMount()`: Called after the component is mounted to the DOM.
  - `beforeUpdate()`: Called before the component is updated in the DOM.
  - `afterUpdate()`: Called after the component is updated in the DOM.
  - `beforeUnmount()`: Called before the component is removed from the DOM.
- **`remove()`**: Removes the component from the DOM and clears its event listeners.

---

### **`events.js`**
Provides a system for managing event listeners.

#### **`EventSystem`**
- **`constructor(element)`**: Initializes the `EventSystem` for a given element.
- **`on(event, callback)`**: Adds an event listener. Returns a cleanup function to remove the listener.
- **`off(event, callback)`**: Removes an event listener.
- **`clear()`**: Removes all event listeners.

---

### **`benchmarks.js`**
Provides a benchmarking system to measure the performance of your components.

#### **Benchmark Functions**
- **`benchmarkRendering()`**: Measures the time taken to create and render a simple component.
- **`benchmarkEventHandling()`**: Measures the time taken to add and remove event listeners.
- **`benchmarkDOMUpdates()`**: Measures the time taken to update the DOM (e.g., setting content or attributes).
- **`benchmarkVanillaRendering()`**: Measures the time taken to create and render a simple element using vanilla JavaScript.
- **`benchmarkVanillaEventHandling()`**: Measures the time taken to add and remove event listeners using vanilla JavaScript.
- **`benchmarkVanillaDOMUpdates()`**: Measures the time taken to update the DOM using vanilla JavaScript.

#### **Benchmark Runner**
- **`runBenchmarks()`**: Runs all benchmarks for the `Component` engine and sends the results to the server.
- **`runVanillaBenchmarks()`**: Runs all benchmarks for vanilla JavaScript and sends the results to the server.

---

## **Usage**

### **Creating a Component**
```javascript
import { Component } from './core.js';

class MyComponent extends Component {
    constructor() {
        super('div', ['my-component']);
        this.state = { message: 'Hello, world!' };
    }

    renderContent() {
        this.element.textContent = this.state.message;
    }
}

const myComponent = new MyComponent();
myComponent.render({ target: document.body });
```

### **Updating a Component**
```javascript
myComponent.setState({ message: 'New message!' });
```

### **Removing a Component**
```javascript
myComponent.remove();
```
## Benchmarking

### Running Benchmarks

To compare the performance of your Component engine against vanilla JavaScript, use the following functions:

1. Go to ./benchmarks/js
2. Run the benchmark UI `python server.py`
3. Click the "Run Benchmarks" button.

This tests the components against vanilla Javascript operations on elements.

Extend the benchmark tests at ./src/staticfiles/js/modules/engine/branchmarks.js

## Extending Components

To create a custom component, extend the Component class and override the `renderContent()` method to define how the component's content is rendered. You can also use the lifecycle hooks (`beforeMount`, `afterMount`, `beforeUpdate`, `afterUpdate`, `beforeUnmount`) to perform actions at different stages of the component's lifecycle.