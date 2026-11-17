
const priorityOrder = {
    high: 1,
    normal: 2,
    low: 3
}

const statuses = ['new', 'doing', 'done'];

class Helpdesk {
    constructor() {
        this.storageKey = "helpdeskData";
        this.tickets = [];
        this.currentId = 1;
        this.statusElement = document.getElementById("status");
        this.ticketList = document.getElementById("list");
        this.loadFromStorage();
    }

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

    addTicket(ticket) {
        feedbackLabel.textContent = "";

        if (this.tickets.length < 1000) {
            this.tickets.push(ticket);
            this.saveToStorage();
            return true;
        }

        feedbackLabel.textContent = "too many tickets!";
        return false;
    }

    getTickets() {
        return this.tickets;
    }

    removeTicket(id) {
        let left = 0,
            right = this.tickets.length - 1;

        while (left <= right) {
            let pivot = Math.floor((left + right) / 2);
            let ticket = this.tickets[pivot];

            if (ticket.id === id) {
                this.tickets.splice(pivot, 1);
                this.saveToStorage();
                return true;
            }
            else if (ticket.id > id) {
                right = pivot - 1;
            }
            else {
                left = pivot + 1;
            }
        }

        return false;
    }

    getTicketAmount() {
        return this.tickets.length;
    }

    filterTicketsByStatus(status) {
        if (status === "all")
            return this.tickets;

        if (!(statuses.includes(status))) {
            return [];
        }

        return this.tickets.filter(ticket => ticket.status === status);
    }

    renderTickets() {
        this.ticketList.innerHTML = "";

        let filteredTickets = helpdesk.filterTicketsByStatus(this.statusElement.value);

        // Sort a copy so the original tickets stay in ID order.
        let sortedTickets = [...filteredTickets].sort(
            (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
        );

        sortedTickets.forEach(ticket => {
            this.createTicketDiv(ticket);
        });

        document.getElementById("showing").textContent = sortedTickets.length;
        document.getElementById("totalTickets").textContent = helpdesk.tickets.length;

        if (sortedTickets.length === 0) {
            this.ticketList.textContent = "no tickets to show!";
        }
    }

    createTicketDiv(ticket) {
        let newTicketDiv = document.createElement("div");
        newTicketDiv.id = ticket.id;
        newTicketDiv.className = "ticketDiv";

        let titleLabel = document.createElement("p");
        titleLabel.textContent = ticket.title;
        titleLabel.className = "ticketTitle";

        let priorityLabel = document.createElement("p");
        priorityLabel.textContent = `Priority: ${ticket.priority}`;
        priorityLabel.className = "ticketPriority";

        let statusLabel = document.createElement("p");
        statusLabel.className = "ticketStatus";

        let statusSelect = document.createElement("select");
        statusSelect.className = "ticketStatusSelect";
        statusSelect.id = `statusSelect${ticket.id}`;

        const optionNew = new Option("New", "new");
        const optionDoing = new Option("Doing", "doing");
        const optionDone = new Option("Done", "done");

        statusSelect.add(optionNew);
        statusSelect.add(optionDoing);
        statusSelect.add(optionDone);

        statusSelect.value = ticket.status;

        statusLabel.textContent = "Status: ";
        statusLabel.appendChild(statusSelect);

        const removeLabel = document.createElement("p");
        removeLabel.className = "removeLabel";
        removeLabel.textContent = "Remove";

        newTicketDiv.appendChild(titleLabel);
        newTicketDiv.appendChild(priorityLabel);
        newTicketDiv.appendChild(statusLabel);
        newTicketDiv.appendChild(removeLabel);

        this.ticketList.appendChild(newTicketDiv);

        statusSelect.addEventListener("change", () => {
            ticket.status = statusSelect.value;
            helpdesk.saveToStorage();
        });

        removeLabel.addEventListener("click", () => {
            helpdesk.removeTicket(ticket.id);
            helpdesk.renderTickets();
        });
    }

    import(importData) {
        let data;

        try {
            data = JSON.parse(importData);
        }
        catch (error) {
            return "invalid JSON file";
        }

        if (!Array.isArray(data))
            return "wrong JSON format";

        if (data.length > 1000)
            return "too many tickets in the file";

        for (const ticket of data) {
            if (ticket == null || typeof ticket !== "object")
                return "each ticket must be an object";

            if (!Number.isInteger(ticket.id) || ticket.id < 1)
                return "id needs to be a positive integer";

            if (typeof ticket.title !== "string")
                return "title needs to be of type string";

            if (typeof ticket.priority !== "string")
                return "priority needs to be of type string";

            if (!(ticket.priority in priorityOrder))
                return "incorrect priority";

            if (typeof ticket.status !== "string")
                return "status needs to be of type string";

            if (!statuses.includes(ticket.status))
                return "incorrect status";
        }

        // Keep tickets in ID order because removeTicket uses binary search.
        data.sort((a, b) => a.id - b.id);

        for (let i = 1; i < data.length; i++) {
            if (data[i].id === data[i - 1].id)
                return "ticket IDs must be unique";
        }

        this.tickets = data;
        this.currentId = data.length > 0
            ? data[data.length - 1].id + 1
            : 1;

        this.saveToStorage();
        this.renderTickets();

        return "import successful";
    }
}

document.getElementById("title").focus();

const helpdesk = new Helpdesk();

const feedbackLabel = document.getElementById("feedback");

helpdesk.renderTickets();

document.getElementById("submitButton").addEventListener('click', (e) => {
    e.preventDefault(); // prevents reload on enter

    feedbackLabel.textContent = "";

    let title = document.getElementById("title").value.trim();

    if (title.length < 3 || title.length > 80) {
        feedbackLabel.textContent = "tickets title must have between 3 and 80 characters";
        return;
    }

    let ticket = {
        id: helpdesk.currentId++,
        title: title,
        priority: document.getElementById("priority").value,
        status: "new"
    }

    document.getElementById("title").value = "";
    document.getElementById("priority").value = "low";

    helpdesk.addTicket(ticket);

    helpdesk.renderTickets();
});

helpdesk.statusElement.addEventListener('change', () => {
    helpdesk.renderTickets();
});

const fileInput = document.getElementById("importInput");

// async lets us use await while the selected file is being read.
async function handleImport(event) {
    const file = event.target.files[0];

    if (!file) {
        return;
    }

    try {
        // file.text() returns a Promise with the file's text.
        const importData = await file.text();

        alert(helpdesk.import(importData));
    }
    catch (error) {
        console.error("Could not read the import file", error);
        alert("Could not read the file. Please try again.");
    }

    // Clear the input so the same file can be selected again.
    fileInput.value = "";
}

fileInput.addEventListener("change", (event) => {
    handleImport(event);
});

document.getElementById("exportLabel").addEventListener('click', () => {
    prompt("Your export JSON", JSON.stringify(helpdesk.tickets));
});
