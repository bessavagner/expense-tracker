import { safeFetch } from "../tools.js";
import { inputs as TRANSACTION_FORM_INPUTS } from "../../data/addTransactionsForm.js";
import { selects as TRANSACTION_FORM_SELECTS } from "../../data/addTransactionsForm.js";


export async function fetchTransactionContext() {
    const data = await safeFetch('/transactions/context/', {});
    return data;
}

export async function createTransactionContext() {
    const data = await fetchTransactionContext();
    const inputs = data.inputs.transactionsForm;
    TRANSACTION_FORM_INPUTS.forEach(input => {
      if (input.attributes.id === "description") {
        input.labelText = inputs.description.labelText;
      } else if (input.attributes.id === "amount") {
        input.labelText = inputs.amount.labelText;
      } else if (input.attributes.id === "date") {
        input.labelText = inputs.date.labelText;
      }
    });
    TRANSACTION_FORM_SELECTS.forEach(select => {
      if (select.attributes.id === "payment_method") {
        select.labelText = inputs.payment_method.labelText;
        if (select.options) {
          select.options.forEach(option => {
            if (option.value === "pix") {
              option.text = inputs.payment_method.options.pix;
            } else if (option.value === "dinheiro") {
              option.text = inputs.payment_method.options.dinheiro;
            } else if (option.value === "debito") {
              option.text = inputs.payment_method.options.debito;
            }
          })
        }
      } else if (select.attributes.id === "transaction_type") {
        select.labelText = inputs.transaction_type.labelText;
        if (select.options) {
          select.options.forEach(option => {
            if (option.value === "expense") {
              option.text = inputs.transaction_type.options.expense;
            } else if (option.value === "income") {
              option.text = inputs.transaction_type.options.income;
            } else if (option.value === "transfer") {
              option.text = inputs.transaction_type.options.transfer;
            }
          })
        }
      }
    });
    return {
        inputs: TRANSACTION_FORM_INPUTS,
        selects: TRANSACTION_FORM_SELECTS,
        cancel: inputs.cancel,
        close: inputs.close,
        create: inputs.create,
        view: inputs.view
    }
}