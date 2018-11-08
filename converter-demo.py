#!/usr/bin/env python3
# -*- coding: UTF-8 -*-

# Copyright (C) 2018 Eddie Antonio Santos <easantos@ualberta.ca>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.


import json

from quart import Quart, websocket, render_template, url_for
from cree_sro_syllabics import (
    sro2syllabics, syllabics2sro, __version__ as library_version
)

app = Quart(__name__)


@app.route('/')
async def hello():
    return await render_template('index.html',
                                 library_version=library_version)


@app.websocket('/ws')
async def ws():
    """
    A Websocket endpoint that calls the appropriate cree_sro_syllabics function
    """
    while True:
        data = await websocket.receive()
        await websocket.send(handle_request(data))


def handle_request(raw_data):
    if len(raw_data) > 1024:
        return json.dumps({'error': 'message too long'})

    try:
        parsed_data = json.loads(raw_data)
        raw_response = _handle_request(parsed_data)
        response = json.dumps(raw_response)
    except Exception:
        app.logger.exception(f"Error on message {raw_data!r}")
        return json.dumps({'error': 'bad message'})
    else:
        return response


def _handle_request(data):
    """
    Handles the actual request.
    """
    if 'sro' in data:
        return {'syl': sro2syllabics(data['sro'])}
    elif 'syl' in data:
        macrons = bool(data.get('macrons'))
        return {'sro': syllabics2sro(data['syl'], produce_macrons=macrons)}
    else:
        return {'error': 'invalid request'}


@app.template_filter('static_url')
def static_url(filename):
    return url_for('static', filename=filename)


if __name__ == '__main__':
    app.run()
