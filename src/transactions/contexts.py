from django.utils.translation import gettext_lazy as _

TRANSACTION_FORM_INPUTS = {
    "description": {
        "labelText": _("Description"),
    },
    "amount": {
        "labelText": _("Amount"),
    },
    "date": {
        "labelText": _("Date"),
    },
    "payment_method": {
        "labelText": _("Payment Method"),
        "options": {
            "pix": "Pix",
            "dinheiro": _("Cash"),
            "debito": _("Debit"),
        }
    },
    "transaction_type": {
        "labelText": _("Transaction Type"),
        "options": {
            "expense": _("Expense"),
            "income": _("Income"),
            "transfer": _("Transfer"),
        }
    },
    "cancel": {
        "text": _("Cancel"),
    },
    "create": {
        "text": _("Create"),
    },
    "view": {
        "text": _("View"),
    }
}
