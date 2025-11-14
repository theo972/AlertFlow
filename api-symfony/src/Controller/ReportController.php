<?php
declare(strict_types=1);

namespace App\Controller;

use Doctrine\DBAL\Connection;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/report')]
final class ReportController extends AbstractApiController
{
    #[Route('', methods: ['GET'])]
    public function list(Request $r): JsonResponse
    {
        $size   = max(1, min(100, (int)$r->query->get('size', 20)));
        $page   = max(1, (int)$r->query->get('page', 1));
        $offset = ($page - 1) * $size;

        $total = 250;

        $statuses   = ['open', 'in_progress', 'on_hold', 'resolved', 'closed'];
        $priorities = ['low', 'medium', 'high', 'critical'];
        $categories = ['it', 'security', 'facilities', 'hr', 'finance'];
        $verbs      = ['Printer', 'Door', 'Network', 'Badge reader', 'Camera', 'Email', 'VPN', 'Laptop', 'Elevator'];
        $actions    = ['failure', 'down', 'issue', 'error', 'malfunction', 'outage', 'slow'];
        $places     = ['Gate A', '3rd floor', 'Lobby', 'Server room', 'Parking', 'Office 214', 'Reception'];

        mt_srand(crc32($page.'|'.$size));

        $data = [];
        $now  = new \DateTime('now');

        for ($i = 0; $i < $size; $i++) {
            $id = $total - ($offset + $i);
            if ($id <= 0) break;

            $status   = $statuses[array_rand($statuses)];
            $priority = $priorities[array_rand($priorities)];
            $category = $categories[array_rand($categories)];

            $title = sprintf(
                '%s %s at %s',
                $verbs[array_rand($verbs)],
                $actions[array_rand($actions)],
                $places[array_rand($places)]
            );

            $createdAt = $now->sub(new \DateInterval('PT' . mt_rand(1, 72) . 'H'));
            $updatedAt = $createdAt->add(new \DateInterval('PT' . mt_rand(0, 36) . 'H'));

            $data[] = [
                'id'        => $id,
                'title'     => $title,
                'status'    => $status,
                'priority'  => $priority,
                'category'  => $category,
                'createdAt' => $createdAt->format(\DateTimeInterface::ATOM),
                'updatedAt' => $updatedAt->format(\DateTimeInterface::ATOM),
            ];
        }

        $hasPrev = $page > 1;
        $hasNext = ($page * $size) < $total;

        return $this->json([
            'data'    => $data,
            'page'    => $page,
            'size'    => $size,
            'total'   => $total,
            'hasNext' => $hasNext,
            'hasPrev' => $hasPrev,
        ], Response::HTTP_OK);
    }

}
