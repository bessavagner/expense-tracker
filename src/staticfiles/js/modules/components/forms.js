import { Component } from "../engine/core.js";
import { Button } from "./actions.js";
import { safeFetch } from "../tools.js";

export class Input extends Component {
    /**
     * Creates an Input component.
     * @param {Object} options - Configuration options for the input.
     * @param {string} [options.type='text'] - The type of the input.
     * @param {string|Array<string>|null} [options.classList=null] - Optional class names to apply to the div container.
     * @param {Object.<string, string>} [options.attributes={}] - Attributes to set on the input element.  Must include `id` and `name`.
     * @param {string} [options.labelText=''] - The text for the label.
     * @param {string|Array<string>|null} [options.labelClassList=null] - Optional class names to apply to the label.
     */
    constructor({ type = 'text', classList = null, attributes = {}, labelText = '', labelClassList = null }) {
        super('div', classList);

        if (!attributes.id || !attributes.name) {
            throw new Error('Input must have an id and a name');
        }

        this.label = new Component('label', labelClassList).setText(labelText);
        this.label.setAttribute('for', attributes.id); // Ensure label 'for' matches input 'id'

        this.input = new Component('input')
            .setAttribute('type', type)
            .setAttributes(attributes); // Set all attributes, including type

        this.append([this.label, this.input]); // Append in the correct order
    }

    /**
     * Sets the label text.
     * @param {string} text - The new label text.
     * @returns {Input} This Input instance for chaining.
     */
    setLabelText(text) {
        this.label.setText(text);
        return this;
    }

    /**
     * Gets the current value of the input.
     * @returns {string} The input value.
     */
    getValue() {
        return this.input.element.value;
    }

    /**
     * Sets the value of the input.
     * @param {string} value - The new input value.
     * @returns {Input} This Input instance for chaining.
     */
    setValue(value) {
        this.input.setAttribute('value', value);
        return this;
    }

    /**
     * Disables the input.
     * @returns {Input} This Input instance for chaining.
     */
    disable() {
        this.input.setAttribute('disabled', 'disabled');
        return this;
    }

    /**
     * Enables the input.
     * @returns {Input} This Input instance for chaining.
     */
    enable() {
        this.input.element.removeAttribute('disabled');
        return this;
    }
}


export class Select extends Component {
    /**
     * Creates a Select component.
     * @param {Object} options - Configuration options for the select.
     * @param {string|Array<string>|null} [options.classList=null] - Optional class names to apply to the div container.
     * @param {Object.<string, string>} [options.attributes={}] - Attributes to set on the select element. Must include `id` and `name`.
     * @param {string} [options.labelText=''] - The text for the label.
     * @param {string|Array<string>|null} [options.labelClassList=null] - Optional class names to apply to the label.
     * @param {Array<{value: string, text: string}>} [options.options=[]] - Initial options for the select.
     */
    constructor({ classList = null, attributes = {}, labelText = '', labelClassList = null, options = [] }) {
        super('div', classList);

        if (!attributes.id || !attributes.name) {
            throw new Error('Select must have an id and a name');
        }

        this.label = new Component('label', labelClassList).setText(labelText);
        this.label.setAttribute('for', attributes.id); // Ensure label 'for' matches select 'id'

        this.select = new Component('select').setAttributes(attributes);

        this.append([this.label, this.select]);

        this.options = []; // Store option data

        options.forEach(option => this.addOption(option));
    }

    /**
     * Sets the label text.
     * @param {string} text - The new label text.
     * @returns {Select} This Select instance for chaining.
     */
    setLabelText(text) {
        this.label.setText(text);
        return this;
    }

    /**
     * Adds an option to the select.
     * @param {Object} option - The option to add.
     * @param {string} option.value - The value of the option.
     * @param {string} option.text - The text of the option.
     * @returns {Select} This Select instance for chaining.
     */
    addOption({ value, text }) {
        const option = new Component('option')
            .setAttribute('value', value)
            .setText(text);
        this.options.push({ value, text }); // Store option data
        this.select.append(option);
        return this;
    }

    /**
     * Removes all options from the select.
     * @returns {Select} This Select instance for chaining.
     */
    clearOptions() {
        this.options = [];
        this.select.setContent('');
        return this;
    }

    /**
     * Sets the options for the select, replacing any existing options.
     * @param {Array<{value: string, text: string}>} options - The new options.
     * @returns {Select} This Select instance for chaining.
     */
    setOptions(options) {
        this.clearOptions();
        options.forEach(option => this.addOption(option));
        return this;
    }

