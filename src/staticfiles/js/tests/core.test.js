/**
 * @jest-environment jsdom
 */

import { Component } from '../modules/engine/core.js';
import { DOMUtil } from '../modules/engine/DOM.js';

describe('Component', () => {
  let component;

  beforeEach(() => {
    component = new Component('div');
  });

  afterEach(() => {
    if (component && component.element && component.element.parentNode) {
      component.remove(); // Clean up after each test
    }
  });

  it('should create a new component with the given tag name', () => {
    expect(component.element.tagName).toBe('DIV');
  });

  it('should set the id attribute', () => {
    component.setId('my-component');
    expect(component.element.id).toBe('my-component');
  });

  it('should add a class to the component', () => {
    component.addClass('my-class');
    expect(component.element.classList.contains('my-class')).toBe(true);
  });

  it('should set the content of the component', () => {
    component.setContent('Hello, world!');
    expect(component.element.innerHTML).toBe('Hello, world!');
  });

  it('should append the component to the body', () => {
    component.render();
    expect(document.body.contains(component.element)).toBe(true);
  });

  it('should remove the component from the DOM', () => {
    component.render();
    component.remove();
    expect(document.body.contains(component.element)).toBe(false);
  });

  it('should set multiple attributes', () => {
    component.setAttributes({
      'data-test': 'test',
      'aria-label': 'test label'
    });
    expect(component.element.getAttribute('data-test')).toBe('test');
    expect(component.element.getAttribute('aria-label')).toBe('test label');
  });

  it('should throw an error if setAttributes is not called with an object', () => {
    expect(() => {
      component.setAttributes('not an object');
    }).toThrow(TypeError);
  });

  it('should set the state and trigger an update', () => {
    const renderContentMock = jest.spyOn(component, 'renderContent');
    component.setState({ message: 'New message' });
    expect(component.state.message).toBe('New message');
    expect(renderContentMock).toHaveBeenCalled();
    renderContentMock.mockRestore(); // Restore the original method
  });

  it('should call beforeMount and afterMount during render', () => {
    const beforeMountMock = jest.spyOn(component, 'beforeMount');
    const afterMountMock = jest.spyOn(component, 'afterMount');

    component.render();

    expect(beforeMountMock).toHaveBeenCalled();
    expect(afterMountMock).toHaveBeenCalled();

    beforeMountMock.mockRestore();
    afterMountMock.mockRestore();
  });

  it('should call beforeUpdate and afterUpdate during update', () => {
    const beforeUpdateMock = jest.spyOn(component, 'beforeUpdate');
    const afterUpdateMock = jest.spyOn(component, 'afterUpdate');
    component.setState({ someState: 'value' });

    expect(beforeUpdateMock).toHaveBeenCalled();
    expect(afterUpdateMock).toHaveBeenCalled();

    beforeUpdateMock.mockRestore();
    afterUpdateMock.mockRestore();
  });

  it('should call beforeUnmount during remove', () => {
    const beforeUnmountMock = jest.spyOn(component, 'beforeUnmount');
    component.render();
    component.remove();

    expect(beforeUnmountMock).toHaveBeenCalled();

    beforeUnmountMock.mockRestore();
  });

  it('should resolve target element correctly', () => {
    const targetElement = document.createElement('div');
    document.body.appendChild(targetElement);
    const component2 = new Component('span');
    component2.render({ target: targetElement });
    expect(targetElement.contains(component2.element)).toBe(true);
    component2.remove();
    targetElement.remove();
  });

  it('should resolve target element from Component instance', () => {
    const targetComponent = new Component('div');
    document.body.appendChild(targetComponent.element);
    const component2 = new Component('span');
    component2.render({ target: targetComponent });
    expect(targetComponent.element.contains(component2.element)).toBe(true);
    component2.remove();
    targetComponent.remove();
  });

  it('should throw an error if target is null or undefined', () => {
    expect(() => {
      component.render({ target: null });
    }).toThrow(Error);
  });

  it('should throw an error if target is not found', () => {
    expect(() => {
      component.render({ target: '#nonExistentElement' });
    }).toThrow(Error);
  });

  it('should remove all event listeners on remove', () => {
    const eventListener = jest.fn();
    component.addEventListener('click', eventListener);
    component.render();
    component.remove();
    component.element.click();
    expect(eventListener).not.toHaveBeenCalled();
  });

  it('should append a single element to the component', () => {
    const childElement = document.createElement('span');
    component.append(childElement);
    expect(component.element.contains(childElement)).toBe(true);
  });

  it('should append multiple elements to the component', () => {
    const childElement1 = document.createElement('span');
    const childElement2 = document.createElement('p');
    component.append([childElement1, childElement2]);
    expect(component.element.contains(childElement1)).toBe(true);
    expect(component.element.contains(childElement2)).toBe(true);
  });

  it('should set text content of the component', () => {
    const textContent = 'Some text content';
    component.setText(textContent);
    expect(component.element.textContent).toBe(textContent);
  });

  it('should set styles of the component', () => {
    const styles = {
      color: 'red',
      backgroundColor: 'blue'
    };
    component.setStyle(styles);
    expect(component.element.style.color).toBe(styles.color);
    expect(component.element.style.backgroundColor).toBe(styles.backgroundColor);
  });

  it('should append the component to a specified parent element', () => {
    const parentElement = document.createElement('div');
    document.body.appendChild(parentElement);
    component.appendTo(parentElement);
    expect(parentElement.contains(component.element)).toBe(true);
    parentElement.remove();
  });

  it('should throw an error if appendTo is called with a null or undefined parent', () => {
    expect(() => {
      component.appendTo(null);
    }).toThrow(Error);
  });

  it('should add and remove event listeners', () => {
    const eventListener = jest.fn();
    component.addEventListener('click', eventListener);
    component.element.click();
    expect(eventListener).toHaveBeenCalledTimes(1);

    component.removeEventListener('click', eventListener);
    component.element.click();
    expect(eventListener).toHaveBeenCalledTimes(1); // Should still be 1, not called again
  });

  it('should clear all event listeners', () => {
    const eventListener1 = jest.fn();
    const eventListener2 = jest.fn();
    component.addEventListener('click', eventListener1);
    component.addEventListener('mouseover', eventListener2);

    component.clearEventListeners();
    component.element.click();
    component.element.dispatchEvent(new MouseEvent('mouseover'));

    expect(eventListener1).not.toHaveBeenCalled();
    expect(eventListener2).not.toHaveBeenCalled();
  });

  it('should toggle a class on the component', () => {
    component.toggleClass('toggle-class');
    expect(component.element.classList.contains('toggle-class')).toBe(true);
    component.toggleClass('toggle-class');
    expect(component.element.classList.contains('toggle-class')).toBe(false);
  });

  it('should set class list as a string', () => {
    component.setClassList('string-class');
    expect(component.element.className).toBe('string-class');
  });

  it('should render the component before another element', () => {
    const targetElement = document.createElement('div');
    const referenceElement = document.createElement('span');
    targetElement.appendChild(referenceElement);
    document.body.appendChild(targetElement);

    component.render({ target: targetElement, method: 'before', reference: referenceElement });
    expect(targetElement.firstChild).toBe(component.element);
    expect(component.element.nextSibling).toBe(referenceElement);

    targetElement.remove();
  });

  it('should render the component replacing another element', () => {
    const targetElement = document.createElement('div');
    const referenceElement = document.createElement('span');
    targetElement.appendChild(referenceElement);
    document.body.appendChild(targetElement);

    component.render({ target: targetElement, method: 'replace', reference: referenceElement });
    expect(targetElement.firstChild).toBe(component.element);
    expect(targetElement.contains(referenceElement)).toBe(false);

    targetElement.remove();
  });

  it('should render the component before a sibling', () => {
    const targetElement = document.createElement('div');
    const siblingElement = document.createElement('span');
    targetElement.appendChild(siblingElement);
    document.body.appendChild(targetElement);

    component.render({ target: siblingElement, method: 'beforeSibling' });
    expect(targetElement.firstChild).toBe(component.element);
    expect(component.element.nextSibling).toBe(siblingElement);

    targetElement.remove();
  });

  it('should render the component after a sibling', () => {
    const targetElement = document.createElement('div');
    const siblingElement = document.createElement('span');
    targetElement.appendChild(siblingElement);
    document.body.appendChild(targetElement);

    component.render({ target: siblingElement, method: 'afterSibling' });
    expect(siblingElement.nextSibling).toBe(component.element);

    targetElement.remove();
  });

  it('should throw an error for invalid render method', () => {
    const targetElement = document.createElement('div');
    document.body.appendChild(targetElement);

    expect(() => {
      component.render({ target: targetElement, method: 'invalidMethod' });
    }).toThrow(Error);

    targetElement.remove();
  });

  it('should throw an error if reference element is missing for "before" method', () => {
    const targetElement = document.createElement('div');
    document.body.appendChild(targetElement);

    expect(() => {
      component.render({ target: targetElement, method: 'before' });
    }).toThrow(Error);

    targetElement.remove();
  });

  it('should throw an error if reference element is missing for "replace" method', () => {
    const targetElement = document.createElement('div');
    document.body.appendChild(targetElement);

    expect(() => {
      component.render({ target: targetElement, method: 'replace' });
    }).toThrow(Error);

    targetElement.remove();
  });

  it('should throw an error if target does not have a parent for "beforeSibling" method', () => {
    const targetElement = document.createElement('div');

    expect(() => {
      component.render({ target: targetElement, method: 'beforeSibling' });
    }).toThrow(Error);
  });

  it('should throw an error if target does not have a parent for "afterSibling" method', () => {
    const targetElement = document.createElement('div');

    expect(() => {
      component.render({ target: targetElement, method: 'afterSibling' });
    }).toThrow(Error);
  });

  it('should set content with a HTMLElement', () => {
    const element = document.createElement('p');
    element.textContent = 'Some text';
    component.setContent(element);
    expect(component.element.firstChild).toBe(element);
  });

  it('should set content with a Component', () => {
    const childComponent = new Component('p');
    childComponent.setText('Some text');
    component.setContent(childComponent);
    expect(component.element.firstChild).toBe(childComponent.element);
  });

  it('should throw an error if setContent is called with an invalid type', () => {
    expect(() => {
      component.setContent(123);
    }).toThrow(Error);
  });
});

describe('DOMUtil', () => {
  it('should resolve an element from a selector', () => {
    const element = document.createElement('div');
    element.id = 'test-element';
    document.body.appendChild(element);
    const resolvedElement = DOMUtil.resolveElement('#test-element');
    expect(resolvedElement).toBe(element);
    element.remove();
  });

  it('should throw an error if no element is found for the selector', () => {
    expect(() => {
      DOMUtil.resolveElement('#non-existent-element');
    }).toThrow(Error);
  });

  it('should resolve an element from an HTMLElement', () => {
    const element = document.createElement('div');
    const resolvedElement = DOMUtil.resolveElement(element);
    expect(resolvedElement).toBe(element);
  });

  it('should resolve an element from a Component', () => {
    const component = new Component('div');
    const resolvedElement = DOMUtil.resolveElement(component);
    expect(resolvedElement).toBe(component.element);
  });

  it('should create a new HTMLElement', () => {
    const element = DOMUtil.createElement('span');
    expect(element.tagName).toBe('SPAN');
  });
});