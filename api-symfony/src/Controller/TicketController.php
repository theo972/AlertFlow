<?php

namespace App\Controller;

use App\Entity\Ticket;
use App\Repository\TicketRepository;
use App\Service\Ticket\TicketService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/tickets')]
class TicketController extends AbstractApiController
{
    #[Route('/show/{id}', methods: ['GET'])]
    public function getTicket(
        Ticket $ticket
    ): JsonResponse {
        return $this->json(
            ['ticket' => $ticket],
            Response::HTTP_OK,
            ['groups' => ['ticket:read']]
        );
    }

    #[Route('', methods: ['GET'])]
    public function list(
        TicketRepository $ticketRepository
    ): JsonResponse {
        $tickets = $ticketRepository->findAll();
        return $this->json(
            ['tickets' => $tickets],
            Response::HTTP_OK,
            ['groups' => ['ticket:read']]
        );
    }

    #[Route('', methods: ['POST'])]
    public function create(
        Request $request,
        ValidatorInterface $validator,
        SerializerInterface $serializer,
        TicketService $ticketService,
    ): JsonResponse {
        $result = false;

        /** @var Ticket $ticket */
        $ticket = $serializer->deserialize(
            $request->getContent(),
            Ticket::class,
            'json',
            ['groups' => ['ticket:create']]
        );

        $errors = $validator->validate($ticket, null, ['ticket:create']);
        if (0 === count($errors)) {
            $result = $ticketService->create($ticket, $this->getUser());
        }

        return $this->json(
            [
                'result' => $result,
                'errors' => $errors,
                'ticket' => $ticket,
            ],
            $result ? Response::HTTP_CREATED : Response::HTTP_BAD_REQUEST,
            ['groups' => ['ticket:read']]
        );
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update(
        string $id,
        Request $request,
        ValidatorInterface $validator,
        SerializerInterface $serializer,
        TicketRepository $ticketRepository,
        TicketService $ticketService,
    ): JsonResponse {
        $result = false;
        $ticket = $ticketRepository->find($id);
        if (null === $ticket) {
            return $this->jsonNotFound();
        }

        $content = (string) $request->getContent();
        /** @var Ticket $ticket */
        $ticket = $serializer->deserialize(
            $content,
            Ticket::class,
            'json',
            ['groups' => ['ticket:update'], AbstractNormalizer::OBJECT_TO_POPULATE => $ticket]
        );

        $errors = $validator->validate($ticket, null, ['ticket:update']);
        if (0 === count($errors)) {
            $result = $ticketService->update($ticket, $this->getUser());
        }

        return $this->json(
            [
                'result' => $result,
                'errors' => $errors,
                'ticket' => $ticket,
            ],
            $result ? Response::HTTP_OK : Response::HTTP_BAD_REQUEST,
            ['groups' => ['ticket:read']]
        );
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(
        string $id,
        TicketRepository $ticketRepository,
        TicketService $ticketService,
    ): JsonResponse {
        $ticket = $ticketRepository->find($id);
        if (null === $ticket) {
            return $this->jsonNotFound();
        }
        $result = $ticketService->delete($ticket);
        return $this->json(
            [
                'result' => $result,
                'ticket' => $ticket,
            ],
            $result ? Response::HTTP_OK : Response::HTTP_BAD_REQUEST,
            ['groups' => ['ticket:read']]
        );
    }
}
