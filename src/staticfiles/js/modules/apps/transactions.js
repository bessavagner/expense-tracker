//@ts-check

import { Modal } from "../components/modal.js";
import { Form } from "../components/forms.js";
import { Table, ButtonsPanel } from "../components/display.js";
import { Component } from "../engine/core.js";
import { createTransactionContext } from "./contexts.js";

class CreateViewTransactionsBoard extends ButtonsPanel {
  /**
   * Initializes a new CreateViewTransactionsBoard component.
   * Creates a panel with two buttons and adds them to the component.
   * The buttons are: "Adicionar" and "Ver".
   * The buttons are wrapped in a div with class "flex max-w-4xl mb-4".
   */
  constructor() {
    super({classList: "flex flex-row justify-center max-w-4xl mx-auto mb-4", buttonsLimit: 2});
    this.createButton = this.addButton({ classList: "btn btn-primary w-32 mr-5"});
    this.viewButton = this.addButton({ classList: "btn btn-secondary w-32 ml-5"});
    this.buttonsWrapper = new Component("div", "flex flex-row");
    if (this.createButton && this.viewButton) {
      this.buttonsWrapper.append([this.createButton, this.viewButton]);
    } else {
      throw new Error("Something went wrong with buttons creation.");
    }
    this.append(this.buttonsWrapper);
  }
  /**
   * Adds an event listener for the "create" button.
   * @param {(event: Event) => void} callback - The callback function.
   */
  addCreateEventListener(callback) {
    this.createButton.addEventListener("click", callback);
  }
  /**
   * Adds an event listener for the "view" button.
   * @param {(event: Event) => void} callback - The callback function.
   */
  addViewEventListener(callback) {
    this.viewButton.addEventListener("click", callback);
  }
}

class CreateTransactionsForm extends Form {
  /**
   * Constructor for CreateTransactionsForm.
   * @constructor
   * @param {Object} [options] - Configuration options for the form.
   * @param {string} [options.classList] - CSS class names for the form.
   * @see Form
   */
  constructor() {
    super({classList: "space-y-4"});
    this.closeButton = null;
    this.createButton = null;
  }

/**
 * Renders the content of the CreateTransactionsForm.
 * @param {Object} options - Configuration options for rendering the form.
 * @param {Object} options.buttons - Button labels and configurations.
 * @param {string} options.buttons.cancelLabel - Label for the cancel button.
 * @param {string} options.buttons.createLabel - Label for the create button.
 * @param {Array<Object>} options.inputs - Input configurations to add to the form.
 * @param {Array<Object>} options.selects - Select configurations to add to the form.
 * @param {(event: Event) => void} options.closeCallback - Callback function for the close button click event.
 * @param {string} options.submitPath - URL path for form submission.
 * @throws Will throw an error if options are not provided.
 */
  renderContent(options) {
    if (!options) {
      throw new Error("Options is required");
    }
    this.closeButton = this.addButton({classList: "btn btn-secondary w-32 mr-4", text: options.buttons.cancelLabel, attributes: { type: "button", id: "close-form"} });
    this.createButton = this.addButton({classList: "btn btn-primary w-32 ml-4", text: options.buttons.createLabel, attributes: { type: "submit" }});
    this.addInputs(options.inputs);
    this.addSelects(options.selects);
    this.closeButton.addEventListener("click", options.closeCallback);
    this.listen(options.submitPath);
  }
}

class AppCreateTransactions {
  constructor() {
    this.form = new CreateTransactionsForm();
    this.formWrapper = new Component("div", "absolute top-1/2 -translate-y-1/2 left-1/2 transform -translate-x-1/2 bg-base-100 w-96 p-6 rounded-lg shadow-3xl")
    this.formWrapper.append(this.form);
    this.modal = new Modal()
    this.modal.append(this.formWrapper);
    this.context = {}
  }
  async _getContext() {
    this.context = await createTransactionContext();
  }
  async render() {
    await this._getContext();
    const formOptions = {
      inputs: this.context.inputs,
      selects: this.context.selects,
      buttons: {
        cancelLabel: this.context.cancel.text,
        createLabel: this.context.create.text
      },
      closeCallback: () => this.modal.close(),
      submitPath: "/transactions/create/"
    }
    this.form.renderContent(formOptions);
    this.modal.render({ target: document.body });
  }
}


class ListTransactionsModal {

}


export class AppTransactions {
  constructor(targetId) {
    if (!targetId) {
      throw new Error("Target ID is required");
    }
    const targetElement = document.getElementById(targetId);
    if (!targetElement) {
      throw new Error("Target element not found");
    }
    this.target = new Component(targetElement);
    this.panel = new CreateViewTransactionsBoard();
    this.target.append(this.panel);
    this.createTransactions = new AppCreateTransactions();
  }
  async render() {
    await this.createTransactions.render();
    this.panel.createButton
      .setText(this.createTransactions.context.create.text)
      .addEventListener("click", () => this.createTransactions.modal.open());
    this.panel.viewButton.setText(this.createTransactions.context.view.text);
  }
}
