<?php

namespace App\DataFixtures;

use App\Entity\Ticket;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class TicketFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $platforms = ['Web', 'Mobile', 'API', 'Backoffice'];
        $categories = ['Bug', 'Feature', 'Support', 'Performance'];
        $priorities = ['low', 'medium', 'high'];
        $teams = ['Support', 'Backend', 'Frontend', 'Infra'];
        $statuses = ['open', 'in_progress', 'resolved', 'closed'];

        $assignees = [
            'Théovady Moutty',
            'Manon Storne',
            'Jean Dupont',
            'Alice Martin',
            'Support Team',
        ];

        $submitters = [
            'Client A',
            'Client B',
            'Internal QA',
            'PO Web',
            'Support Level 1',
        ];

        /** @var User|null $user */
        $user = $manager->getRepository(User::class)->findOneBy([]);
        for ($i = 1; $i <= 30; $i++) {
            $ticket = new Ticket();

            $ticket
                ->setTitle(sprintf('Ticket #%d - problème de connexion', $i))
                ->setPlatform($platforms[array_rand($platforms)])
                ->setCategory($categories[array_rand($categories)])
                ->setPriority($priorities[array_rand($priorities)])
                ->setTeam($teams[array_rand($teams)])
                ->setAssignee($assignees[array_rand($assignees)])
                ->setSubmittedBy($submitters[array_rand($submitters)])
                ->setStatus($statuses[array_rand($statuses)])
                ->setDescription('Description auto-générée pour les tests de la table des tickets.');

            $date = new \DateTime(sprintf('-%d days', random_int(0, 20)));
            $ticket->setCreatedAt($date);
            $ticket->setUpdatedAt(new \DateTime());
            $ticket->setCreatedBy($user);
            $ticket->setUpdatedBy($user);

            $manager->persist($ticket);
        }

        $manager->flush();
    }
}
