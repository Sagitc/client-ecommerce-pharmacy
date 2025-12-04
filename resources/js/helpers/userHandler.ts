import axios from 'axios';
import type { User } from '../types/user.interface';

// --- ESTADO INTERNO ---

let currentUser: User | null = null;

const LISTENERS: Function[] = [];


// --- OBSERVER PATTERN ---


/**
 * Adiciona uma função de callback para ser executada quando o carrinho mudar.
 * @param listener A função de callback que reage à mudança de estado
 */
export function subscribe(listener: Function): void {
    LISTENERS.push(listener);
}

/**
 * Remove uma função de callback da lista de ouvintes do carrinho.
 * @param listener A função de callback a ser removida
 */
export function unsubscribe(listener: Function): void {
    const index = LISTENERS.indexOf(listener);
    if (index > -1) {
        LISTENERS.splice(index, 1);
    }
}

/**
 * Notifica todos os ouvintes registrados sobre uma mudança no carrinho.
 */
function notifyListeners(): void {
    LISTENERS.forEach(listener => listener());
}


// --- LÓGICA E GETTERS ---


/**
 * Retorna uma cópia do perfil do usuário atual ou null se não houver usuário logado.
 * @returns Uma cópia do objeto User ou null. 
 */
export function getUserProfile(): User | null {
    return currentUser ? { ...currentUser } : null;
}

/**
 * Verifica se um usuário está logado.
 * @returns Retorna true se um usuário estiver logado, caso contrário, false.
 */
export function isLoggedIn(): boolean {
    return currentUser !== null;
}

/**
 * Retorna o ID do usuário, se estiver logado.
 */
export function getUserId(): number | null {
    return currentUser?.id ?? null;
}


// --- STATE MODIFIERS ---


/**
 * Define o perfil do usuário atual.
 * @param profile O objeto User representando o perfil do usuário.
 */
export function setUser(profile: User): void {
    currentUser = profile;
    notifyListeners();
}

/**
 * Limpa o perfil do usuário atual, efetivamente fazendo logout.
 */
export function clearUser(): void {
    currentUser = null;
    notifyListeners();
}