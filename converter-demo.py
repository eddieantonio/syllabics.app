#!/usr/bin/env python3
# -*- coding: UTF-8 -*-

import json

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
        data = await websocket.receive()
        await websocket.send(handle_request(data))


def jsonify(fn):
    def wrapped(raw_data, *args, **kwargs):
        parsed_data = json.loads(raw_data)
        raw_response = fn(parsed_data, *args, **kwargs)
        return json.dumps(raw_response)
    return wrapped


@jsonify
def handle_request(data):
    if 'sro' in data:
        return {'syl': sro2syllabics(data['sro'])}
    elif 'syl' in data:
        return {'sro': syllabics2sro(data['syl'])}
    else:
        return {'error': 'invalid request'}


if __name__ == '__main__':
    app.run()
