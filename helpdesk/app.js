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

const hd = new Helpdesk();