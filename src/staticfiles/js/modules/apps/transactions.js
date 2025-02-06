import { Modal } from "../components/modal.js";
import { Form } from "../components/forms.js";
import { Button } from "../components/actions.js";
import { Component } from "../base.js";

class TransactionModal {
  constructor() {
    const inputs = [
      {
        type: "text",
        classList: "mb-4",
        attributes: {
          name: "description",
          id: "description",
          class: "t-1 block w-full rounded-md border-gray-300 shadow-sm",
        },
        labelText: "Descrição",
        labelCLassList: "block text-sm font-medium text-gray-700",
      },
      {
        type: "number",
        classList: "mb-4",
        attributes: {
          name: "amount",
          id: "amount",
          class: "t-1 block w-full rounded-md border-gray-300 shadow-sm",
          step: "0.01",
        },
        labelText: "Valor",
        labelCLassList: "block text-sm font-medium text-gray-700",
      },
      {
        type: "date",
        classList: "mb-4",
        attributes: {
          name: "date",
          id: "date",
          class: "t-1 block w-full rounded-md border-gray-300 shadow-sm",
        },
        labelText: "Data",
        labelCLassList: "block text-sm font-medium text-gray-700",
      },
    ];
    const selects = [
      {
        classList: "mb-4",
        attributes: { name: "payment_method", id: "payment_method" },
        labelText: "Método de Pagamento",
        labelClassList: "block text-sm font-medium text-gray-700",
        options: [
          { value: "pix", text: "Pix" },
          { value: "dinheiro", text: "Dinheiro" },
          { value: "debito", text: "Débito" },
        ],
      },
      {
        classList: "mb-4",
        attributes: { name: "transaction_type", id: "transaction_type" },
        labelText: "Tipo de Transação",
        labelClassList: "block text-sm font-medium text-gray-700",
        options: [
          { value: "expense", text: "Despesa" },
          { value: "income", text: "Saída" },
          { value: "transfer", text: "Transferência" },
        ]
      },
    ];

    this.modal = new Modal().render({ target: document.body });''
    this.formWrapper = new Component("div", "bg-base-100 w-96 p-6 rounded-lg shadow-3xl").render({ target: this.modal });
    this.form = new Form({target: this.formWrapper, classList: "space-y-4" })
      .setId("transaction-form")
      .addButton({ classList: "btn btn-secondary w-32 mr-4", text: "Cancelar", attributes: { type: "button", id: 'close-form-modal'} })
      .addButton({ classList: "btn btn-primary w-32 ml-4", text: "Criar", attributes: { type: "submit" } })
      .listen("/transactions/create/")
      .addInputs(inputs)
      .addSelects(selects);
    document.getElementById("close-form-modal").addEventListener("click", () => {
      this.modal.close();
    });
  }
}

export class AppTransactions extends TransactionModal {
  constructor(targetId) {
    if (!targetId) {
      throw new Error("Target ID is required");
    }
    super();
    this.addButton = new Button({
      classList: "btn btn-primary",
      attributes: { id: "add-transaction" },
      text: "Adicionar",
    }).addEventListener("click", () => {
      this.modal.open();
    })
    this.listButton = new Button({
      classList: "btn btn-secondary",
      attributes: { id: "view-transactions" },
      text: "Ver",
    });
    this.buttonsWrapper = new Component("div", "flex max-w-4xl mb-4");
    this.addButton.render({ target: this.buttonsWrapper });
    this.listButton.render({ target: this.buttonsWrapper });
    this.wrapper = new Component("div", "flex flex-col items-center");
    this.buttonsWrapper.render({ target: this.wrapper });
    this.wrapper.render({ target: `#${targetId}` });
  }
}
