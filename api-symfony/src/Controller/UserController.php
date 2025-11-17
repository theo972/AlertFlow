<?php

namespace App\Controller;

use App\Dto\ValidationErrorResponse;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\User\UserService;
use Nelmio\ApiDocBundle\Attribute\Model;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/users')]
class UserController extends AbstractApiController
{
    #[Route('/{id}', methods: ['GET'])]
    public function show(User $user): JsonResponse
    {
        return $this->json(
            ['user' => $user],
            Response::HTTP_OK,
            ['groups' => ['user:read']]
        );
    }

    #[Route('', methods: ['POST'])]
    public function create(
        Request $request,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
        UserService $userService,
    ): JsonResponse {
        $result = false;
        /** @var User $user */
        $user = $serializer->deserialize(
            $request->getContent(),
            User::class,
            'json',
            ['groups' => ['register:create']]
        );

        $user->setPasswordPlain($user->getPassword());
        $errors = $validator->validate($user, null, ['register:create']);
        if (0 === count($errors)) {
            $result = $userService->register($user);
        }

        return $this->json(
            [
                'result' => $result,
                'errors' => $errors,
                'user' => $user,
            ],
            $result ? Response::HTTP_CREATED : Response::HTTP_BAD_REQUEST
        );
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update(
        User $user,
        Request $request,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
        UserService $userService,
    ): JsonResponse {
        $content = (string) $request->getContent();

        /** @var User $user */
        $user = $serializer->deserialize($content, User::class, 'json', [
            'groups' => ['user:update'],
            AbstractNormalizer::OBJECT_TO_POPULATE => $user,
        ]);

        $errors = $validator->validate($user, null, ['user:update']);

        $result = false;
        if (0 === count($errors)) {
            $result = $userService->update($user);
        }

        return $this->json(
            [
                'result' => $result,
                'errors' => $errors,
                'user' => $user,
            ],
            $result ? Response::HTTP_OK : Response::HTTP_BAD_REQUEST,
            ['groups' => ['user:read']]
        );
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(
        User $user,
        UserService $userService,
    ): JsonResponse {
        $result = $userService->delete($user);

        return $this->json(
            [
                'result' => $result,
                'user' => $user,
            ],
            $result ? Response::HTTP_OK : Response::HTTP_BAD_REQUEST,
            ['groups' => ['user:read']]
        );
    }
}
