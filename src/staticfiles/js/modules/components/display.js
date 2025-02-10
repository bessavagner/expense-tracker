import { Component } from "../engine/core.js";

export class Table extends Component {
  /**
   * Creates a new Table instance.
   * @param {Array<string>} columns - The columns names.
   * @param {Array<string>|string|null} [classList=null] - Optional class names to apply to the element.
   */
  constructor({ columns, classList = null }) {
    super("table", classList);
    this.columns = columns;
    this.thead = new Component("thead");
    this.tbody = new Component("tbody");
    this.append([this.thead, this.tbody])
    this.createHeader();
  }

  // Method to create the table header
  createHeader() {
    const headerRow = new Component("tr");
    this.columns.forEach((column) => {
      headerRow.append(new Component("th").setText(column));
    });
    this.thead.append(headerRow)
  }

  addRow(rowData) {
    if (rowData.length !== this.columns.length) {
      throw new Error("Row length does not match the number of columns.");
    }

    const row = new Component("tr");
    rowData.forEach((data) => {
      row.append(new Component("td").setText(data))
    });
    this.tbody.append(row)
  }
  clear() {
    this.tbody.setContent("");
  }
}
