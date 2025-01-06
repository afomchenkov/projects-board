-- Project table
CREATE TABLE IF NOT EXISTS Project (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Name VARCHAR(250) NOT NULL,
    Description VARCHAR(1024) NOT NULL,
    Metadata JSONB DEFAULT NULL,
    Created_At TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Board table
CREATE TABLE IF NOT EXISTS Board (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Name VARCHAR(250) NOT NULL,
    Description VARCHAR(1024) NOT NULL,
    Project_Id UUID NOT NULL REFERENCES Project(Id),
    Metadata JSONB DEFAULT NULL,
    Created_At TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Board columns table
CREATE TABLE IF NOT EXISTS Board_Column (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Name VARCHAR(250) NOT NULL,
    Description VARCHAR(1024) NOT NULL,
    Ordinal BIGSERIAL NOT NULL,
    Board_Id UUID NOT NULL REFERENCES Board(Id),
    Metadata JSONB DEFAULT NULL,
    Created_At TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Board (Case) cards table
CREATE TABLE IF NOT EXISTS Case_Card (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Name VARCHAR(250) NOT NULL,
    Description VARCHAR(1024) NOT NULL,
    Ordinal BIGSERIAL NOT NULL,
    Board_Column_Id UUID NOT NULL REFERENCES Board_Column(Id),
    Metadata JSONB DEFAULT NULL,
    Created_At TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Project (Id, Name, Description, Metadata) 
VALUES 
    ('5bccd458-05fc-47e0-b21f-f709125d4f7d', 'Project Alpha', 'This is the description for Project Alpha.', '{"status": "active", "priority": "high"}'),
    ('2d646d0a-9dbb-488c-9c13-4a32a4702d72', 'Project Beta', 'This is the description for Project Beta.', '{"status": "inactive", "priority": "low"}');


INSERT INTO Board (Id, Name, Description, Project_Id, Metadata)
VALUES 
    ('f25fc125-cb6e-436f-8efe-6972d8a3aed6', 'Board Alpha 1', 'This is the first board for Project Alpha.', '5bccd458-05fc-47e0-b21f-f709125d4f7d', '{"status": "active", "type": "kanban"}'),
    ('d19a55e8-bf8b-4dff-b3a1-3c9ac62adfb3', 'Board Alpha 2', 'This is the second board for Project Alpha.', '5bccd458-05fc-47e0-b21f-f709125d4f7d', '{"status": "inactive", "type": "scrum"}'),
    ('4aa004a8-211f-4ee5-bc1f-9866719addb1', 'Board Beta 1', 'This is the first board for Project Beta.', '2d646d0a-9dbb-488c-9c13-4a32a4702d72', '{"status": "active", "type": "roadmap"}'),
    ('35fbadd2-2333-4793-8702-4cddae5ca9c6', 'Board Beta 2', 'This is the second board for Project Beta.', '2d646d0a-9dbb-488c-9c13-4a32a4702d72', '{"status": "inactive", "type": "kanban"}');

INSERT INTO Board_Column (Id, Name, Description, Ordinal, Board_Id, Metadata)
VALUES
    -- Columns for Board 1
    ('1874af08-29cb-471a-9dc3-98e1dc0ce6bb', 'Todo', 'Tasks to be done', 1, 'f25fc125-cb6e-436f-8efe-6972d8a3aed6', '{"color": "blue"}'),
    ('c9b19267-7a63-4a4b-9757-901c7d6b302b', 'In Progress', 'Tasks in progress', 2, 'f25fc125-cb6e-436f-8efe-6972d8a3aed6', '{"color": "yellow"}'),
    ('e0377443-dba4-4387-a3a3-5cf076a196eb', 'Quality Control', 'Tasks under review', 3, 'f25fc125-cb6e-436f-8efe-6972d8a3aed6', '{"color": "orange"}'),
    ('c6c022b6-34a7-4f02-9bf4-d06cad72b8c2', 'Done', 'Completed tasks', 4, 'f25fc125-cb6e-436f-8efe-6972d8a3aed6', '{"color": "green"}'),

    -- Columns for Board 2
    ('dd434cd1-f784-47c2-a633-35f045c89e38', 'Todo', 'Tasks to be done', 1, 'd19a55e8-bf8b-4dff-b3a1-3c9ac62adfb3', '{"color": "blue"}'),
    ('9576c76f-df5e-43c3-b10e-f49cc169cbd1', 'In Progress', 'Tasks in progress', 2, 'd19a55e8-bf8b-4dff-b3a1-3c9ac62adfb3', '{"color": "yellow"}'),
    ('7dc82915-e00e-4dae-a067-56eb8949590e', 'Quality Control', 'Tasks under review', 3, 'd19a55e8-bf8b-4dff-b3a1-3c9ac62adfb3', '{"color": "orange"}'),
    ('03afc9ff-58f8-44d7-9ce5-9ff594881c18', 'Done', 'Completed tasks', 4, 'd19a55e8-bf8b-4dff-b3a1-3c9ac62adfb3', '{"color": "green"}'),

    -- Columns for Board 3
    ('5e06fa2d-5630-4850-a511-e9a0ed743002', 'Todo', 'Tasks to be done', 1, '4aa004a8-211f-4ee5-bc1f-9866719addb1', '{"color": "blue"}'),
    ('7702b12f-fdd8-4778-b2f9-5373f64b0222', 'In Progress', 'Tasks in progress', 2, '4aa004a8-211f-4ee5-bc1f-9866719addb1', '{"color": "yellow"}'),
    ('2e6229ee-c792-4132-a1e9-ad5b73f8c29e', 'Quality Control', 'Tasks under review', 3, '4aa004a8-211f-4ee5-bc1f-9866719addb1', '{"color": "orange"}'),
    ('38ed0ab6-12f1-41d4-a121-9d35299681c1', 'Done', 'Completed tasks', 4, '4aa004a8-211f-4ee5-bc1f-9866719addb1', '{"color": "green"}'),

    -- Columns for Board 4
    ('78d231c3-cd4a-488a-b708-8bdc14588ff2', 'Todo', 'Tasks to be done', 1, '35fbadd2-2333-4793-8702-4cddae5ca9c6', '{"color": "blue"}'),
    ('25e61ab0-7cf9-4c44-a717-fdc5d8b1f988', 'In Progress', 'Tasks in progress', 2, '35fbadd2-2333-4793-8702-4cddae5ca9c6', '{"color": "yellow"}'),
    ('398555c8-48c1-4773-a926-aaf4c1f4ef04', 'Quality Control', 'Tasks under review', 3, '35fbadd2-2333-4793-8702-4cddae5ca9c6', '{"color": "orange"}'),
    ('74a24310-0b3e-45f9-9479-f0027a44d43d', 'Done', 'Completed tasks', 4, '35fbadd2-2333-4793-8702-4cddae5ca9c6', '{"color": "green"}');

-- Board 1
-- For Column with Board_Column_Id '1874af08-29cb-471a-9dc3-98e1dc0ce6bb'
INSERT INTO Case_Card (Id, Name, Description, Ordinal, Board_Column_Id, Metadata, Created_At, Updated_At)
VALUES
  (gen_random_uuid(), 'Card 1', 'Description for card 1', nextval('case_card_ordinal_seq'), '1874af08-29cb-471a-9dc3-98e1dc0ce6bb', '{"status": "active"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Card 2', 'Description for card 2', nextval('case_card_ordinal_seq'), '1874af08-29cb-471a-9dc3-98e1dc0ce6bb', '{"status": "inactive"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Card 3', 'Description for card 3', nextval('case_card_ordinal_seq'), '1874af08-29cb-471a-9dc3-98e1dc0ce6bb', '{"status": "active"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- For Column with Board_Column_Id 'c9b19267-7a63-4a4b-9757-901c7d6b302b'
INSERT INTO Case_Card (Id, Name, Description, Ordinal, Board_Column_Id, Metadata, Created_At, Updated_At)
VALUES
  (gen_random_uuid(), 'Card 4', 'Description for card 4', nextval('case_card_ordinal_seq'), 'c9b19267-7a63-4a4b-9757-901c7d6b302b', '{"status": "active"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Card 5', 'Description for card 5', nextval('case_card_ordinal_seq'), 'c9b19267-7a63-4a4b-9757-901c7d6b302b', '{"status": "inactive"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Card 6', 'Description for card 6', nextval('case_card_ordinal_seq'), 'c9b19267-7a63-4a4b-9757-901c7d6b302b', '{"status": "archived"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- For Column with Board_Column_Id 'e0377443-dba4-4387-a3a3-5cf076a196eb'
INSERT INTO Case_Card (Id, Name, Description, Ordinal, Board_Column_Id, Metadata, Created_At, Updated_At)
VALUES
  (gen_random_uuid(), 'Card 7', 'Description for card 7', nextval('case_card_ordinal_seq'), 'e0377443-dba4-4387-a3a3-5cf076a196eb', '{"status": "active"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Card 8', 'Description for card 8', nextval('case_card_ordinal_seq'), 'e0377443-dba4-4387-a3a3-5cf076a196eb', '{"status": "inactive"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Card 9', 'Description for card 9', nextval('case_card_ordinal_seq'), 'e0377443-dba4-4387-a3a3-5cf076a196eb', '{"status": "active"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Card 10', 'Description for card 10', nextval('case_card_ordinal_seq'), 'e0377443-dba4-4387-a3a3-5cf076a196eb', '{"status": "archived"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- For Column with Board_Column_Id 'c6c022b6-34a7-4f02-9bf4-d06cad72b8c2'
INSERT INTO Case_Card (Id, Name, Description, Ordinal, Board_Column_Id, Metadata, Created_At, Updated_At)
VALUES
  (gen_random_uuid(), 'Card 11', 'Description for card 11', nextval('case_card_ordinal_seq'), 'c6c022b6-34a7-4f02-9bf4-d06cad72b8c2', '{"status": "active"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Card 12', 'Description for card 12', nextval('case_card_ordinal_seq'), 'c6c022b6-34a7-4f02-9bf4-d06cad72b8c2', '{"status": "inactive"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


-- Board 2
-- For Column with Board_Column_Id 'dd434cd1-f784-47c2-a633-35f045c89e38'
INSERT INTO Case_Card (Id, Name, Description, Ordinal, Board_Column_Id, Metadata, Created_At, Updated_At)
VALUES
  (gen_random_uuid(), 'Card 1', 'Description for card 1', nextval('case_card_ordinal_seq'), 'dd434cd1-f784-47c2-a633-35f045c89e38', '{"status": "active"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Card 2', 'Description for card 2', nextval('case_card_ordinal_seq'), 'dd434cd1-f784-47c2-a633-35f045c89e38', '{"status": "inactive"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Card 3', 'Description for card 3', nextval('case_card_ordinal_seq'), 'dd434cd1-f784-47c2-a633-35f045c89e38', '{"status": "active"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- For Column with Board_Column_Id '9576c76f-df5e-43c3-b10e-f49cc169cbd1'
INSERT INTO Case_Card (Id, Name, Description, Ordinal, Board_Column_Id, Metadata, Created_At, Updated_At)
VALUES
  (gen_random_uuid(), 'Card 4', 'Description for card 4', nextval('case_card_ordinal_seq'), '9576c76f-df5e-43c3-b10e-f49cc169cbd1', '{"status": "active"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Card 5', 'Description for card 5', nextval('case_card_ordinal_seq'), '9576c76f-df5e-43c3-b10e-f49cc169cbd1', '{"status": "inactive"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Card 6', 'Description for card 6', nextval('case_card_ordinal_seq'), '9576c76f-df5e-43c3-b10e-f49cc169cbd1', '{"status": "archived"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- For Column with Board_Column_Id '7dc82915-e00e-4dae-a067-56eb8949590e'
INSERT INTO Case_Card (Id, Name, Description, Ordinal, Board_Column_Id, Metadata, Created_At, Updated_At)
VALUES
  (gen_random_uuid(), 'Card 7', 'Description for card 7', nextval('case_card_ordinal_seq'), '7dc82915-e00e-4dae-a067-56eb8949590e', '{"status": "active"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Card 8', 'Description for card 8', nextval('case_card_ordinal_seq'), '7dc82915-e00e-4dae-a067-56eb8949590e', '{"status": "inactive"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Card 9', 'Description for card 9', nextval('case_card_ordinal_seq'), '7dc82915-e00e-4dae-a067-56eb8949590e', '{"status": "active"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Card 10', 'Description for card 10', nextval('case_card_ordinal_seq'), '7dc82915-e00e-4dae-a067-56eb8949590e', '{"status": "archived"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- For Column with Board_Column_Id '03afc9ff-58f8-44d7-9ce5-9ff594881c18'
INSERT INTO Case_Card (Id, Name, Description, Ordinal, Board_Column_Id, Metadata, Created_At, Updated_At)
VALUES
  (gen_random_uuid(), 'Card 11', 'Description for card 11', nextval('case_card_ordinal_seq'), '03afc9ff-58f8-44d7-9ce5-9ff594881c18', '{"status": "active"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Card 12', 'Description for card 12', nextval('case_card_ordinal_seq'), '03afc9ff-58f8-44d7-9ce5-9ff594881c18', '{"status": "inactive"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
