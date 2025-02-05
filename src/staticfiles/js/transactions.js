document.addEventListener('DOMContentLoaded', function () {
    const addTransactionBtn = document.getElementById('add-transaction-btn');
    const viewTransactionsBtn = document.getElementById('view-transactions-btn');
    const addTransactionModal = document.getElementById('add-transaction-modal');
    const viewTransactionsModal = document.getElementById('view-transactions-modal');
    const cancelBtn = document.getElementById('cancel-btn');
    const closeViewModalBtn = document.getElementById('close-view-modal-btn');
    const transactionForm = document.getElementById('transaction-form');
    const transactionsTableBody = document.querySelector('#transactions-table tbody');

    // Abrir pop-up de adicionar transação
    addTransactionBtn.addEventListener('click', () => {
        addTransactionModal.classList.remove('hidden');
    });

    // Fechar pop-up de adicionar transação
    cancelBtn.addEventListener('click', () => {
        addTransactionModal.classList.add('hidden');
    });

    // Abrir pop-up de visualizar transações
    viewTransactionsBtn.addEventListener('click', async () => {
        viewTransactionsModal.classList.remove('hidden');
        await loadTransactions();
    });

    // Fechar pop-up de visualizar transações
    closeViewModalBtn.addEventListener('click', () => {
        viewTransactionsModal.classList.add('hidden');
    });

    // Enviar formulário de transação via AJAX
    transactionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(transactionForm);
        const response = await fetch('/transactions/create/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
            },
            body: formData,
        });
        const data = await response.json();
        if (data.status === 'success') {
            alert(data.message);
            addTransactionModal.classList.add('hidden');
            transactionForm.reset();
        } else {
            alert('Erro: ' + JSON.stringify(data.errors));
        }
    });

    // Carregar transações na tabela
    async function loadTransactions() {
        const response = await fetch('/transactions/list/');
        const data = await response.json();
        transactionsTableBody.innerHTML = '';
        data.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-4 py-2">${transaction.description}</td>
                <td class="px-4 py-2">${transaction.amount}</td>
                <td class="px-4 py-2">${transaction.date}</td>
                <td class="px-4 py-2">${transaction.payment_method}</td>
                <td class="px-4 py-2">${transaction.transaction_type}</td>
            `;
            transactionsTableBody.appendChild(row);
        });
    }
});