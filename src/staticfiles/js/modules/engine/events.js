// @ts-check

import { Component } from "./core.js";
import { DOMUtil } from "./DOM.js";

export class EventSystem {
    /**
     * Initializes the EventSystem class.
     * @param {String|HTMLElement|Component|Node} element - The HTML element to listen to events on.
     */
    constructor(element) {
        this.element = DOMUtil.resolveElement(element);
        this.listeners = new Map();
    }

    /**
     * Adds an event listener.
     * @param {string} event - The event name.
     * @param {(event: Event) => void} callback - The callback function.
     * @returns {() => void} A function to remove the event listener.
     */
    on(event, callback) {
        /**
         * @param {Event} e
         */
        const handler = (e) => callback(e);
        this.element.addEventListener(event, handler);
        this.listeners.set(callback, { event, handler, originalCallback: callback }); // Store original callback
        return () => {
            this.off(event, callback); // Use the existing off method
        };
    }

    /**
     * Removes an event listener.
     * @param {string} event - The event name.
     * @param {(event: Event) => void} callback - The callback function.
     * @returns {EventSystem} This EventSystem instance for chaining.
     */
    off(event, callback) {
        let entry = null;
        for (const [key, value] of this.listeners.entries()) {
            if (value.originalCallback === callback) {
                entry = value;
                callback = key; // Use the key (original callback) for deletion
                break;
            }
        }

        if (entry) {
            this.element.removeEventListener(entry.event, entry.handler);
            this.listeners.delete(callback);
        }
        return this;
    }

    /**
     * Removes all event listeners.
     */
    clear() {
        for (const { event, handler } of this.listeners.values()) {
            this.element.removeEventListener(event, handler);
        }
        this.listeners.clear();
        return this;
    }
}