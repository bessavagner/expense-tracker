import { AppTransactions } from "./modules/apps/transactions.js";

document.addEventListener('DOMContentLoaded', async function () {
    const app = new AppTransactions('App');
    await app.render();
    console.log(app.createTransactions.context);
});