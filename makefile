push:
	$(eval TAG := $(shell npm version patch))
	npm run build
	git push origin master
	git push origin $(TAG)
	npm publish
	tnpm sync