<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture
{
    public function __construct(
        private readonly UserPasswordHasherInterface $passwordHasher
    ) {}

    public function load(ObjectManager $manager): void
    {
        $usersData = [
            [
                'email'      => 'admin@example.com',
                'name'       => 'Admin User',
                'roleLabel'  => 'Owner',
                'permissions'=> ['Admin', 'Data Export', 'Data Import'],
                'status'     => 'Active',
                'roles'      => ['ROLE_ADMIN'],
                'createdAt'  => '2022-01-01 10:00:00',
                'updatedAt'  => '2025-01-01 09:00:00',
                'lastActive' => '2025-03-01 15:00:00',
            ],
            [
                'email'      => 'florence@untitledui.com',
                'name'       => 'Florence Shaw',
                'roleLabel'  => 'Owner',
                'permissions'=> ['Admin', 'Data Export', 'Data Import'],
                'status'     => 'Active',
                'roles'      => ['ROLE_USER'],
                'createdAt'  => '2022-07-04 10:00:00',
                'updatedAt'  => '2024-03-04 16:12:00',
                'lastActive' => '2024-03-04 12:00:00',
            ],
            [
                'email'      => 'olivia@untitledui.com',
                'name'       => 'Olivia Rhye',
                'roleLabel'  => 'Admin',
                'permissions'=> ['Admin', 'Data Export'],
                'status'     => 'Active',
                'roles'      => ['ROLE_USER'],
                'createdAt'  => '2023-01-10 09:30:00',
                'updatedAt'  => '2024-02-15 11:00:00',
                'lastActive' => '2024-02-15 10:45:00',
            ],
            [
                'email'      => 'phoenix@untitledui.com',
                'name'       => 'Phoenix Baker',
                'roleLabel'  => 'Member',
                'permissions'=> ['Data Export'],
                'status'     => 'Invited',
                'roles'      => ['ROLE_USER'],
                'createdAt'  => '2023-05-20 14:00:00',
                'updatedAt'  => '2023-05-21 09:00:00',
                'lastActive' => '2023-05-21 08:30:00',
            ],
            [
                'email'      => 'lana@untitledui.com',
                'name'       => 'Lana Steiner',
                'roleLabel'  => 'Member',
                'permissions'=> ['Data Import'],
                'status'     => 'Disabled',
                'roles'      => ['ROLE_USER'],
                'createdAt'  => '2022-11-02 16:20:00',
                'updatedAt'  => '2023-09-10 10:00:00',
                'lastActive' => '2023-09-01 09:15:00',
            ],
        ];

        foreach ($usersData as $data) {
            $user = new User();
            $user
                ->setEmail($data['email'])
                ->setName($data['name'])
                ->setPermissions($data['permissions'])
                ->setStatus($data['status'])
                ->setRoles($data['roles']);
            $hashed = $this->passwordHasher->hashPassword($user, 'password');
            $user->setPassword($hashed);

            $user->setCreatedAt(new \DateTime($data['createdAt']));
            $user->setUpdatedAt(new \DateTime($data['updatedAt']));
            $user->setLastActive(new \DateTime($data['lastActive']));

            $manager->persist($user);
        }

        $manager->flush();
    }
}
