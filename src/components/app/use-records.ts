"use client";

import { useCallback, useEffect, useRef, useState } from "react";

 
export function useRecords<T = Record<string, any>>(resource: string, where?: { key: string; value: string }) {
   
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const whereRef = useRef(where);
  whereRef.current = where;

  const refresh = useCallback(async () => {
    try {
      const w = whereRef.current;
      const qs = w ? `?whereKey=${w.key}&whereVal=${encodeURIComponent(w.value)}` : "";
      const res = await fetch(`/api/data/${resource}${qs}`, { cache: "no-store" });
      const json = await res.json();
      setItems(json.items || []);
    } catch (e) {
      console.error("fetch error", resource, e);
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => { refresh(); }, [refresh, where?.value]);

   
  const create = useCallback(async (data: any) => {
    const res = await fetch(`/api/data/${resource}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Gagal menyimpan");
    await refresh();
    return json.item;
  }, [resource, refresh]);

   
  const update = useCallback(async (id: string, data: any) => {
    const res = await fetch(`/api/data/${resource}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Gagal memperbarui");
    await refresh();
    return json.item;
  }, [resource, refresh]);

  const remove = useCallback(async (id: string) => {
    const res = await fetch(`/api/data/${resource}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Gagal menghapus");
    await refresh();
  }, [resource, refresh]);

  return { items, loading, refresh, create, update, remove };
}

// Fetch settings (Hulu docs)
export function useSettings(keys: string[]) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const keysRef = useRef(keys.join(","));

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/data/setting`, { cache: "no-store" });
      const json = await res.json();
       
      const map: Record<string, string> = {};
      for (const item of json.items || []) map[item.key] = item.value;
      setValues(map);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh, keysRef.current]);

  const save = useCallback(async (key: string, value: string) => {
    await fetch(`/api/data/setting`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    setValues((v) => ({ ...v, [key]: value }));
  }, []);

  return { values, loading, refresh, save };
}
