# Backup and Restore Runbook

## Backup scope
- PostgreSQL database
- Media uploads/storage volume

## Backup frequency
- Database: daily full backup + frequent WAL/incremental strategy (platform-dependent)
- Media: daily snapshot or object storage versioning

## Retention
- Keep at least 14 daily + 8 weekly backups.

## Restore drill (staging)
1. Provision clean database instance.
2. Restore latest backup.
3. Restore media snapshot.
4. Validate key flows:
   - Article fetch by slug
   - Search
   - E-paper page rendering

## Incident response note
- Maintain documented Recovery Time Objective (RTO) and Recovery Point Objective (RPO).
