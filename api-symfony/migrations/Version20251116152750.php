<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251116152750 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE ticket (id SERIAL NOT NULL, created_by INT DEFAULT NULL, updated_by INT DEFAULT NULL, title VARCHAR(255) NOT NULL, platform VARCHAR(100) NOT NULL, category VARCHAR(100) NOT NULL, priority VARCHAR(50) NOT NULL, team VARCHAR(100) NOT NULL, assignee VARCHAR(150) DEFAULT NULL, submitted_by VARCHAR(150) NOT NULL, status VARCHAR(50) NOT NULL, description TEXT DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_97A0ADA3DE12AB56 ON ticket (created_by)');
        $this->addSql('CREATE INDEX IDX_97A0ADA316FE72E1 ON ticket (updated_by)');
        $this->addSql('ALTER TABLE ticket ADD CONSTRAINT FK_97A0ADA3DE12AB56 FOREIGN KEY (created_by) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE ticket ADD CONSTRAINT FK_97A0ADA316FE72E1 FOREIGN KEY (updated_by) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE ticket DROP CONSTRAINT FK_97A0ADA3DE12AB56');
        $this->addSql('ALTER TABLE ticket DROP CONSTRAINT FK_97A0ADA316FE72E1');
        $this->addSql('DROP TABLE ticket');
    }
}
