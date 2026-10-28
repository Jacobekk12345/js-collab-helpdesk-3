class Helpdesk {
    constructor() {
        this.tickets = []
    }

    addTicket(ticket) {
        if (this.tickets.length < 1000) {
            this.tickets.push(ticket)
            return true;
        }
        return false;
    }

}

const hd = new Helpdesk();