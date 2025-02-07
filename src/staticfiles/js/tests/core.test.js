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
    component.remove(); // Clean up after each test
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