    /**
     * Gets the currently selected value.
     * @returns {string} The selected value.
     */
    getValue() {
        return this.select.element.value;
    }

    /**
     * Sets the selected value.
     * @param {string} value - The value to select.
     * @returns {Select} This Select instance for chaining.
     */
    setValue(value) {
        this.select.element.value = value;
        return this;
    }

    /**
     * Disables the select.
     * @returns {Select} This Select instance for chaining.
     */
    disable() {
        this.select.setAttribute('disabled', 'disabled');
        return this;
    }

    /**
     * Enables the select.
     * @returns {Select} This Select instance for chaining.
     */
    enable() {
        this.select.element.removeAttribute('disabled');
        return this;
    }
}

export class Form extends Component {
    /**
     * Creates a Form component.
     * @param {Object} options - Configuration options for the form.
     * @param {HTMLElement|string|Component|Node} [options.target] - The target element to render the form into.
     * @param {string|Array<string>|null} [options.classList=null] - Optional class names to apply to the form.
     */
    constructor({ target, classList = null }) {
        super('form', classList);
        this.buttonsWrapper = new Component('div');
        this.buttonsWrapper.setStyle({ display: "flex", flexDirection: "row", justifyContent: "flex-end", gap: "0.5rem" });
        this.append(this.buttonsWrapper);
        this.hasSubmitButton = false;

        if (target) {
            this.render({ target: target });
        }
    }

    /**
     * Adds an input to the form.
     * @param {Object} options - Configuration options for the input.  See `Input` constructor.
     * @returns {Input}
     */
    addInput(options) {
        const input = new Input(options);
        this.insertBeforeButtons(input);
        return input
    }

    /**
     * Adds multiple inputs to the form.
     * @param {Array<Object>} inputs - An array of input configuration objects.  See `Input` constructor.
     * @returns {Array<Input>}
     */
    addInputs(inputs) {
        const _inputs = [];
        inputs.forEach(input => {this.addInput(input); _inputs.push(input)});
        return _inputs;
    }

    /**
     * Adds a select to the form.
     * @param {Object} options - Configuration options for the select. See `Select` constructor.
     * @returns {Select} This Form instance for chaining.
     */
    addSelect(options) {
        const select = new Select(options);
        this.insertBeforeButtons(select);
        return select;
    }

    /**
     * Adds multiple selects to the form.
     * @param {Array<Object>} selects - An array of select configuration objects. See `Select` constructor.
     * @returns {Array<Select>} This Form instance for chaining.
     */
    addSelects(selects) {
        const _selects = [];
        selects.forEach(select => {this.addSelect(select); _selects.push(select)});
        return _selects;
    }

    /**
     * Adds a button to the form.
     * @param {Object} options - Configuration options for the button. See `Button` constructor.
     * @returns {Button} This Form instance for chaining.
     */
    addButton(options) {
        const button = new Button(options);
        if (options.type && options.type === 'submit') {
            this.hasSubmitButton = true;
        }
        this.buttonsWrapper.append(button);
        return button;
    }

    /**
     * Inserts a component before the buttons wrapper.
     * @param {Component} component - The component to insert.
     */
    insertBeforeButtons(component) {
        component.render({ target: this, method: "before", reference: this.buttonsWrapper.element });
    }

    /**
     * Checks if the form has a submit button.
     * @private
     * @returns {boolean} True if the form has a submit button, false otherwise.
     */
    _hasSubmitButton() {
        for (const button of this.buttonsWrapper.element.children) {
            if (button.getAttribute('type') === 'submit') {
                this.hasSubmitButton = true;
                return this.hasSubmitButton;
            }
        }
        this.hasSubmitButton = false;
        return this.hasSubmitButton;
    }

    /**
     * Listens for the form's submit event and handles the submission.
     * @param {string} path - The URL to submit the form data to.
     * @returns {Form} This Form instance for chaining.
     */
    listen(path) {
        if (!this._hasSubmitButton()) {
            throw new Error('Form must have a submit button');
        }

        this.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const requestInit = {
                method: 'POST',
                body: formData
            };
            const options = {requestInit: requestInit};
            const data = await safeFetch(path, options);
            if (data.status === 'success') {
                if (data.message) {
                    alert(data.message);
                }
                e.target.reset();
            } else {
                alert('Erro: ' + JSON.stringify(data.errors));
            }
        });
        return this;
    }

    /**
     * Resets the form to its initial state.
     * @returns {Form} This Form instance for chaining.
     */
    reset() {
        this.element.reset();
        return this;
    }
}