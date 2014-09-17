ids.txt:
	cat objects.txt | rev | cut -d' ' -f1 | rev | while read acc; do mia $$acc | head -1; done > ids.txt
