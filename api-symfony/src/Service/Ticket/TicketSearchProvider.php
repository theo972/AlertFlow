<?php

namespace App\Service\Ticket;

use App\Entity\Ticket;
use App\Service\Search\Provider\AbstractSearchProvider;
use Symfony\Component\DependencyInjection\Attribute\AutoconfigureTag;

#[AutoconfigureTag('app.search_provider', attributes: ['target' => 'ticket'])]
final class TicketSearchProvider extends AbstractSearchProvider
{
    protected function getEntityClass(): string
    {
        return Ticket::class;
    }

    protected function getAlias(): string
    {
        return 't';
    }
}
