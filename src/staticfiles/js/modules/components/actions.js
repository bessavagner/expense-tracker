import { Component } from "../base.js";

export class Button extends Component {
    constructor({classList = null, attributes = {}, text = ''}) {
        super('button', classList);
        this.setText(text);
        this.setAtributes(attributes);
    }
}
