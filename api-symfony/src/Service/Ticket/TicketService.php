<?php

namespace App\Service\Ticket;

use App\Entity\Ticket;
use App\Entity\User;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;

class TicketService
{
    public function __construct(
        private readonly EntityManagerInterface $em,
    ) {
    }

    public function create(Ticket $ticket, User $user): bool
    {
        $ticket->setCreatedAt(new DateTime());
        $ticket->setUpdatedAt(new DateTime());
        $ticket->setCreatedBy($user);
        $ticket->setUpdatedBy($user);

        $this->em->persist($ticket);
        $this->em->flush();

        return true;
    }

    public function update(Ticket $ticket, User $user): bool
    {
        $ticket->setUpdatedAt(new DateTime());
        $ticket->setUpdatedBy($user);

        $this->em->flush();

        return true;
    }

    public function delete(Ticket $ticket): bool
    {
        $this->em->remove($ticket);
        $this->em->flush();

        return true;
    }
}
