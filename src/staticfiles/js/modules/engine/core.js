//@ts-check

import { DOMUtil, RenderEngine } from "./DOM.js";
import { EventSystem } from "./events.js";


export class Component {
    /**
     * Initializes a new Component.
     * 
     * @param {string|HTMLElement|Component|Node} tagOrElement - The tag name or HTMLElement to create the component.
     * @param {Array<string>|string|null} [classList=null] - Optional class names to apply to the element.
     */
    constructor(tagOrElement, classList = null) {
        if (typeof tagOrElement === 'string') {
            this.element = DOMUtil.createElement(tagOrElement);
        } else {
            this.element = DOMUtil.resolveElement(tagOrElement);
        }
        this.eventSystem = new EventSystem(this.element);
        if (classList) {
            this.setClassList(classList);
        }
        this.state = {};
    }

    /**
     * Sets the component's state and triggers an update.
     * @param {object} newState - The new state to merge with the existing state.
     */
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.update();
    }

    /**
     * Sets an attribute on the component's element.
     * 
     * @param {string} attr - The attribute name.
     * @param {string} value - The attribute value.
     * @returns {Component} This Component instance for chaining.
     */
    setAttribute(attr, value) {
        this.element.setAttribute(attr, value);
        return this;
    }

    /**
     * Sets multiple attributes on thelse if (target instanceof Node) {
            return HTMLElement.prototype.contains.call(target);
        } e component's element.
     * 
     * @param {Object.<string, string>} attributes - An object with attribute names as keys and attribute values as values.
     * @returns {Component} This Component instance for chaining.
     */
    setAttributes(attributes) {
        if (typeof attributes !== 'object' || Array.isArray(attributes) || attributes === null) {
            throw new TypeError('Attributes must be an object with key-value pairs.');
        }
    
        for (const [attr, value] of Object.entries(attributes)) {
            this.setAttribute(attr, value);
        }
        return this;
    }

    /**
     * Retrieves the value of a named attribute on the component's element.
     * 
     * @param {string} attr - The attribute name.
     * @returns {string|null} The attribute value, or null if the attribute does not exist.
     */
    getAttribute(attr) {
        return this.element.getAttribute(attr);
    }
    /**
     * Sets the id attribute on the component's element.
     * 
     * @param {string} id - The id to set.
     * @returns {Component} This Component instance for chaining.
     */
    setId(id) {
        this.setAttribute('id', id);
        return this;
    }

    /**
     * Sets the class names on the component's element.
     * 
     * @param {string|Array<string>} classList - The class names to set. If a string, it is
     * set as the className of the element. If an array, its elements are added to the
     * element's classList.
     * @returns {Component} This Component instance for chaining.
     */
    setClassList(classList) {
        if (Array.isArray(classList)) {
            classList.forEach((classItem) => this.addClass(classItem));
        } else {
            this.element.className = classList;
        }
        return this;
    }

    /**
     * Adds a class to the component's element.
     * 
     * @param {string} classItem - The class name to add.
     * @returns {Component} This Component instance for chaining.
     */
    addClass(classItem) {
        this.element.classList.add(classItem);
        return this;
    }

    /**
     * Removes a class from the component's element.
     * 
     * @param {string} classItem - The class name to remove.
     * @returns {Component} This Component instance for chaining.
     */
    removeClass(classItem) {
        this.element.classList.remove(classItem);
        return this;
    }

    /**
     * Toggles a class on the component's element.
     * 
     * @param {string} classItem - The class name to toggle.
     * @returns {Component} This Component instance for chaining.
     */
    toggleClass(classItem) {
        this.element.classList.toggle(classItem);
        return this;
    }


    /**
     * Sets the innerHTML of the component's element or appends a HTMLElement or a Component.
     * 
     * @param {string|HTMLElement|Component} content - The innerHTML to set, or a HTMLElement or Component.
     * @returns {Component} This Component instance for chaining.
     */
    setContent(content) {
        if (typeof content === 'string') {
            this.element.innerHTML = content;
            return this;
        }
        if (content instanceof HTMLElement) {
            this.element.replaceChildren(content);
        } else if (content instanceof Component) {
            this.element.replaceChildren(content.element);
        } else {
            throw Error(`'content' must be a string, HTMLElement or Component, but got ${typeof content}.`);
        }
        return this;
    }

    /**
     * Sets the textContent of the component's element.
     * 
     * @param {string} content - The text content to set.
     * @returns {Component} This Component instance for chaining.
     */
    setText(content) {
        this.element.textContent = content;
        return this;
    }

    /**
     * Sets the style of the component's element.
     * 
     * @param {Object<string,string>} styles - The styles to set. Each key is a CSS property name and the value is the property value.
     * @returns {Component} This Component instance for chaining.
     */
    setStyle(styles) {
        Object.assign(this.element.style, styles);
        return this;
    }

    /**
     * Appends the component to the given parent.
     * 
     * @param {HTMLElement|Component} parent - The parent element or component to append to.
     * @returns {Component} This Component instance for chaining.
     */
    appendTo(parent) {
        if (!parent) {
            throw new Error('Parent element cannot be null or undefined.');
        }
        DOMUtil.resolveElement(parent).appendChild(this.element);
        return this;
    }

    /**
     * Adds an event listener to the component's element.
     * 
     * @param {string} event - The event name.
     * @param {(event: Event) => void} callback - The callback function
     * @returns {Component} This Component instance for chaining.
     */
    addEventListener(event, callback) {
        this.eventSystem.on(event, callback);
        return this;
    }

    /**
     * Removes an event listener from the component's element.
     * @param {string} event - The event name.
     * @param {(event: Event) => void} callback - The callback function.
     * @returns {Component} This Component instance for chaining.
     */
    removeEventListener(event, callback) {
        this.eventSystem.off(event, callback);
        return this;
    }

    /**
     * Removes all event listeners from the component's element.
     * @returns {Component} This Component instance for chaining.
     */
    clearEventListeners() {
        this.eventSystem.clear();
        return this;
    }
    /**
     * @typedef {Object} RenderOptions
     * @property {HTMLElement|string|Component|null|Node} [target=document.body] - The parent element to render into.
     * @property {'append'|'before'|'replace'|'beforeSibling'|'afterSibling'} [method='append'] - How to insert the component.
     * @property {HTMLElement|ChildNode|null} [reference=null] - The element to insert before (for 'before' insertion or 'replace' replacement).
     */

    /**
     * Appends a child component to the input.
     * @param {string|HTMLElement|Component|Node|Array<string|HTMLElement|Component|Node>} tagOrElements - The child component to append.
     * @returns {Component} This Input instance for chaining.
     */
    append(tagOrElements) {
        if (Array.isArray(tagOrElements)) {
            tagOrElements.forEach((tagOrElement) => {
                this.element.appendChild(DOMUtil.resolveElement(tagOrElement));
            });
            return this;
        }
        this.element.appendChild(DOMUtil.resolveElement(tagOrElements));
        return this;
    }

    /**
     * Renders the component into another element.
     * @param {RenderOptions} options - Options for rendering the component.
     * @returns {Component|undefined} This Component instance for chaining.
     */
    render(options = {}) {
        const { target = document.body, method = 'append', reference = null } = options;
        if (!target) {
            throw new Error('Target element cannot be null or undefined.');
        }
        const resolvedTarget = DOMUtil.resolveElement(target);
        const resolvedReference = reference ? DOMUtil.resolveElement(reference) : null;
        
        this.beforeMount();
        RenderEngine.render(this.element, resolvedTarget, method, resolvedReference);
        this.afterMount();
        
        return this;
    }

    /**
     * Updates the component in the DOM.
     */
    update() {
        this.beforeUpdate();
        // Perform DOM updates here (e.g., re-render the component's content)
        this.renderContent(); // Call renderContent to update the DOM
        this.afterUpdate();
    }

    /**
     * Override this method to define how the component's content is rendered.
     * This method is called during initial render and updates.
     */
    renderContent() {
        // Implement in subclasses to update the DOM based on the component's state.
        // Example: this.element.textContent = this.state.message;
    }

    /**
     * Called before the component is mounted to the DOM.
     * Override this method to perform actions before mounting.
     */
    beforeMount() {}

    /**
     * Called after the component is mounted to the DOM.
     * Override this method to perform actions after mounting.
     */
    afterMount() {}

    /**
     * Called before the component is updated in the DOM.
     * Override this method to perform actions before updating.
     */
    beforeUpdate() {}

    /**
     * Called after the component is updated in the DOM.
     * Override this method to perform actions after updating.
     */
    afterUpdate() {}

    /**
     * Called before the component is removed from the DOM.
     * Override this method to perform actions before unmounting.
     */
    beforeUnmount() {}

    /**
     * Removes the component from the DOM and clears its event listeners.
     * @returns {Component} This Component instance for chaining.
     */
    remove() {
        this.beforeUnmount();
        this.element.remove();
        this.clearEventListeners();
        return this;
    }

}