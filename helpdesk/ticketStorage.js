export class TicketStorage {
    saveToStorage() {
        const data = {
            tickets: this.tickets,
            currentId: this.currentId
        };
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    loadFromStorage() {
        const raw = localStorage.getItem(this.storageKey);
        if (!raw) return;

        try {
            const data = JSON.parse(raw);
            this.tickets = data.tickets ?? [];
            this.currentId = data.currentId ?? 1;
        } catch (e) {
            console.error("Corrupted storage data", e);
            localStorage.removeItem(this.storageKey);
        }
    }
}
