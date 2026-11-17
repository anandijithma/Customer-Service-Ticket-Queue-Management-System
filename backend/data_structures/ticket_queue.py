class TicketQueue:
    def __init__(self):
        self.items = []
        self.front_index = 0

    def enqueue(self, ticket):
        self.items.append(ticket)

    def dequeue(self):
        if self.is_empty():
            return None

        ticket = self.items[self.front_index]
        self.front_index += 1
        return ticket

    def is_empty(self):
        return self.front_index >= len(self.items)

    def size(self):
        return len(self.items) - self.front_index

    def get_all_items(self):
        return self.items[self.front_index:]

    def restore_from(self, temp_queue):
        while not temp_queue.is_empty():
            self.enqueue(temp_queue.dequeue())