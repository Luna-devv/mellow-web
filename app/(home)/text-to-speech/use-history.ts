import { useEffect, useRef, useState } from "react";

export enum State {
    Loading = 0,
    Success = 1
}

export interface HistoryItem {
    id: number;
    text: string;
    voice: string;
    base64: string;
    createdAt: number;
}

const DB_NAME = "tts";
const STORE_NAME = "clips";
const DB_VERSION = 1;

const base64ToUrl = (base64: string) => {
    const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const blob = new Blob([binary], { type: "audio/mpeg" });
    return URL.createObjectURL(blob);
};

export function useHistory() {
    const [state, setState] = useState<State>(State.Loading);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    const dbRef = useRef<IDBDatabase | null>(null);
    const urlCache = useRef<Map<number, string>>(new Map());

    useEffect(() => {
        let mounted = true;

        if (typeof window === "undefined" || !("indexedDB" in window)) {
            setError("IndexedDB is not available in this browser.");
            return;
        }

        const openDb = () => new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
                }
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        const loadHistory = async () => {
            try {
                const db = await openDb();
                if (!mounted) return;
                dbRef.current = db;

                const tx = db.transaction(STORE_NAME, "readonly");
                const store = tx.objectStore(STORE_NAME);
                const request = store.getAll();

                request.onsuccess = () => {
                    if (!mounted) return;
                    const items = (request.result as HistoryItem[]).sort((a, b) => b.createdAt - a.createdAt);
                    setHistory(items);
                    setState(State.Success);
                };

                request.onerror = () => {
                    if (!mounted) return;
                    setError("Unable to read saved clips.");
                };
            } catch {
                if (!mounted) return;
                setError("Unable to open history database.");
            }
        };

        loadHistory();

        return () => {
            mounted = false;
            dbRef.current?.close();
            for (const [, url] of urlCache.current) URL.revokeObjectURL(url);
        };
    }, []);

    const addEntry = async (entry: Omit<HistoryItem, "id">, cachedUrl?: string) => {
        const db = dbRef.current;

        const persistId = await new Promise<number>((resolve, reject) => {
            if (!db) {
                resolve(Date.now());
                return;
            }

            const tx = db.transaction(STORE_NAME, "readwrite");
            const store = tx.objectStore(STORE_NAME);
            const request = store.add(entry);

            request.onsuccess = () => resolve(request.result as number);
            request.onerror = () => reject(request.error);
        }).catch(() => Date.now());

        const url = cachedUrl ?? base64ToUrl(entry.base64);
        urlCache.current.set(persistId, url);

        setHistory((prev) => [{ ...entry, id: persistId }, ...prev]);
        return persistId;
    };

    const ensureUrl = (item: HistoryItem) => {
        if (urlCache.current.has(item.id)) return urlCache.current.get(item.id)!;
        const url = base64ToUrl(item.base64);
        urlCache.current.set(item.id, url);
        return url;
    };

    return {
        history,
        error,
        state,
        addEntry,
        ensureUrl
    };
}