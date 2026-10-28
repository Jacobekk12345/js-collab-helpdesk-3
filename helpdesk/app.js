class Helpdesk {
    constructor() {
        this.tickets = [];
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
        let foundTicket = this.tickets.filter(ticket => ticket.id === id)
        if (!foundTicket)
            return false;

        foundTicket.status = newStatus;
        return true;
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

document.getElementById("enterButton").addEventListener('click', (e) => {
    e.preventDefault(); // prevents reload on enter
    let ticket = {
        id: document.getElementById("ticketId").value, // TODO: niepusty napis, do 100 znaków i unikatowy
        title: document.getElementById("title").value, // TODO: trim i 3–80 znaków
        priority: document.getElementById("priority").value,
        status: "new"
    }

    document.getElementById("ticketId").value = "";
    document.getElementById("title").value = "";
    document.getElementById("priority").value = "low";

    helpdesk.addTicket(ticket);
})

statusElement = document.getElementById("status");
statusElement.addEventListener('change', () => {
    let filteredTickets = helpdesk.filterTicketsByStatus(statusElement.value);
    filteredTickets.forEach(ticket => {
        
    });
})