import { Component } from "../engine/core.js";

export class Button extends Component {
    constructor({classList = null, attributes = {}, text = '', onClick = null}) {
        super('button', classList);
        this.setText(text);
        this.setAttributes(attributes);
        if (!attributes.onClick && onClick && typeof onClick === 'function') {
            if (attributes.onClick && typeof attributes.onClick === 'function') {
                console.warn("'onClick' argument overrides 'attributes.onClick'");
            }
            this.addEventListener('click', onClick);
        }
}
}
