# Requires icoutils
# 	brew install icoutils  # macOS
#   apt install icoutils  # Ubuntu/Debian
# Requires inkscape
ICO_SIZES := 16 32 128 144 152 192 512 
ICO_PNGS := $(patsubst %,favicon-%.png,16 32)
FAVICON_SIZES := $(ICO_SIZES) 96
FAVICON_PNGS := $(patsubst %,favicon-%.png,$(FAVICON_SIZES))

.PHONY: all
all: $(FAVICON_PNGS)

favicon.ico: $(ICO_PNGS)
	icotool -c $(ICO_PNGS) -o $@

$(FAVICON_PNGS): favicon.svg
	inkscape -z $< --export-png=$@\
		--export-area-page\
		--export-width=$(patsubst favicon-%.png,%,$@)\
		--export-background-opacity=0
	optipng -o7 $@
