Syllabics.app
=============

[![Build Status](https://travis-ci.org/eddieantonio/syllabics.app.svg?branch=production)](https://travis-ci.org/eddieantonio/syllabics.app)
[![Cypress Recordings](https://img.shields.io/badge/cypress-recordings-f0f0f0.svg)](https://dashboard.cypress.io/#/projects/addnr3/runs)


Source code for the [syllabics.app][]. This is a Western Cree SRO to
syllabics converter app, powered by [cree-sro-syllabics][].


Develop
-------

To develop, download dependencies with `npm` (or `yarn`):

    npm install

This app builds using [Parcel]. To build, use the following:

    npx parcel build index.html

This bundles the site to `dist/`.

When I'm developing, I use Parcel in serve mode:

    npx parcel serve index.html

This starts a development server at <http://localhost:1234/> that
automatically reloads when files change.

Test
----

This project uses browser tests written in [Cypress][].

To install test dependencies, run:

    npm run install:test

This installs Cypress (very large dependency), and does **NOT** add it
to `package-lock.json`.

> **NOTE**: Cypress must NEVER be included in `package-lock.json`,
> because its file size exceeds the limits of Now's free plan (100MiB per file
> limit). Now will install everything in `package-lock.json`, which
> includes Cypress. Cypress is never used, and it **breaks the Now
> build**. As such, it must be installed separately, skipping
> `package-lock.json`.

To interactively run tests, open Cypress:

    cypress open

Add tests to `cypress/integration/`. See Cypress's docs for more help.


[Cypress]: https://www.cypress.io/


Deploy
------

This app is deployed using [Now][]. Now should automatically deploy all
pull requests, as well as the `production` branch. To run the build
script run by Now, type the following:

    npm run now-build

This will create a static site in `dist/`.

[cree-sro-syllabics]: https://github.com/eddieantonio/cree-sro-syllabics.js
[Now]: https://zeit.co/now
[Parcel]: https://parceljs.org/
[syllabics.app]: https://syllabics.app/


License
-------

Copyright (C) 2018 Eddie Antonio Santos <easantos@ualberta.ca>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
