<?php

namespace App\Entity;

use App\Repository\UserRepository;
use DateTime;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Column(name: 'id', type: 'integer', nullable: false, options: ['unsigned' => true])]
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[Groups(['user:read'])]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 180, unique: true, nullable: false)]
    #[Assert\NotBlank(groups: ['register:create'])]
    #[Assert\Email(groups: ['register:create'])]
    #[Groups(['register:create', 'user:update', 'user:read'])]
    private ?string $email = null;

    #[ORM\Column(name: 'name', type: 'string', length: 150, nullable: false)]
    #[Assert\NotBlank(groups: ['register:create', 'user:update'])]
    #[Groups(['register:create', 'user:update', 'user:read'])]
    private ?string $name = null;

    #[ORM\Column(name: 'permissions', type: 'json', nullable: false)]
    #[Groups(['user:update', 'user:read'])]
    private array $permissions = [];

    #[ORM\Column(name: 'roles', type: 'json', nullable: false)]
    #[Groups(['user:read'])]
    private array $roles = [];

    #[ORM\Column(name: 'password', type: 'string', length: 255, nullable: false)]
    #[Assert\NotBlank(groups: ['register:create'])]
    #[Groups(['register:create'])]
    private ?string $password = null;

    #[Groups(['register:create'])]
    private ?string $passwordPlain = null;

    #[ORM\Column(name: 'last_active', type: 'datetime', nullable: true)]
    #[Groups(['user:read'])]
    private ?\DateTime $lastActive = null;

    #[ORM\Column(name: 'status', type: 'string', length: 50, nullable: false)]
    #[Assert\Choice(options: ['Active', 'Invited', 'Disabled'], groups: ['user:update'])]
    #[Groups(['user:update', 'user:read'])]
    private string $status = 'Active';

    #[ORM\Column(name: 'created_at', type: 'datetime', nullable: false)]
    #[Groups(['user:read'])]
    private DateTime $createdAt;

    #[ORM\Column(name: 'updated_at', type: 'datetime', nullable: false)]
    #[Groups(['user:read'])]
    private DateTime $updatedAt;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getPermissions(): array
    {
        return $this->permissions;
    }

    public function setPermissions(array $permissions): static
    {
        $this->permissions = $permissions;

        return $this;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getPasswordPlain(): ?string
    {
        return $this->passwordPlain;
    }

    public function setPasswordPlain(?string $password): static
    {
        $this->passwordPlain = $password;

        return $this;
    }

    public function eraseCredentials(): void
    {
        $this->passwordPlain = null;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getLastActive(): ?DateTime
    {
        return $this->lastActive;
    }

    public function setLastActive(?\DateTime $lastActive): static
    {
        $this->lastActive = $lastActive;

        return $this;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getCreatedAt(): \DateTime
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTime $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): \DateTime
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(DateTime $updatedAt): static
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }
}
