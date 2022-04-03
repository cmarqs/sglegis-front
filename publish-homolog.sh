ng build --configuration=homolog
ssh-add ~/.ssh/cleiton/id_rsa
rsync -azP --delete ./public/* dokku-prod:/storage/dokku/homolog-sglegis/public