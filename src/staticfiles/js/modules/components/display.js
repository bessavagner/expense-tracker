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
    this.thead = new Component("thead").render({ target: this });
    this.tbody = new Component("tbody").render({ target: this });
    this.createHeader();
  }

  // Method to create the table header
  createHeader() {
    const headerRow = new Component("tr");
    this.columns.forEach((column) => {
      new Component("th").setText(column).render({ target: headerRow });
    });
    headerRow.render({ target: this.thead });
  }

  addRow(rowData) {
    if (rowData.length !== this.columns.length) {
      throw new Error("Row length does not match the number of columns.");
    }

    const row = new Component("tr"); // document.createElement("tr");
    rowData.forEach((data) => {
      const td = new Component("td").setText(data).render({ target: row });
    });
    row.render({ target: this.tbody });
  }
  clear() {
    this.tbody.setContent("");
  }
}
