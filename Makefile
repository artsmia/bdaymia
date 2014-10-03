ids.txt:
	cat objects.txt | rev | cut -d' ' -f1 | rev | while read acc; do mia $$acc | head -1; done > ids.txt

art.json: 
	@cat ids.txt | while read id; do \
		jq -c --arg idx $$id '{key: $$idx, value: {artist: .artist, title: .title, id: $$idx, width: .image_width, height: .image_height}}' ~/tmp/collection/objects/$$((id/1000))/$$id.json; \
	done | jq -s 'from_entries' > art.json

images:
	cat ids.txt | while read id; do \
		file=images/$$id-3000.jpg; \
		if [[ ! -f $$file ]]; then \
			curl http://api.artsmia.org/images/$$id/3000/large.jpg -o $$file; \
			sleep 30; \
		fi; \
	done

.PHONY: ids.txt art.json images
