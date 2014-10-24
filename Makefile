ids.txt:
	cat objects.txt | rev | cut -d' ' -f1 | rev | while read acc; do mia $$acc | head -1; done > ids.txt

art.json: 
	@cat ids.txt | while read id; do \
		jq -c --arg idx $$id '{key: $$idx, value: {artist: .artist, title: .title, id: $$idx, width: .image_width, height: .image_height}}' ~/tmp/collection/objects/$$((id/1000))/$$id.json; \
	done | jq -s 'from_entries' > art.json

size=3000
images:
	cat ids.txt | while read id; do \
		file=images/$$id-$(size).jpg; \
		if [[ ! -f $$file ]]; then \
			curl http://api.artsmia.org/images/$$id/$(size)/large.jpg -o $$file; \
			fi; \
	done

kris_images:
	for cut in crop logo; do \
		[[ -d images/$$cut ]] || mkdir images/$$cut; \
	done
	vipsthumbnail --size=500 -o ../../../images/crop/%s.jpg images/originals-from-kris/crop/*; \
	for size in 1000 2000 3000; do \
		vipsthumbnail --size=$$size -o ../../../images/logo/%s-$$size.jpg images/originals-from-kris/logo/*; \
	done

rsync:
	rsync -avz --delete --exclude=".git" --exclude="node_modules" --exclude="react" . dx:/apps/cdn/miabday

s3:
	s3cmd put node_modules/hellojs/dist/hellojs.all.min.js s3://mia100/app/
	s3cmd put bundle.js s3://mia100/app/bundle.js
	s3cmd put --recursive images/crop s3://mia100/app/images/
	s3cmd setacl --acl-public --recursive s3://mia100/app/

.PHONY: ids.txt art.json images kris_images
