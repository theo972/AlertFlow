<?php

namespace App\Entity;

use App\Repository\TicketRepository;
use App\Entity\UserTrait;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: TicketRepository::class)]
#[ORM\Table(name: 'ticket')]
class Ticket
{
    use UserTrait;

    #[ORM\Column(name: 'id', type: 'integer', nullable: false, options: ['unsigned' => true])]
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[Groups(['ticket:read'])]
    private ?int $id = null;

    #[ORM\Column(name: 'title', type: 'string', length: 255)]
    #[Assert\NotBlank(groups: ['ticket:create', 'ticket:update'])]
    #[Groups(['ticket:read', 'ticket:create', 'ticket:update'])]
    private string $title;

    #[ORM\Column(name: 'platform', type: 'string', length: 100)]
    #[Assert\NotBlank(groups: ['ticket:create', 'ticket:update'])]
    #[Groups(['ticket:read', 'ticket:create', 'ticket:update'])]
    private string $platform;

    #[ORM\Column(name: 'category', type: 'string', length: 100)]
    #[Assert\NotBlank(groups: ['ticket:create', 'ticket:update'])]
    #[Groups(['ticket:read', 'ticket:create', 'ticket:update'])]
    private string $category;

    #[ORM\Column(name: 'priority', type: 'string', length: 50)]
    #[Assert\Choice(
        options: ['low', 'medium', 'high'],
        message: 'Priority invalid',
        groups: ['ticket:create', 'ticket:update']
    )]
    #[Groups(['ticket:read', 'ticket:create', 'ticket:update'])]
    private string $priority = 'medium';

    #[ORM\Column(name: 'team', type: 'string', length: 100)]
    #[Assert\NotBlank(groups: ['ticket:create', 'ticket:update'])]
    #[Groups(['ticket:read', 'ticket:create', 'ticket:update'])]
    private string $team;

    #[ORM\Column(name: 'assignee', type: 'string', length: 150, nullable: true)]
    #[Groups(['ticket:read', 'ticket:create', 'ticket:update'])]
    private ?string $assignee = null;

    #[ORM\Column(name: 'submitted_by', type: 'string', length: 150)]
    #[Assert\NotBlank(groups: ['ticket:create'])]
    #[Groups(['ticket:read', 'ticket:create', 'ticket:update'])]
    private string $submittedBy;

    #[ORM\Column(name: 'status', type: 'string', length: 50)]
    #[Assert\Choice(
        options: ['open', 'in_progress', 'resolved', 'closed'],
        message: 'Status invalid',
        groups: ['ticket:create', 'ticket:update']
    )]
    #[Groups(['ticket:read', 'ticket:create', 'ticket:update'])]
    private string $status = 'open';

    #[ORM\Column(name: 'description', type: 'text', nullable: true)]
    #[Groups(['ticket:read', 'ticket:create', 'ticket:update'])]
    private ?string $description = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): string
    {
        return $this->title;
    }
    public function setTitle(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function getPlatform(): string
    {
        return $this->platform;
    }
    public function setPlatform(string $platform): self
    {
        $this->platform = $platform;
        return $this;
    }

    public function getCategory(): string
    {
        return $this->category;
    }
    public function setCategory(string $category): self
    {
        $this->category = $category;
        return $this;
    }

    public function getPriority(): string
    {
        return $this->priority;
    }
    public function setPriority(string $priority): self
    {
        $this->priority = $priority;
        return $this;
    }

    public function getTeam(): string
    {
        return $this->team;
    }
    public function setTeam(string $team): self
    {
        $this->team = $team;
        return $this;
    }

    public function getAssignee(): ?string
    {
        return $this->assignee;
    }
    public function setAssignee(?string $assignee): self
    {
        $this->assignee = $assignee;
        return $this;
    }

    public function getSubmittedBy(): string
    {
        return $this->submittedBy;
    }
    public function setSubmittedBy(string $submittedBy): self
    {
        $this->submittedBy = $submittedBy;
        return $this;
    }

    public function getStatus(): string
    {
        return $this->status;
    }
    public function setStatus(string $status): self
    {
        $this->status = $status;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }
    public function setDescription(?string $description): self
    {
        $this->description = $description;
        return $this;
    }
}
