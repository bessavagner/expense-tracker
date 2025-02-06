import { Component } from '../base.js';

export class Table extends Component {
    constructor(headers) {
        super('table', ['w-full']);
        this.headers = headers;
        this.renderHeaders();
    }

    renderHeaders() {
        const thead = new Component('thead');
        const headerRow = new Component('tr');
        this.headers.forEach(header => {
            const th = new Component('th', ['px-4', 'py-2']).setText(header);
            headerRow.appendTo(th);
        });
        thead.appendTo(headerRow);
        this.appendTo(thead);
    }

    addRow(data) {
        const row = new Component('tr');
        data.forEach(cell => {
            const td = new Component('td', ['px-4', 'py-2']).setText(cell);
            row.appendTo(td);
        });
        this.appendTo(row);
    }
}