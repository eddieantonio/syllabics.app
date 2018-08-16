# Requires icoutils
# 	brew install icoutils  # macOS
#   apt install icoutils  # Ubuntu/Debian
# Requires inkscape
ICO_SIZES := 16 32
ICO_PNGS := $(patsubst %,favicon-%.png,$(ICO_SIZES))
FAVICON_SIZES := $(ICO_SIZES) 96
FAVICON_PNGS := $(patsubst %,favicon-%.png,$(FAVICON_SIZES))

.PHONY: all
all: favicon.ico $(FAVICON_PNGS)

favicon.ico: $(ICO_PNGS)
	icotool -c $(ICO_PNGS) -o $@

$(FAVICON_PNGS): favicon.svg
	inkscape -z $< --export-png=$@\
		--export-area-page\
		--export-width=$(patsubst favicon-%.png,%,$@)\
		--export-background-opacity=0
	optipng -o7 $@
