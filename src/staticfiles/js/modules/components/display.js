//@ts-check

import { Component } from "../engine/core.js";
import { Button } from "./actions.js";


export class ButtonsPanel extends Component {
  /**
   * Initializes a new ButtonsPanel component.
   * @param {Object} options - Configuration options for the buttons panel.
   * @param {string|Array<string>|null} [options.classList=null] - Optional class names to apply to the div container.
   * @param {number|null} [options.buttonsLimit=null] - The maximum number of buttons allowed in the panel.
   */
  constructor({ classList = null, buttonsLimit = null }) {
    super("div", classList);
    this.buttons = [];
    this.buttonsLimit = buttonsLimit;
    this.setState({ buttonsCount: 0 });
  }
  /**
   * Adds a button to the table.
   * @param {Object} options - Configuration options for the button. See `Button` constructor.
   * @returns {Button|undefined} The created button instance.
   */
  addButton(options) {
    if (this.buttonsLimit && this.state.buttonsCount >= this.buttonsLimit) {
        console.warn("Maximum number of buttons reached.");
        return undefined;
    }
    const button = new Button(options);
    this.buttons.push(button);
    this.setState({ buttonsCount: this.buttons.length });
    return button;
  }
  /**
   * Removes a button from the table.
   * @param {number} buttonIndex - The index of the button to remove.
   */
  removeButton(buttonIndex) {
    this.buttons.splice(buttonIndex, 1)[0].remove();
    this.setState({ buttonsCount: this.buttons.length });
  }
  beforeUnmount() {
    this.buttons.forEach(button => button.remove());
  }
}

export class Table extends Component {
  /**
   * Creates a new Table instance.
   * @param {Object} options - Configuration options for the table.
   * @param {Array<string>} options.columns - The column names.
   * @param {Array<object>} [options.data=[]] - Initial data for the table.
   * @param {Array<string>|string|null} [options.classList=null] - Optional class names to apply to the element.
   */
  constructor(options) {
    super("table", options.classList);

    this.columns = options.columns;
    this.data = options.data || [];
    this.thead = new Component("thead").appendTo(this);
    this.tbody = new Component("tbody").appendTo(this);

    this.createHeader();
    this.renderContent(); // Render initial data
  }

  /**
   * Creates the table header based on the provided columns.
   */
  createHeader() {
    const headerRow = new Component("tr");
    this.columns.forEach((column) => {
      headerRow.append(new Component("th").setText(column));
    });
    this.thead.setContent(headerRow); // Use setContent for better update handling
  }

  /**
   * Adds a single row of data to the table.
   * @param {object} rowData - An object containing the data for the new row.  Keys should match column names.
   */
  addRow(rowData) {
    if (Object.keys(rowData).length !== this.columns.length) {
        throw new Error("Row data does not match the number of columns.");
    }
    this.data.push(rowData);
    this.renderContent(); // Re-render for efficiency
  }

  /**
   * Sets the table data, replacing any existing data.
   * @param {Array<object>} data - An array of objects, where each object represents a row of data.
   */
  setData(data) {
    this.data = data;
    this.renderContent();
  }

  beforeUpdate() {
    this.tbody.setContent(''); // Clear existing content
  }
  beforeUnmount() {
    this.clear();
  }
  /**
   * Clears all data from the table body.
   */
  clear() {
    this.data = [];
    this.renderContent(); // Re-render with empty data
  }

  /**
   * Override renderContent to update the table when the component's state changes.
   */
  renderContent() {
    this.tbody.setContent('');
    this.data.forEach(rowData => {
        const row = new Component("tr");
        this.columns.forEach(column => {
            const data = rowData[column] ?? '';
            row.append(new Component("td").setText(data));
        });
        this.tbody.append(row);
    });
  }
}