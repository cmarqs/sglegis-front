ng build --configuration=homolog
ssh-add ~/.ssh/cleiton/id_rsa
ssh -t cleiton@dokku-prod -- "sh -c '~/backup-files.sh'"
rsync -azP ./public/* dokku-prod:/storage/dokku/homolog-sglegis/public