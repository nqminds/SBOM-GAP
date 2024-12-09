input_file = "../data/cve_database_dump.sql"
output_file = "../data/postgresql_dump.sql"

with open(input_file, "r") as infile, open(output_file, "w") as outfile:
    for line in infile:
        # Replace AUTOINCREMENT with SERIAL
        line = line.replace("AUTOINCREMENT", "SERIAL")

        # Replace data types
        line = line.replace("BLOB", "BYTEA")
        line = line.replace("INTEGER", "BIGINT")  # If large numbers are expected

        # Remove SQLite pragmas
        if "PRAGMA foreign_keys=OFF;" in line:
            continue  # Skip the line

        # Adjust quoting
        line = line.replace('"', "'")

        # Write adjusted line to output file
        outfile.write(line)
