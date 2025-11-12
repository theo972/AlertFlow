<?php
namespace App\Dto;

final class ValidationErrorResponse
{
    public int $status;

    public string $title;

    /** @var ViolationDto[] */
    public array $errors = [];
}
