<?php

namespace App\Service\User;

use App\Entity\Ticket;
use App\Entity\User;
use App\Service\Search\Provider\AbstractSearchProvider;
use Symfony\Component\DependencyInjection\Attribute\AutoconfigureTag;

#[AutoconfigureTag('app.search_provider', attributes: ['target' => 'user'])]
final class UserSearchProvider extends AbstractSearchProvider
{
    protected function getEntityClass(): string
    {
        return User::class;
    }
}
