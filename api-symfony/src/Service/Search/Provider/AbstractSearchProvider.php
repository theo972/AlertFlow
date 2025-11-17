<?php

namespace App\Service\Search\Provider;

use App\Dto\SearchQuery;
use Doctrine\ORM\EntityManagerInterface;

abstract class AbstractSearchProvider implements SearchProviderInterface
{
    public function __construct(
        protected readonly EntityManagerInterface $em
    ) {}

    abstract protected function getEntityClass(): string;

    protected function getAllFields(): array
    {
        return $this->em->getClassMetadata($this->getEntityClass())->getFieldNames();
    }

    protected function getSearchableFields(): array
    {
        $metadata = $this->em->getClassMetadata($this->getEntityClass());
        $fields = [];
        foreach ($metadata->getFieldNames() as $fieldName) {
            $type = $metadata->getTypeOfField($fieldName);
            if (\in_array($type, ['string', 'text'], true)) {
                $fields[] = sprintf('%s.%s', 'e', $fieldName);
            }
        }
        return $fields;
    }

    protected function getFieldMap(): array
    {
        $fields = [];
        foreach ($this->getAllFields() as $fieldName) {
            $fields[$fieldName] = sprintf('%s.%s', 'e', $fieldName);
        }
        return $fields;
    }

    public function search(SearchQuery $searchQuery): array
    {
        $entityClass = $this->getEntityClass();

        $qb = $this->em->createQueryBuilder()
            ->select('e')
            ->from($entityClass, 'e');

        $searchableFields = $this->getSearchableFields();
        if ($searchQuery->query && !empty($searchableFields)) {
            foreach ($searchableFields as $fieldExpr) {
                $qb->andWhere(sprintf('%s LIKE :query', $fieldExpr));
            }
            $qb->setParameter('query', '%'.$searchQuery->query.'%');
        }


        $filterableFields = $this->getFieldMap();
        foreach ($searchQuery->filters as $key => $value) {
            if ($value === null || $value === '') {
                continue;
            }
            if (!isset($filterableFields[$key])) {
                continue;
            }
            $fieldExpr = $filterableFields[$key];
            $paramName = 'f_'.$key;
            $qb->andWhere(sprintf('%s = :%s', $fieldExpr, $paramName))
                ->setParameter($paramName, $value);
        }
        $sortableFields = $this->getFieldMap();
        $sortKey = $searchQuery->sort;
        $order = strtolower($searchQuery->order ?? 'asc');
        if (!\in_array($order, ['asc', 'desc'], true)) {
            $order = 'asc';
        }
        if ($sortKey && isset($sortableFields[$sortKey])) {
            $qb->orderBy($sortableFields[$sortKey], $order);
        } else if (isset($sortableFields['id'])) {
            $qb->orderBy($sortableFields['id'], 'desc');
        }

        $page = max(1, $searchQuery->page);
        $perPage = max(1, min(100, $searchQuery->perPage));
        $total = (int) (clone $qb)
            ->select(sprintf('COUNT(%s.id)', 'e'))
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
