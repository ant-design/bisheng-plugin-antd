push:
	npm run build
	git add ./lib 
	git commit -m 'build'
	git push origin master