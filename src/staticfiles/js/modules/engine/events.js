// @ts-check

import { Component } from "./core.js";
import { DOMUtil } from "./DOM.js";

export class EventSystem {
    /**
     * Initializes the EventSystem class.
     * @param {String|HTMLElement|Component|Node} element - The HTML element to listen to events on.
     */
    constructor(element) {
        this.element = DOMUtil.resolveTarget(element);
        this.listeners = new Map();
    }

    /**
     * Adds an event listener.
     * @param {string} event - The event name.
     * @param {(event: Event) => void} callback - The callback function.
     * @returns {() => EventSystem} A function to remove the event listener.
     */
    on(event, callback) {
        /**
         * @param {Event} e
         */
        const handler = (e) => callback(e);
        this.element.addEventListener(event, handler);
        this.listeners.set(callback, { event, handler });
        return () => this.off(event, callback);
    }

    /**
     * Removes an event listener.
     * @param {string} event - The event name.
     * @param {(event: Event) => void} callback - The callback function.
     * @returns {EventSystem} This EventSystem instance for chaining.
     */
    off(event, callback) {
        const entry = this.listeners.get(callback);
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
    }
}