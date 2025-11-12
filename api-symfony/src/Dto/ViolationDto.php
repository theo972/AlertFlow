<?php

namespace App\Dto;


final class ViolationDto
{
    public string $propertyPath;

    public string $message;

    public ?string $code = null;
}
