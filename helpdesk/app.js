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

}

const hd = new Helpdesk();