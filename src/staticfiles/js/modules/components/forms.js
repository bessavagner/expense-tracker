import { Component } from "../engine/core.js";
import { Button } from "./actions.js";


export class Input extends Component {
    constructor({ type = 'text', classList = null, attributes = {}, labelText = '', labelClassList = null }) {
        super('div', classList);
        this.input = new Component('input').setAttribute('type', type);
        if (!attributes.id && !attributes.name) {
            throw new Error('Input must have an id and a name');
        }
        if (attributes) {
            if (attributes.type) {
                delete attributes.type;
            }
            this.input.setAttributes(attributes);
        }
        this.label = new Component('label', labelClassList).setText(labelText);
        this.label.setAttribute('for', this.input.element.id);
        this.setClassList(classList);
    }

    /**
     * Renders the input and label into the parent component.
     * @param {HTMLElement|Component} parent - The parent element or component to render into.
     * @returns {Input} This Input instance for chaining.
     */
    renderInto(parent) {
        this.render({ target: parent });
        this.label.render({ target: this });
        this.input.render({ target: this });
        return this;
    }

    setLabelText(text) {
        this.label.setText(text);
        return this;
    }
}

export class Select extends Component {
    constructor({ classList = null, attributes = {}, labelText = '', labelClassList = null }) {
        super('div', classList);
        this.select = new Component('select');
        if (!attributes.id && !attributes.name) {
            throw new Error('Select must have an id and a name');
        }
        if (attributes) {
            this.select.setAttributes(attributes);
        }
        this.label = new Component('label', labelClassList).setText(labelText);
        this.label.setAttribute('for', this.select.element.id);
        this.options = [];
        this.setClassList(classList);
    }

    /**
     * Renders the select and label into the parent component.
     * @param {HTMLElement|Component} parent - The parent element or component to render into.
     * @returns {Select} This Select instance for chaining.
     */
    renderInto(parent) {
        this.render({ target: parent });
        this.label.render({ target: this });
        this.select.render({ target: this });
        return this;
    }

    setLabelText(text) {
        this.label.setText(text);
        return this;
    }

    addOption({ value, text }) {
        const option = new Component('option')
            .setAttribute('value', value)
            .setText(text);
        this.options.push(option);
        option.render({ target: this.select });
        return this;
    }
}

export class Form extends Component {
    constructor({ classList = null }) {
        super('form', classList);
        this.buttonsWrapper = new Component('div', 'flex justify-end space-x-2');
        this.hasSubmitButton = false;
    }

    addInput({ type = 'text', classList = null, attributes = {}, labelText = '', labelClassList = null }) {
        const input = new Input({ type, classList, attributes, labelText, labelClassList });
        input.renderInto(this);
        return this;
    }

    addInputs(inputs) {
        inputs.forEach(input => this.addInput(input));
        return this;
    }

    addSelect({ options, classList = null, attributes = {}, labelText = '', labelClassList = null }) {
        const select = new Select({ classList, attributes, labelText, labelClassList });
        options.forEach(option => select.addOption(option));
        select.renderInto(this);
        return this;
    }

    addSelects(selects) {
        selects.forEach(select => this.addSelect(select));
        return this;
    }

    addButton({ classList = null, attributes = {}, text = '' }) {
        const button = new Button({ classList, attributes, text });
        button.render({ target: this.buttonsWrapper });
        return this;
    }

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
     * Renders the form into the specified target.
     * @param {HTMLElement|Component} target - The parent element or component to render into.
     * @returns {Form} This Form instance for chaining.
     */
    renderInto(target) {
        this.render({ target: target });
        this.buttonsWrapper.render({ target: this });
        return this;
    }
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
            const csrfmiddlewaretoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            if (csrfmiddlewaretoken) {
                requestInit.headers = {
                    'X-CSRFToken': csrfmiddlewaretoken
                };
            }
            const response = await fetch(path, requestInit);
            const data = await response.json();
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
}