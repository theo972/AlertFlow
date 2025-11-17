<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251116235657 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE "user" ADD name VARCHAR(150) DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ADD role_label VARCHAR(100) DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ADD permissions JSON DEFAULT \'[]\'');
        $this->addSql('ALTER TABLE "user" ADD last_active TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ADD status VARCHAR(50) DEFAULT \'Active\'');
        $this->addSql('ALTER TABLE "user" ADD created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW()');
        $this->addSql('ALTER TABLE "user" ADD updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW()');
        $this->addSql('UPDATE "user" SET name = email WHERE name IS NULL');
        $this->addSql('UPDATE "user" SET role_label = \'Member\' WHERE role_label IS NULL');
        $this->addSql('UPDATE "user" SET permissions = \'[]\'::json WHERE permissions IS NULL');
        $this->addSql('UPDATE "user" SET status = \'Active\' WHERE status IS NULL');
        $this->addSql('UPDATE "user" SET created_at = NOW() WHERE created_at IS NULL');
        $this->addSql('UPDATE "user" SET updated_at = NOW() WHERE updated_at IS NULL');
        $this->addSql('UPDATE "user" SET last_active = NOW() WHERE last_active IS NULL');
        $this->addSql('ALTER TABLE "user" ALTER COLUMN name SET NOT NULL');
        $this->addSql('ALTER TABLE "user" ALTER COLUMN role_label SET NOT NULL');
        $this->addSql('ALTER TABLE "user" ALTER COLUMN permissions SET NOT NULL');
        $this->addSql('ALTER TABLE "user" ALTER COLUMN status SET NOT NULL');
        $this->addSql('ALTER TABLE "user" ALTER COLUMN created_at SET NOT NULL');
        $this->addSql('ALTER TABLE "user" ALTER COLUMN updated_at SET NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE "user" DROP name');
        $this->addSql('ALTER TABLE "user" DROP role_label');
        $this->addSql('ALTER TABLE "user" DROP permissions');
        $this->addSql('ALTER TABLE "user" DROP last_active');
        $this->addSql('ALTER TABLE "user" DROP status');
        $this->addSql('ALTER TABLE "user" DROP created_at');
        $this->addSql('ALTER TABLE "user" DROP updated_at');
    }
}
