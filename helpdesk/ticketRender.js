import { priorityOrder } from './ticket.js';
import { TicketStorage } from './ticketStorage.js';

export class TicketRenderer extends TicketStorage {
    renderTickets() {
        this.ticketList.innerHTML = "";

        let filteredTickets = this.filterTicketsByStatus(this.statusElement.value);

        // Sort a copy so the original tickets stay in ID order.
        let sortedTickets = [...filteredTickets].sort(
            (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
        );

        sortedTickets.forEach(ticket => {
            this.createTicketDiv(ticket);
        });

        document.getElementById("showing").textContent = sortedTickets.length;
        document.getElementById("totalTickets").textContent = this.tickets.length;

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
            this.saveToStorage();
        });

        removeLabel.addEventListener("click", () => {
            this.removeTicket(ticket.id);
            this.renderTickets();
        });
    }
}
