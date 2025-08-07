-- Migration corrigée : Ajouter workday_start & workday_end dans working_time section
UPDATE forms 
SET definition = jsonb_set(
  definition,
  '{sections}',
  (
    SELECT jsonb_agg(
      CASE 
        WHEN section->>'id' = 'working_time' THEN
          jsonb_set(
            section,
            '{questions}',
            (section->'questions')::jsonb || 
            '[
              {
                "id": "workday_start",
                "label": "Heure de début de journée",
                "type": "number",
                "min": 0,
                "max": 23,
                "default": 7,
                "required": false
              },
              {
                "id": "workday_end", 
                "label": "Heure de fin de journée",
                "type": "number",
                "min": 0,
                "max": 23,
                "default": 19,
                "required": false
              }
            ]'::jsonb
          )
        ELSE section
      END
    )
    FROM jsonb_array_elements(definition->'sections') AS section
  )
)
WHERE name = 'Questionaire salarié V1';