/**
 * Client-side PIN gate for entering edit mode.
 *
 * This is intentionally a SOFT, client-only control (not enforced by the API).
 * The PIN is stored as a salted SHA-256 hash in LocalSettings (localStorage).
 * A 4-digit PIN has a tiny keyspace, so the hash is not real security against a
 * determined attacker with devtools — it's a guard to keep an AAC user (often a
 * child or someone who shouldn't be rearranging their own board) out of edit mode.
 *
 * A shared lockout protects both PIN entry and the multiplication reset: 3 wrong
 * attempts (of either kind) triggers a 5-minute lockout. Failure count + lockout
 * timestamp persist in localStorage so the lockout survives a page reload.
 */

import { get } from 'svelte/store';
import { LocalSettings } from './stores';

export const PIN_LENGTH = 4;
export const MAX_PIN_ATTEMPTS = 3;
export const PIN_LOCKOUT_MS = 5 * 60 * 1000;

function toHex(buffer: ArrayBuffer): string {
	return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function hashPin(pin: string, salt: string): Promise<string> {
	const data = new TextEncoder().encode(`${salt}:${pin}`);
	const digest = await crypto.subtle.digest('SHA-256', data);
	return toHex(digest);
}

function randomSalt(): string {
	return toHex(crypto.getRandomValues(new Uint8Array(16)).buffer);
}

/** Set (or change) the edit PIN and enable the gate. Clears any lockout. */
export async function setPin(pin: string): Promise<void> {
	const salt = randomSalt();
	const editPinHash = await hashPin(pin, salt);
	LocalSettings.update((s) => ({
		...s,
		editPinEnabled: true,
		editPinHash,
		editPinSalt: salt,
		editPinFailureCount: 0,
		editPinLockoutUntil: 0
	}));
}

/** Turn the gate off and forget the stored PIN. */
export function disablePin(): void {
	LocalSettings.update((s) => ({
		...s,
		editPinEnabled: false,
		editPinHash: '',
		editPinSalt: '',
		editPinFailureCount: 0,
		editPinLockoutUntil: 0
	}));
}

export async function verifyPin(pin: string): Promise<boolean> {
	const s = get(LocalSettings);
	if (!s.editPinHash || !s.editPinSalt) return false;
	const candidate = await hashPin(pin, s.editPinSalt);
	// Constant-ish comparison; lengths are equal hex digests.
	return candidate === s.editPinHash;
}

/** Milliseconds remaining on the current lockout (0 if not locked out). */
export function lockoutRemainingMs(): number {
	const until = get(LocalSettings).editPinLockoutUntil || 0;
	return Math.max(0, until - Date.now());
}

/**
 * Record a failed attempt (wrong PIN or wrong reset answer). On the 3rd failure
 * a 5-minute lockout is started and the counter resets.
 * Returns whether we are now locked out and how many attempts remain.
 */
export function registerFailedAttempt(): { lockedOut: boolean; attemptsLeft: number } {
	const count = (get(LocalSettings).editPinFailureCount || 0) + 1;
	if (count >= MAX_PIN_ATTEMPTS) {
		LocalSettings.update((s) => ({
			...s,
			editPinFailureCount: 0,
			editPinLockoutUntil: Date.now() + PIN_LOCKOUT_MS
		}));
		return { lockedOut: true, attemptsLeft: 0 };
	}
	LocalSettings.update((s) => ({ ...s, editPinFailureCount: count }));
	return { lockedOut: false, attemptsLeft: MAX_PIN_ATTEMPTS - count };
}

/** Clear failure count + lockout after a successful entry/reset. */
export function clearLockout(): void {
	LocalSettings.update((s) => ({ ...s, editPinFailureCount: 0, editPinLockoutUntil: 0 }));
}

/** A multiplication challenge for the reset flow: both factors in [2, 9]. */
export function makeMultiplicationChallenge(): { a: number; b: number; answer: number } {
	const rand = () => 2 + Math.floor(Math.random() * 8); // 2..9
	const a = rand();
	const b = rand();
	return { a, b, answer: a * b };
}
