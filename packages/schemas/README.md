# Schemas directory

To create a new schema run, navigate to `/src` and run:
```bash
  schemaTools new-schema <schema_name>
```

This will create a blank schema.yaml for you to edit:

```yaml
$id: SCHEMA_ID                                          # Typically the URL (in github of where this schema is - it will need to be unique)
$schema: https://json-schema.org/draft/2019-09/schema
title: SCHEMA_TITLE                                     # The title of your schema
description: SCHEMA_DESCRIPTION                         # Schema description
type: object
properties:                                             # Define schema properties here
  FIELD: 
    type: FIELD_TYPE
    description: FIELD_DESCRIPTION
required:
  - PROPERTY_ID                                         # Required fields
examples:
  - EXAMPLE: EXAMPLE_DATA                               # Example data
```