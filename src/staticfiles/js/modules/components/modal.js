import { Component } from '../engine/core.js';

export class Modal extends Component {
/**
 * Initializes a Modal component.
 * @param {string|Array<string>|null} [classList=null] - Optional class names to apply to the modal.
 */
    constructor(classList = null) {
        super('div', classList);
        this.setStyle({ display: 'none', position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)' });
    }

    open() {
        if (!this._isMounted) {
            this.render({ target: document.body });
            return this;
        }
        this.setStyle({ display: 'block' });
    }

    close() {
        this.setStyle({ display: 'none' });
    }
}
