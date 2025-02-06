// @ts-check
import { Component } from './core.js';

/**
 * Checks if the given element is an HTMLElement.
 * @param {*} element - The element to check.
 * @returns {boolean} True if the element is an HTMLElement, false otherwise.
 */
function isHTMLElement(element) {
    return element instanceof HTMLElement;
}

export class DOMUtil {
    /**
     * Resolves a target element from a selector, HTMLElement, or Component.
     * @param {string|HTMLElement|Component|Node} target - The target to resolve.
     * @returns {HTMLElement} The resolved HTMLElement.
     * @throws {TypeError} If the target cannot be resolved.
     */
    static resolveTarget(target) {
        if (typeof target === 'string') {
            const element = document.querySelector(target);
            if (element instanceof HTMLElement) {
                return element;
            } else {
                throw new Error(`The element found for selector "${target}" is not an HTMLElement`);
            }
        } else if (target instanceof HTMLElement) {
            return target;
        } else if (target instanceof Component) {
            return target.element;
        } else {
            throw new TypeError('Target must be a string selector, HTMLElement, or Component.');
        }
    }
}

export class RenderEngine {
    /**
     * Renders a component into a target element using the specified method.
     * @param {HTMLElement} element - The element to render.
     * @param {HTMLElement} target - The target element to render into.
     * @param {'append'|'before'|'replace'|'beforeSibling'|'afterSibling'} method - The render method.
     * @param {HTMLElement|null} reference - The reference element for 'before' or 'replace' methods.
     * @throws {Error} If the method is invalid or reference is missing.
     */
    static render(element, target, method = 'append', reference = null) {
        switch (method) {
            case 'append':
                console.log(typeof element);
                target.appendChild(element);
                break;
            case 'before':
                if (!reference) {
                    throw new Error('Reference element is required for "before" method.');
                }
                target.insertBefore(element, reference);
                break;
            case 'replace':
                if (!reference) {
                    throw new Error('Reference element is required for "replace" method.');
                }
                target.replaceChild(element, reference);
                break;
            case 'beforeSibling':
                if (!target.parentNode) {
                    throw new Error('Target must have a parent to insert as a sibling.');
                }
                target.parentNode.insertBefore(element, target);
                break;
            case 'afterSibling':
                if (!target.parentNode) {
                    throw new Error('Target must have a parent to insert as a sibling.');
                }
                target.parentNode.insertBefore(element, target.nextSibling);
                break;
            default:
                throw new Error(`Invalid render method: "${method}".`);
        }
    }
}
