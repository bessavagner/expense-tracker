export const inputs = [
  {
    type: "text",
    classList: "mb-4",
    attributes: {
      name: "description",
      id: "description",
      class: "t-1 block w-full rounded-md border-gray-300 shadow-sm",
    },
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
    labelCLassList: "block text-sm font-medium text-gray-700",
  },
];

export const selects = [
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
    ],
  },
];
