// @ts-check
import { Component } from "./core.js";

export class DOMUtil {
  /**
   * Resolves an existing target element from a selector, HTMLElement, or Component.
   * @param {string|HTMLElement|Component|Node} target - The target to resolve.
   * @returns {HTMLElement} The resolved HTMLElement.
   * @throws {TypeError} If the target cannot be resolved.
   */
  static resolveElement(target) {
    if (typeof target === "string") {
      const element = document.querySelector(target);
      if (element instanceof HTMLElement) {
        return element;
      } else {
        throw new Error(`No element found for selector: "${target}"`);
      }
    } else if (target instanceof HTMLElement) {
      return target;
    } else if (target instanceof Component) {
      return target.element;
    } else if (target instanceof Node) {
      if (target instanceof HTMLElement) {
        return target;
      }
      throw new TypeError(
        `Target must be a string selector, HTMLElement, or Component.  Received: ${typeof target}`
      );
    } else {
      throw new TypeError(
        "Target must be a string selector, HTMLElement, or Component."
      );
    }
  }

  /**
   * Creates a new HTMLElement.
   * @param {string} tagName - The tag name of the element to create.
   * @returns {HTMLElement} The newly created HTMLElement.
   */
  static createElement(tagName) {
    return document.createElement(tagName);
  }
}

export class RenderEngine {
  static renderStrategies = {
    append: (element, target, reference) => target.appendChild(element),
    before: (element, target, reference) => {
      if (!reference)
        throw new Error('Reference element is required for "before" method.');
      target.insertBefore(element, reference);
    },
    replace: (element, target, reference) => {
      if (!reference)
        throw new Error('Reference element is required for "replace" method.');
      target.replaceChild(element, reference);
    }
  };

  /**
   * Renders a component into a target element using the specified method.
   * @param {HTMLElement} element - The element to render.
   * @param {HTMLElement} target - The target element to render into.
   * @param {keyof RenderEngine.renderStrategies} method - The render method.
   * @param {HTMLElement|null} reference - The reference element for 'before' or 'replace' methods.
   * @throws {Error} If the method is invalid or reference is missing.
   */
  static render(element, target, method = "append", reference = null) {
    const strategy = RenderEngine.renderStrategies[method];
    if (!strategy) {
        throw new Error(`Invalid render method: "${method}".  Valid methods are: ${Object.keys(RenderEngine.renderStrategies).join(', ')}`);
    }
    strategy(element, target, reference);
  }
}
