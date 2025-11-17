<?php

namespace App\Service\User;

use App\Entity\User;
use DateTime;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserService
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly UserPasswordHasherInterface $passwordHasher,
    ) {}

    public function register(User $user): bool
    {
        if (null !== $user->getPasswordPlain() && $user->getPasswordPlain() !== '') {
            $encodedPassword = $this->passwordHasher->hashPassword($user, $user->getPasswordPlain());
            $user->setPassword($encodedPassword);
        }
        $user->setRoles(['ROLE_USER']);
        $now = new \DateTime();
        $user->setCreatedAt($now);
        $user->setUpdatedAt($now);
        $user->setLastActive($now);
        if ($user->getStatus() === null || $user->getStatus() === '') {
            $user->setStatus('Active');
        }
        if ($user->getPermissions() === [] || $user->getPermissions() === null) {
            $user->setPermissions([]);
        }
        $user->eraseCredentials();
        $this->em->persist($user);
        $this->em->flush();

        return true;
    }

    public function update(User $user): bool
    {
        $user->setUpdatedAt(new DateTime());
        if ($user->getPasswordPlain()) {
            $hash = $this->passwordHasher->hashPassword($user, $user->getPasswordPlain());
            $user->setPassword($hash);
        }
        $this->em->flush();

        return true;
    }

    public function delete(User $user): bool
    {
        $this->em->remove($user);
        $this->em->flush();

        return true;
    }
}
