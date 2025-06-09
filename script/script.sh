echo "setting up book_management DB................"


# create database
psql -U postgres -h localhost  -c "CREATE DATABASE book_management"

#Runmigration
psql -U postgres -h localhost -d book_management -f src/database/migration/initial_schema.sql

#create stored procedure
psql -U postgres -h localhost -d book_management -f src/database/procedure/procedure-create-books.sql

psql -U postgres -h localhost -d book_management -f src/database/procedure/procedure-get-books.sql

psql -U postgres -h localhost -d book_management -f src/database/procedure/procedure-update-books.sql

psql -U postgres -h localhost -d book_management -f src/database/procedure/procedure-delete-book.sql

echo "Database setup complete......"

echo "you can now run : npm run start:dev"