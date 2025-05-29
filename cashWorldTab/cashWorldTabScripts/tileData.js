// tileData.js - Persistent tileMap cache using localStorage

export class TileData {
    constructor(seed) {
        this.seed = seed;
        this.cache = new Map();  // In-memory cache
    }

    _getKey(cx, cy) {
        // Unique key per seed and chunk coords
        return `tiledata_${this.seed}_${cx}_${cy}`;
    }

    // Try to get chunk from memory or localStorage
    getChunk(cx, cy) {
        const key = this._getKey(cx, cy);
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        // Check localStorage (persistent across sessions:contentReference[oaicite:5]{index=5})
        const json = localStorage.getItem(key);
        if (json) {
            try {
                const data = JSON.parse(json);
                this.cache.set(key, data);
                return data;
            } catch (e) {
                console.warn('Failed to parse cached chunk', e);
                localStorage.removeItem(key);
            }
        }
        return null;
    }

    // Save chunk data to memory and localStorage
    saveChunk(cx, cy, data) {
        const key = this._getKey(cx, cy);
        this.cache.set(key, data);
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.warn('localStorage full or unavailable:', e);
        }
    }

    // Clear all cached data for the current seed (on world reset)
    clearCache() {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(`tiledata_${this.seed}_`)) {
                localStorage.removeItem(key);
                i--; // adjust index after removal
            }
        }
        this.cache.clear();
    }
}
