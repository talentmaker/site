# Talentmaker Site

[![Live Site](https://img.shields.io/badge/Site-talentmaker.ca-blue?style=for-the-badge&logo=oracle)](https://talentmaker.ca)

[![GitHub](https://img.shields.io/github/license/talentmaker/site?style=flat-square)](https://github.com/talentmaker/site/blob/master/LICENSE)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/talentmaker/site/build?style=flat-square&logo=Github)](https://github.com/talentmaker/site/actions)
[![Code Size](https://img.shields.io/github/languages/code-size/talentmaker/site?style=flat-square)](.)

Web app for [talentmaker](https://talentmaker.ca) which interacts with an [api](https://github.com/talentmaker/api), hosted by a [web server](https://github.com/talentmaker/web-server).

## Browser Support

The current browserslist config covers about 90% of users

## Resources

-   [Generate PWA Icons](https://realfavicongenerator.net/)

## Path Aliasing

-   `~` is an alias for the root directory (src) of the app, simillar to the Unix home alias

## Directory Structure

The directory structure in `src/` is based off this [Free Code Camp Article](https://www.freecodecamp.org/news/a-better-way-to-structure-react-projects/)

-   `adapers`
    -   All connections to API endpoints are made here
    -   The `createAdapters` API is a nifty way to reduce imports and create endpoint interactions with minimal boilerplate
    -   Adapters should be ordered via CRUD (post, get, put, delete)
-   `components`
    -   The first "layer" defines all all **reusable** components
    -   Page-specific components go into `components/pages`
-   `contexts`
    -   Defines all React contexts
-   `images`
    -   Includes commonly reused images
-   `pages`
    -   Defines individual pages which leverage components from `components` to display content, while doing the necessary preprocessing to display these components
-   `schemas`
    -   Includes yup schemas and their respective output types
-   `styles`
    -   Global scss styles such as SASS variables
-   `utils`
    -   Utility functions
