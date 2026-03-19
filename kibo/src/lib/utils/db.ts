import { DB_NAME, STORE_NAME } from '$lib/constants';

export async function getDB(): Promise<IDBDatabase> {
	const request = indexedDB.open(DB_NAME, 1);

	return new Promise((resolve, reject) => {
		request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

export async function listNotes(): Promise<string[]> {
	const db = await getDB();
	const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAllKeys();

	return await new Promise<string[]>((resolve, reject) => {
		request.onsuccess = () => resolve(request.result as string[]);
		request.onerror = () => reject(request.error);
	});
}

export async function saveNote(content: string, noteName: string): Promise<void> {
	const db = await getDB();
	const request = db
		.transaction(STORE_NAME, 'readwrite')
		.objectStore(STORE_NAME)
		.put(content, noteName);
	await new Promise<void>((resolve) => {
		request.onsuccess = () => resolve();
	});
}

export async function loadNote(noteName: string): Promise<string> {
	const db = await getDB();
	const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(noteName);

	// Wrap the request in a Promise
	const result = await new Promise<string>((resolve) => {
		request.onsuccess = () => resolve(request.result ?? '');
	});

	return typeof result === 'string' ? result : '';
}

export async function deleteNote(noteName: string): Promise<void> {
	const db = await getDB();
	// No need to wait for the delete to get completed
	db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).delete(noteName);
}
