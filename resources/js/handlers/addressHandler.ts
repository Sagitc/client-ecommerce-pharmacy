

// --- ESTADO INTERNO ---

let addresses = [];
const listeners: Function[] = [];


// --- OBSERVER PATTERN ---


/**
 * Adiciona uma função de callback para ser executada quando o carrinho mudar.
 * @param listener A função de callback que reage à mudança de estado
 */
export function subscribe(listener: Function): void {
    listeners.push(listener);
}

/**
 * Remove uma função de callback da lista de ouvintes do carrinho.
 * @param listener A função de callback a ser removida
 */
export function unsubscribe(listener: Function): void {
    const index = listeners.indexOf(listener);
    if (index > -1) {
        listeners.splice(index, 1);
    }
}

/**
 * Notifica todos os ouvintes registrados sobre uma mudança no carrinho.
 */
function notifyListeners(): void {
    listeners.forEach(listener => listener());
}


// --- LÓGICA E GETTERS ---


