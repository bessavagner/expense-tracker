import { Component } from "../base.js";
import { Button } from "./actions.js";


export class Input extends Component {
    constructor({type = 'text', classList = null, attributes = {}, labelText = '', labelClassList = null}) {
        super('div', classList);
        this.input = new Component('input').setAttribute('type', type);
        if (!attributes.id && !attributes.name) {
            throw new Error('Input must have an id and a name');
        }
        if (attributes) {
            if (attributes.type) {
                delete attributes.type;
            }
            this.input.setAtributes(attributes);
        }
        this.label = new Component('label', labelClassList).setText(labelText);
        this.label.setAttribute('for', this.input.element.id);
        this.label.render({target: this});
        this.input.render({target: this});
        this.setClassList(classList);
    }
    setLabelText(text) {
        this.label.setText(text);
    }
}

export class Select extends Component {
    constructor({classList = null, attributes = {}, labelText = '', labelClassList = null}) {
        super('div', classList);
        this.select = new Component('select');
        if (!attributes.id && !attributes.name) {
            throw new Error('Select must have an id and a name');
        }
        if (attributes) {
            this.select.setAtributes(attributes);
        }
        this.label = new Component('label', labelClassList).setText(labelText);
        this.label.setAttribute('for', this.select.element.id);
        this.label.render({target: this});
        this.select.render({target: this});
        this.options = [];
        this.setClassList(classList);
    }
    setLabelText(text) {
        this.label.setText(text);
    }
    addOption({value, text}) {
        const option = new Component('option')
            .setAttribute('value', value)
            .setText(text);
        this.options.push(option);
        option.render({target: this.select});
        return this;
    }
}

export class Form extends Component {
    constructor({target, classList = null}) {
        super('form', classList);
        this.setClassList(classList);
        this.buttonsWrapper = new Component('div', 'flex justify-end space-x-2');
        this.buttonsWrapper.render({target: this});
        this.hasSubmitButton = false;
        this.render({target: target});
    }
    addInput({type = 'text', classList = null, attributes = {}, labelText = '', labelClassList = null}) {
        const input = new Input({type, classList, attributes, labelText, labelClassList});
        input.render({target: this, method: "beforeSibling", reference: this.buttonsWrapper.element});
        return this;
    }
    addInputs(inputs) {
        inputs.forEach(input => this.addInput(input));
        return this;
    }
    addSelect({options, classList = null, attributes = {}, labelText = '', labelClassList = null}) {
        const select = new Select({classList, attributes, labelText, labelClassList});
        options.forEach(option => select.addOption(option));
        select.render({target: this, method: "beforeSibling", reference: this.buttonsWrapper.element});
        return this;
    }
    addSelects(selects) {
        selects.forEach(select => this.addSelect(select));
        return this;
    }
    addButton({classList = null, attributes = {}, text = ''}) {
        const button = new Button({classList, attributes, text});
        button.render({target: this.buttonsWrapper});
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