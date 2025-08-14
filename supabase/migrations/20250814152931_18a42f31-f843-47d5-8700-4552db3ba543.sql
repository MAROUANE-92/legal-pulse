-- Supprimer d'abord les invitations liées aux dossiers
DELETE FROM invites WHERE dossier_id IN (
  '41c065b0-2ff0-420f-931d-ece2b4b4b2d0',
  '26caea8c-45ff-4fd5-aee1-d76a5985c9e5', 
  'a046e86e-aab9-4823-a014-da318ede3245'
);

-- Puis supprimer les dossiers
DELETE FROM dossiers WHERE id IN (
  '41c065b0-2ff0-420f-931d-ece2b4b4b2d0',
  '26caea8c-45ff-4fd5-aee1-d76a5985c9e5', 
  'a046e86e-aab9-4823-a014-da318ede3245'
);