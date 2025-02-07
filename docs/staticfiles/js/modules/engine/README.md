# JavaScript Component Library

This library provides a set of tools for creating reusable and customizable web components. It focuses on separation of concerns, flexibility, and performance.

## Core Concepts

*   **Components:** The fundamental building blocks of the UI.  Components encapsulate their own state, logic, and rendering.
*   **DOM Manipulation:** Utilities for creating, resolving, and manipulating DOM elements.
*   **Event Handling:** A system for managing event listeners on components.
*   **Rendering:**  Strategies for inserting components into the DOM.

## Modules

### `DOM.js`

Provides utilities for working with the DOM.

*   **`DOMUtil`:**
    *   `resolveElement(target)`: Resolves a target element from a selector, HTMLElement, or Component.
    *   `createElement(tagName)`: Creates a new HTMLElement.
*   **`RenderEngine`:**
    *   `render(element, target, method, reference)`: Renders a component into a target element using the specified method.
    *   `renderStrategies`: An object containing different rendering strategies (append, before, replace, beforeSibling, afterSibling).

### `core.js`

Defines the core `Component` class.

*   **`Component`:**
    *   `constructor(tagOrElement, classList)`: Initializes a new Component.
    *   `setState(newState)`: Sets the component's state and triggers an update.
    *   `setAttribute(attr, value)`: Sets an attribute on the component's element.
    *   `setAttributes(attributes)`: Sets multiple attributes on the component's element.
    *   `getAttribute(attr)`: Retrieves the value of a named attribute on the component's element.
    *   `setId(id)`: Sets the id attribute on the component's element.
    *   `setClassList(classList)`: Sets the class names on the component's element.
    *   `addClass(classItem)`: Adds a class to the component's element.
    *   `removeClass(classItem)`: Removes a class from the component's element.
    *   `toggleClass(classItem)`: Toggles a class on the component's element.
    *   `setContent(content)`: Sets the innerHTML of the component's element or appends a HTMLElement or a Component.
    *   `setText(content)`: Sets the textContent of the component's element.
    *   `setStyle(styles)`: Sets the style of the component's element.
    *   `appendTo(parent)`: Appends the component to the given parent.
    *   `addEventListener(event, callback)`: Adds an event listener to the component's element.
    *   `removeEventListener(event, callback)`: Removes an event listener from the component's element.
    *   `clearEventListeners()`: Removes all event listeners from the component's element.
    *   `render(options)`: Renders the component into another element.
    *   `update()`: Updates the component in the DOM.
    *   `renderContent()`: Override this method to define how the component's content is rendered.
    *   `beforeMount()`: Called before the component is mounted to the DOM.
    *   `afterMount()`: Called after the component is mounted to the DOM.
    *   `beforeUpdate()`: Called before the component is updated in the DOM.
    *   `afterUpdate()`: Called after the component is updated in the DOM.
    *   `beforeUnmount()`: Called before the component is removed from the DOM.
    *   `remove()`: Removes the component from the DOM and clears its event listeners.

### `events.js`

Provides a system for managing event listeners.

*   **`EventSystem`:**
    *   `constructor(element)`: Initializes the EventSystem class.
    *   `on(event, callback)`: Adds an event listener.
    *   `off(event, callback)`: Removes an event listener.
    *   `clear()`: Removes all event listeners.

## Usage

### Creating a Component

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

### Updating a Component

```javascript
myComponent.setState({ message: 'New message!' });
```

### Removing a Component

```javascript
myComponent.remove();
```

## Extending Components

To create a custom component, extend the `Component` class and override the `renderContent()` method to define how the component's content is rendered.  You can also use the lifecycle hooks (`beforeMount`, `afterMount`, `beforeUpdate`, `afterUpdate`, `beforeUnmount`) to perform actions at different stages of the component's lifecycle.

## Contributing

[Instructions on how to contribute to the project.]

## License