export function cleanText(text) {
    // Remove accents using Unicode normalization
    text = text.normalize("NFD").replace(/[\u0300-\u036F]/g, "");
    // Lowercase and remove whitespace
    text = text.toLowerCase().replace(/\s+/g, " ");
    // Remove special characters and punctuations
    text = text.replace(/[^\w\s]/g, "");
    // Replace remaining spaces and punctuations with underscores
    text = text.replace(/[\s_\W]/g, "_");
    return text;
}

export function randomId(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export const sleep = ms => new Promise(r => setTimeout(r, ms));

export async function safeFetch(url, options) {
    const requestInit = options.requestInit || {};
    if (!requestInit.method) {
        requestInit.method = 'GET';
    }
    if (!requestInit.headers) {
        requestInit.headers = {};
    }

    if (options && options.sendCsrfmiddlewaretoken) {
        const csrfmiddlewaretoken = document.querySelector('[name=csrfmiddlewaretoken]')?.value; // Use optional chaining
        if (csrfmiddlewaretoken) {
            requestInit.headers = {
                'X-CSRFToken': csrfmiddlewaretoken
            };
        }
    }
    try {
        const response = await fetch(url, requestInit);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}