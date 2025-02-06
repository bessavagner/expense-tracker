import { Component } from '../engine/core.js';

export class Modal extends Component {
    constructor() {
        super('div', 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden');
    }

    open() {
        this.removeClass('hidden');
    }

    close() {
        this.addClass('hidden');
    }

    toggle() {
        this.toggleClass('hidden');
    }
}
