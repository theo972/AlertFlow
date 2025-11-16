<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251116201829 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP SEQUENCE reporting_id_seq CASCADE');
        $this->addSql('ALTER TABLE reporting DROP CONSTRAINT fk_bd7cfa9f16fe72e1');
        $this->addSql('ALTER TABLE reporting DROP CONSTRAINT fk_bd7cfa9fde12ab56');
        $this->addSql('DROP TABLE reporting');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('CREATE SEQUENCE reporting_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE reporting (id SERIAL NOT NULL, created_by INT DEFAULT NULL, updated_by INT DEFAULT NULL, title VARCHAR(255) NOT NULL, description VARCHAR(255) DEFAULT NULL, category VARCHAR(255) DEFAULT NULL, priority INT NOT NULL, status VARCHAR(255) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX idx_bd7cfa9f16fe72e1 ON reporting (updated_by)');
        $this->addSql('CREATE INDEX idx_bd7cfa9fde12ab56 ON reporting (created_by)');
        $this->addSql('ALTER TABLE reporting ADD CONSTRAINT fk_bd7cfa9f16fe72e1 FOREIGN KEY (updated_by) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE reporting ADD CONSTRAINT fk_bd7cfa9fde12ab56 FOREIGN KEY (created_by) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }
}
