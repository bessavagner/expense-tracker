import { Component } from "./core.js";

function benchmarkRendering() {
    const start = performance.now();
    const component = new Component('div')
        .setText('Hello, World!')
        .render({ target: document.body });
    const end = performance.now();
    return { render: end - start };
}

function benchmarkEventHandling() {
    const component = new Component('button').setText('Click Me');

    const addStart = performance.now();
    component.addEventListener('click', () => console.log('Clicked!'));
    const addEnd = performance.now();

    const removeStart = performance.now();
    component.removeEventListener('click', () => console.log('Clicked!'));
    const removeEnd = performance.now();

    return {
        addEventListener: addEnd - addStart,
        removeEventListener: removeEnd - removeStart,
    };
}

function benchmarkDOMUpdates() {
    const component = new Component('div');

    const setContentStart = performance.now();
    component.setContent('<span>Updated Content</span>');
    const setContentEnd = performance.now();

    const setAttributesStart = performance.now();
    component.setAttributes({ id: 'test', class: 'container' });
    const setAttributesEnd = performance.now();

    return {
        setContent: setContentEnd - setContentStart,
        setAttributes: setAttributesEnd - setAttributesStart,
    };
}

async function runBenchmarks() {
    const results = {
        rendering: benchmarkRendering(),
        eventHandling: benchmarkEventHandling(),
        domUpdates: benchmarkDOMUpdates(),
    };

    // Send results to the Flask server
    const response = await fetch('/run-benchmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'component', results }),
    });

    if (!response.ok) {
        console.error('Failed to send benchmark results to the server');
    }

    return results;
}

function benchmarkVanillaRendering() {
    const start = performance.now();
    const div = document.createElement('div');
    div.textContent = 'Hello, World!';
    document.body.appendChild(div);
    const end = performance.now();
    return { render: end - start };
}

function benchmarkVanillaEventHandling() {
    const button = document.createElement('button');
    button.textContent = 'Click Me';

    const addStart = performance.now();
    button.addEventListener('click', () => console.log('Clicked!'));
    const addEnd = performance.now();

    const removeStart = performance.now();
    button.removeEventListener('click', () => console.log('Clicked!'));
    const removeEnd = performance.now();

    return {
        addEventListener: addEnd - addStart,
        removeEventListener: removeEnd - removeStart,
    };
}

function benchmarkVanillaDOMUpdates() {
    const div = document.createElement('div');

    const setContentStart = performance.now();
    div.innerHTML = '<span>Updated Content</span>';
    const setContentEnd = performance.now();

    const setAttributesStart = performance.now();
    div.setAttribute('id', 'test');
    div.setAttribute('class', 'container');
    const setAttributesEnd = performance.now();

    return {
        setContent: setContentEnd - setContentStart,
        setAttributes: setAttributesEnd - setAttributesStart,
    };
}

async function runVanillaBenchmarks() {
    const results = {
        rendering: benchmarkVanillaRendering(),
        eventHandling: benchmarkVanillaEventHandling(),
        domUpdates: benchmarkVanillaDOMUpdates(),
    };

    // Send results to the Flask server
    const response = await fetch('/run-benchmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'vanilla', results }),
    });

    if (!response.ok) {
        console.error('Failed to send vanilla benchmark results to the server');
    }

    return results;
}

// Expose runVanillaBenchmarks to the global scope for testing
window.runVanillaBenchmarks = runVanillaBenchmarks;

// Expose runBenchmarks to the global scope for testing
window.runBenchmarks = runBenchmarks;