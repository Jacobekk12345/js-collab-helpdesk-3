import {csvImport} from "./csvImport.js";

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
            this.tickets.push(ticket)
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
            else if (ticket.id > id)
                right = pivot - 1;
            else
                left = pivot + 1;
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
        let sortedTickets = filteredTickets.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

        sortedTickets.forEach(ticket => {
            this.createTicketDiv(ticket);
        });

        document.getElementById("showing").textContent = sortedTickets.length;
        document.getElementById("totalTickets").textContent = helpdesk.tickets.length;
    
        if (sortedTickets.length == 0) {
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
        })
    }

    import(importData) {
        let data;
        try {
            data = JSON.parse(importData);
        }
        catch(error) {
            return error;
        }

        if (data == null || typeof data != "object")
            return "wrong JSON format";

        const highestId = data[data.length - 1].id;

        console.log(highestId);

        for (const ticket of data) {
            if (typeof ticket.id != 'number')
                return "id needs to be of type int";

            if (typeof ticket.title != 'string')
                return "title needs to be of type string";

            if (typeof ticket.priority != 'string')
                return "priority needs to be of type string";
            if (!(ticket.priority in priorityOrder))
                return "incorrect priority";

            if (typeof ticket.status != 'string')
                return "status needs to be of type string";
            console.log(ticket.status)
            if (!(statuses.includes(ticket.status)))
                return "incorrect status";
        }

        this.tickets = data;
        this.currentId = highestId + 1;

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
})

helpdesk.statusElement.addEventListener('change', () => {
    helpdesk.renderTickets();
});



const fileInput = document.getElementById("importInput");
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];

    if (!file) {
        console.log("couldnt open file");
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {
        console.log(file);
        alert(helpdesk.import(reader.result));
    }

    reader.readAsText(file);
});

document.getElementById("exportLabel").addEventListener('click', () => {
    prompt("Your export JSON", JSON.stringify(helpdesk.tickets));
})