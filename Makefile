ids.txt:
	cat objects.txt | rev | cut -d' ' -f1 | rev | while read acc; do mia $$acc | head -1; done > ids.txt

art.json: 
	@cat ids.txt | while read id; do \
		jq -c --arg idx $$id '{key: $$idx, value: {artist: .artist, title: .title, id: $$idx}}' ~/tmp/collection/objects/$$((id/1000))/$$id.json; \
	done | jq -s 'from_entries' > art.json

.PHONY: ids.txt art.json
