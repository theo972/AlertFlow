<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251112024405 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE reporting (id INT AUTO_INCREMENT NOT NULL, created_by INT UNSIGNED DEFAULT NULL, updated_by INT UNSIGNED DEFAULT NULL, title VARCHAR(255) NOT NULL, description VARCHAR(255) DEFAULT NULL, category VARCHAR(255) DEFAULT NULL, priority INT NOT NULL, status VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, INDEX IDX_BD7CFA9FDE12AB56 (created_by), INDEX IDX_BD7CFA9F16FE72E1 (updated_by), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE reporting ADD CONSTRAINT FK_BD7CFA9FDE12AB56 FOREIGN KEY (created_by) REFERENCES `user` (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE reporting ADD CONSTRAINT FK_BD7CFA9F16FE72E1 FOREIGN KEY (updated_by) REFERENCES `user` (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE reporting DROP FOREIGN KEY FK_BD7CFA9FDE12AB56');
        $this->addSql('ALTER TABLE reporting DROP FOREIGN KEY FK_BD7CFA9F16FE72E1');
        $this->addSql('DROP TABLE reporting');
    }
}
