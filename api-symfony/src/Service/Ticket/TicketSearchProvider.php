<?php

namespace App\Service\Ticket;

use App\Dto\SearchQuery;
use App\Entity\Ticket;
use App\Service\Search\Provider\SearchProviderInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\AutoconfigureTag;

#[AutoconfigureTag('app.search_provider', attributes: ['target' => 'ticket'])]
final readonly class TicketSearchProvider implements SearchProviderInterface
{
    public function __construct(private EntityManagerInterface $em) {}

    public function search(SearchQuery $searchQuery): array
    {
        $qb = $this->em->createQueryBuilder()
            ->select('t')
            ->from(Ticket::class, 't');

        if ($searchQuery->query) {
            $qb->andWhere('t.title LIKE :query OR t.description LIKE :query OR t.assignee LIKE :query OR t.submittedBy LIKE :query')
                ->setParameter('query', '%'.$searchQuery->query.'%');
        }

        $filters = $searchQuery->filters ?? [];
        if (!empty($filters['status'])) {
            $qb->andWhere('t.status = :status')
                ->setParameter('status', $filters['status']);
        }
        if (!empty($filters['priority'])) {
            $qb->andWhere('t.priority = :priority')
                ->setParameter('priority', $filters['priority']);
        }
        if (!empty($filters['platform'])) {
            $qb->andWhere('t.platform = :platform')
                ->setParameter('platform', $filters['platform']);
        }
        if (!empty($filters['team'])) {
            $qb->andWhere('t.team = :team')
                ->setParameter('team', $filters['team']);
        }
        if (!empty($filters['assignee'])) {
            $qb->andWhere('t.assignee LIKE :assignee')
                ->setParameter('assignee', '%'.$filters['assignee'].'%');
        }

        $sort = $searchQuery->sort;
        $order = strtolower($searchQuery->order ?? 'asc');
        if (!\in_array($order, ['asc', 'desc'], true)) {
            $order = 'asc';
        }

        switch ($sort) {
            case 'title':
                $qb->orderBy('t.title', $order);
                break;
            case 'priority':
                $qb->orderBy('t.priority', $order);
                break;
            case 'status':
                $qb->orderBy('t.status', $order);
                break;
            case 'platform':
                $qb->orderBy('t.platform', $order);
                break;
        }

        $page = max(1, (int) $searchQuery->page);
        $perPage = max(1, min(100, (int) $searchQuery->perPage));
        $total = (int) (clone $qb)
            ->select('COUNT(t.id)')
            ->resetDQLPart('orderBy')
            ->getQuery()
            ->getSingleScalarResult();
        $offset = ($page - 1) * $perPage;
        $rows = $qb
            ->setFirstResult($offset)
            ->setMaxResults($perPage)
            ->getQuery()
            ->getResult();

        return [
            'data' => $rows,
            'total' => $total,
        ];
    }
}
