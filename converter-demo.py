#!/usr/bin/env python3
# -*- coding: UTF-8 -*-

from quart import Quart, websocket, render_template
from crk_orthography import (
    sro2syllabics, syllabics2sro, __version__ as library_version
)

app = Quart(__name__)


@app.route('/')
async def hello():
    return await render_template('index.html',
                                 library_version=library_version)


@app.websocket('/ws')
async def ws():
    while True:
        await websocket.send('hello')


if __name__ == '__main__':
    app.run()
