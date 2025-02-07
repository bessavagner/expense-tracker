// @ts-check

import { Component } from "./core.js";


export class ComponentRegistry {
    static components = new Set();

    /**
     * Registers a component.
     * @param {Component} component - The component to register.
     */
    static register(component) {
        this.components.add(component);
    }

    /**
     * Unregisters a component.
     * @param {Component} component - The component to unregister.
     */
    static unregister(component) {
        this.components.delete(component);
    }

    /**
     * Cleans up all registered components.
     */
    static cleanup() {
        const components = new Set(this.components);
        for (const component of components) {
            try {
                component.remove();
            } catch (error) {
                console.error('Error while removing component:', error);
            }
        }
        this.components.clear();
    }
}
