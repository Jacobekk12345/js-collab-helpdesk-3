class Helpdesk {
    constructor() {
        this.tickets = [];
        this.currentId = 1;
    }

    addTicket(ticket) {
        if (this.tickets.length < 1000) {
            this.tickets.push(ticket)
            return true;
        }
        return false;
    }

    getTickets() {
        return this.tickets;
    }

    changeTicketStatus(id, newStatus) {
        let left = 0,
            right = this.tickets.length - 1;
        while (left <= right) {
            let pivot = Math.floor((left + right) / 2);
            let ticket = this.tickets[pivot];

            if (ticket.id === id) {
                ticket.status = newStatus;
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
        if (status !== "all" &&
            status !== "new" &&
            status !== "doing" &&
            status !== "done") {
            return false;

        }

        if (status === "all")
            return this.tickets;
        
        return this.tickets.filter(ticket => ticket.status === status);
    }

}

const helpdesk = new Helpdesk();

document.getElementById("submitButton").addEventListener('click', (e) => {
    e.preventDefault(); // prevents reload on enter
    let ticket = {
        id: helpdesk.currentId++,
        title: document.getElementById("title").value, // TODO: trim i 3–80 znaków
        priority: document.getElementById("priority").value,
        status: "new"
    }

    document.getElementById("title").value = "";
    document.getElementById("priority").value = "low";

    helpdesk.addTicket(ticket);
})

statusElement = document.getElementById("status");
ticketList = document.getElementById("list");
statusElement.addEventListener('change', () => {
    ticketList.innerHTML = "";

    let filteredTickets = helpdesk.filterTicketsByStatus(statusElement.value);

    filteredTickets.forEach(ticket => {
        createTicketDiv(ticket);
    });
})

function createTicketDiv(ticket) {
    let newTicketDiv = document.createElement("div");
    newTicketDiv.id = ticket.id;
    newTicketDiv.className = "ticketDiv";

    let titleLabel = document.createElement("p");
    titleLabel.textContent = ticket.title;
    titleLabel.className = "ticketTitle";

    let priorityLabel = document.createElement("p");
    priorityLabel.textContent = ticket.priority;
    priorityLabel.className = "ticketPriority";

    let statusLabel = document.createElement("p");
    statusLabel.textContent = ticket.status;
    statusLabel.className = "ticketStatus";

    newTicketDiv.appendChild(titleLabel);
    newTicketDiv.appendChild(priorityLabel);
    newTicketDiv.appendChild(statusLabel);

    ticketList.appendChild(newTicketDiv);
}